const mongoose = require('mongoose');
const connectDB = require('./connect_db');  // Import the connectDB function
const User = require('./schema_&_model');  // Import the User model from db_schema.js

// Connect to MongoDB
connectDB();

// Dummy data for 5 users
const users = [
    { name: 'Alice', email: 'alice@example.com', age: 25, image: 'path/to/image1.jpg' },
    { name: 'Bob', email: 'bob@example.com', age: 30, image: 'path/to/image2.jpg' },
    { name: 'Charlie', email: 'charlie@example.com', age: 35, image: 'path/to/image3.jpg' },
    { name: 'David', email: 'david@example.com', age: 40, image: 'path/to/image4.jpg' },
    { name: 'Eva', email: 'eva@example.com', age: 28, image: 'path/to/image5.jpg' }
];

// Insert the dummy data into the User collection
const insertDummyData = async () => {
    try {
        await User.insertMany(users);
        console.log('Dummy data inserted successfully');
        mongoose.connection.close();  // Close the connection after insertion
    } catch (err) {
        console.error('Error inserting dummy data:', err.message);
    }
};

// Insert the data
insertDummyData();