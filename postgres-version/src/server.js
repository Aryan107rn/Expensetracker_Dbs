import 'dotenv/config';
import express from 'express';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const PORT = process.env.PORT || 3000;
const app = express();

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

app.get('/hello', (req, res) => {
    res.send('Hello route works');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});