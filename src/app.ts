import express from 'express';
import Product from './models/productModel.js';
import productRouter from './routes/productRoutes.js';

export const app = express();

app.get('/api/home', async (req, res) => {
  const data = await Product.find();

  res.status(200).json({ status: 'succes', data });
});

app.use('/api/v1/products', productRouter);

app.all('*', (req, res, next) => {
  res
    .status(404)
    .json({
      status: 'fail',
      message: `Can't find ${req.originalUrl} on this server!`,
    });
});
