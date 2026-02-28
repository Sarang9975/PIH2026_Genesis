import express from 'express';
import cors from 'cors';
const app = express();
app.use(cors());
app.use(express.json());
app.get('/api/health', (req, res) => res.json({ status: 'running', phase: 'init' }));
app.listen(5000, () => console.log("Init Server listening :5000"));
