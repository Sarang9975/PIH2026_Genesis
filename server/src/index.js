import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ ok: true, status: 'initializing', version: '0.1.0' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server stage 1 ready on ${PORT}`));
