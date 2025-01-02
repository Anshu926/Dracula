const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const dbURL = process.env.ATLAS_DB_URL;
        if (!dbURL) {
            throw new Error("MongoDB connection string is missing in the environment variables.");
        }
        await mongoose.connect(dbURL); // No options needed for Driver v4+
        console.log('MongoDB Atlas Connected...');
    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB;
