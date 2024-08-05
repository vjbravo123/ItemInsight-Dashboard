require('dotenv').config();
// seed.js
const mongoose = require('mongoose');
const { Item } = require('./model/model'); // Adjust the path according to your file structure
const mongoURI = process.env.MONGODB_URI;
// Data to insert
const items = [
    { name: 'iPhone 13', description: 'Apple iPhone 13 with A15 Bionic chip', price: '$799.99', rating: 5, image: 'https://via.placeholder.com/150?text=iPhone+13' },
    { name: 'Samsung Galaxy S21', description: 'Samsung Galaxy S21 with Exynos 2100', price: '$699.99', rating: 4, image: 'https://via.placeholder.com/150?text=Samsung+Galaxy+S21' },
    { name: 'Google Pixel 6', description: 'Google Pixel 6 with Tensor processor', price: '$599.99', rating: 4, image: 'https://via.placeholder.com/150?text=Google+Pixel+6' },
    { name: 'OnePlus 9 Pro', description: 'OnePlus 9 Pro with Snapdragon 888', price: '$799.99', rating: 5, image: 'https://via.placeholder.com/150?text=OnePlus+9+Pro' },
    { name: 'Xiaomi Mi 11', description: 'Xiaomi Mi 11 with Snapdragon 888', price: '$749.99', rating: 4, image: 'https://via.placeholder.com/150?text=Xiaomi+Mi+11' },
    { name: 'Sony Xperia 5 II', description: 'Sony Xperia 5 II with Snapdragon 865', price: '$949.99', rating: 4, image: 'https://via.placeholder.com/150?text=Sony+Xperia+5+II' },
    { name: 'Huawei P40 Pro', description: 'Huawei P40 Pro with Kirin 990', price: '$799.99', rating: 3, image: 'https://via.placeholder.com/150?text=Huawei+P40+Pro' },
    { name: 'Nokia 8.3 5G', description: 'Nokia 8.3 5G with Snapdragon 765G', price: '$599.99', rating: 3, image: 'https://via.placeholder.com/150?text=Nokia+8.3+5G' },
    { name: 'Oppo Find X3 Pro', description: 'Oppo Find X3 Pro with Snapdragon 888', price: '$1,099.99', rating: 4, image: 'https://via.placeholder.com/150?text=Oppo+Find+X3+Pro' },
    { name: 'Asus ROG Phone 5', description: 'Asus ROG Phone 5 with Snapdragon 888', price: '$999.99', rating: 5, image: 'https://via.placeholder.com/150?text=Asus+ROG+Phone+5' },
    { name: 'Motorola Edge 20', description: 'Motorola Edge 20 with Snapdragon 778G', price: '$499.99', rating: 4, image: 'https://via.placeholder.com/150?text=Motorola+Edge+20' },
    { name: 'Realme GT 2', description: 'Realme GT 2 with Snapdragon 888', price: '$699.99', rating: 4, image: 'https://via.placeholder.com/150?text=Realme+GT+2' },
    { name: 'Vivo X70 Pro', description: 'Vivo X70 Pro with MediaTek Dimensity 1200', price: '$849.99', rating: 4, image: 'https://via.placeholder.com/150?text=Vivo+X70+Pro' },
    { name: 'ZTE Axon 20', description: 'ZTE Axon 20 with Snapdragon 765G', price: '$399.99', rating: 3, image: 'https://via.placeholder.com/150?text=ZTE+Axon+20' },
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');

        // Clear existing data
        await Item.deleteMany({});

        // Insert new data
        await Item.insertMany(items);
        console.log('Data inserted successfully');

        // Close the connection
        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

seedDatabase();
