import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/start', (req, res) => {
  console.log('Received start request with body:', req.body);
  res.json({ status: 'ok' });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});