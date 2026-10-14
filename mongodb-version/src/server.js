import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected successfully');

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection failed:', error.message);
    });

app.get('/', (req, res) => {
    res.send('Expense Tracker API - MongoDB');
});