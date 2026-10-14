import 'dotenv/config';
import express from 'express';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Expense Tracker API");
});
app.get('/db-test', async (req, res) => {
    console.log("DB test route reached");

    try {
        const result = await pool.query("SELECT * FROM expenses");
        res.json(result.rows);
    } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).send("Database query failed");
}
});

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
        console.error("Database error:", error.message);
        res.status(500).json({ error: "Failed to save expense" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});