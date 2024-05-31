import express from 'express';
import Product from './models/productModel.js';

export const app = express();

app.get('/api/home', async (req, res) => {
  const data = await Product.find();

  res.status(200).json({ status: 'succes', data });
});
