import Product from '../models/productModel.js';
import catchAsync from '../utils/catchAsync.js';

export const getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.findById(12);

  res.status(200).json({ status: 'success', data: { products } });
});

export const createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);

  res.status(201).json({ status: 'succes', data: { newProduct } });
});
