import 'dotenv/config';
import express from 'express';

const PORT = process.env.PORT || 3000;
const app = express();

app.get('/', (req, res) => {
    res.send("Expense Tracker API");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});