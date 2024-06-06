import express from 'express';
import Product from './models/productModel.js';
import productRouter from './routes/productRoutes.js';
import collectionRouter from './routes/productCollectionRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/erorrController.js';

export const app = express();

app.use(express.json({ limit: '10kb' }));

app.get('/api/home', async (req, res) => {
  const data = await Product.find();

  res.status(200).json({ status: 'succes', data });
});

app.use('/api/v1/products', productRouter);

app.use('/api/v1/collections', collectionRouter);

app.use('/api/v1/admins', adminRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
