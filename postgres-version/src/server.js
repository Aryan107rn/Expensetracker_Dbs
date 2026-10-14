import 'dotenv/config';
import express from 'express';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Home route
app.get('/', (req, res) => {
    res.send('Expense Tracker API');
});

// Get all expenses
app.get('/expenses', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM expenses ORDER BY id DESC'
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
});

// Get one expense by ID
app.get('/expenses/:id', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM expenses WHERE id = $1',
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to fetch expense' });
    }
});

// Create an expense
app.post('/expenses', async (req, res) => {
    const { title, amount, category } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO expenses (title, amount, category)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [title, amount, category]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to create expense' });
    }
});

// Delete an expense
app.delete('/expenses/:id', async (req, res) => {
    try {
        const result = await pool.query(
            'DELETE FROM expenses WHERE id = $1 RETURNING *',
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.json({
            message: 'Expense deleted successfully',
            expense: result.rows[0],
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to delete expense' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});