import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import Expense from './models/Expense.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Home route
app.get('/', (req, res) => {
    res.send('Expense Tracker API - MongoDB');
});

// Get all expenses
app.get('/expenses', async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ _id: -1 });
        res.json(expenses);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
});

// Get one expense by ID
app.get('/expenses/:id', async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.json(expense);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to fetch expense' });
    }
});

// Create an expense
app.post('/expenses', async (req, res) => {
    const { title, amount, category } = req.body;

    try {
        const expense = await Expense.create({
            title,
            amount,
            category,
        });

        res.status(201).json(expense);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to create expense' });
    }
});

// Delete an expense
app.delete('/expenses/:id', async (req, res) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);

        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.json({
            message: 'Expense deleted successfully',
            expense,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to delete expense' });
    }
});

// Connect to MongoDB, then start the server
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
