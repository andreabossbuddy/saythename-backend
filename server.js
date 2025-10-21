import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(json());

// Routes
app.use('/api', require('./routes/subscribe').default);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});