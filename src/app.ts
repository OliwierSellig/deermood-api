import { message } from './helper.js';
import express from 'express';

export const app = express();

app.get('/api/home', (req, res) => {
  res.json({ message });
});
