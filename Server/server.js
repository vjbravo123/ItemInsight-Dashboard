require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Item, Comment, Credential } = require('./model/model');

const app = express();
const PORT = process.env.PORT || 5000;
const secretKey = 'your-secret-key';
const mongoURI = process.env.MONGODB_URI;
console.log(mongoURI);


const corsOptions = {
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow 'Authorization' header
};

app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB', err));

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newCredential = new Credential({ username, password: hashedPassword });
        await newCredential.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await Credential.findOne({ username });
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, secretKey, { expiresIn: '1h' });

    res.json({ token });
});

const authenticateJWT = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

app.get('/items', async (req, res) => {
    try {
        const items = await Item.find().populate('comments');
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/items/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate('comments');
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/items/:id/comments', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate('comments');
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(item.comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/comments', authenticateJWT, async (req, res) => {
    try {
        const { itemId, text, rating } = req.body;
        const newComment = new Comment({ text, rating, itemId });
        await newComment.save();
        await Item.findByIdAndUpdate(itemId, { $push: { comments: newComment._id } });
        res.status(201).json(newComment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/items', async (req, res) => {
    try {
        const newItem = new Item(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/items/:id', authenticateJWT, async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(updatedItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/items/:id', authenticateJWT, async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(204).end(); // No content
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/admin/data', authenticateJWT, async (req, res) => {
    try {
        const items = await Item.find().populate('comments');
        res.json(items);
    } catch (err) {
        console.error('Error fetching admin data:', err);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
