import Product from '../models/productModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const getAllProducts = catchAsync(async (req, res) => {
  const products = await Product.find();

  res.status(200).json({ status: 'success', data: { products } });
});

export const createProduct = catchAsync(async (req, res) => {
  const newProduct = await Product.create(req.body);

  res.status(201).json({ status: 'succes', data: { newProduct } });
});

export const getSingleProduct = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const product = await Product.findById(id);

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(200).json({ status: 'succes', data: { product } });
});
