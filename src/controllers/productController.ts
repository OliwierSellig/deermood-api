import Product from '../models/productModel.js';
import APIFeatures from '../utils/apiFeatures.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { QueryString } from '../utils/types.js';

// ----------------------- Getting All Products ----------------------------

export const getAllProducts = catchAsync(async (req, res, next) => {
  const queryString = req.query as unknown as QueryString;

  const features = new APIFeatures(Product.find(), queryString)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query;
  res
    .status(200)
    .json({ status: 'success', results: products.length, data: { products } });
});

// ----------------------- Getting Single Product ----------------------------

export const getSingleProduct = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const product = await Product.findById(id);

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(200).json({ status: 'succes', data: { product } });
});

// ----------------------- Creating Product ----------------------------

export const createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);

  res.status(201).json({ status: 'succes', data: { newProduct } });
});

// ----------------------- Updating Product ----------------------------

export const updateProduct = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(200).json({ status: 'succes', data: { product } });
});

// ----------------------- Deleting Product ----------------------------

export const deleteProduct = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
