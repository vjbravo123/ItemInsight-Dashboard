const mongoose = require('mongoose');
const { Schema } = mongoose;

// Comment Schema
const commentSchema = new Schema({
    itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    text: { type: String, required: true },
    rating: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Item Schema
const itemSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: String },
    rating: { type: Number },
    image: { type: String },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
});

// Credential Schema
const credentialSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const Item = mongoose.model('Item', itemSchema);
const Comment = mongoose.model('Comment', commentSchema);
const Credential = mongoose.model('Credential', credentialSchema);

module.exports = { Item, Comment, Credential };
