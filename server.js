import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import subscribeRoutes from './routes/subscribe.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(json());

// Routes
app.use('/api', subscribeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});