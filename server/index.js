const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB Atlas
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tabs', require('./routes/tabRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));
app.use('/api/lookups', require('./routes/lookupRoutes'));

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Griha Pravesam API running' });
});

const clientDistPath = path.join(__dirname, '../client/dist');

if (fs.existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath));

    // Universal catch-all middleware (No regex errors in Node v22)
    app.use((req, res) => {
        res.sendFile(path.resolve(clientDistPath, 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`[Server running on http://localhost:${PORT}]`);
});