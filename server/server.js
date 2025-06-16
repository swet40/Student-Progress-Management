const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const cronService = require('./services/cronService');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/students', require('./routes/students'));

// Database connection
console.log('🔍 MONGO_URI being used:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI || 'fallback-url')
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("Error:", err));

    // Test route
    app.get('/', (req, res) => {
    res.json({ message: "Server working!" });
    });

    // Simple API route
        app.get('/api/test', (req, res) => {
        res.json({ message: "API working!" });
        });

        cronService.start();
        console.log('🤖 Cron service initialized');

    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});