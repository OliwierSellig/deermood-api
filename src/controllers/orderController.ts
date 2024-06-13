import Order from '../models/orderModel.js';
import { QueryString } from '../types/types.js';
import APIFeatures from '../utils/apiFeatures.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

// ----------------------- Getting all orders -------------------------------

export const gettAllOrders = catchAsync(async (req, res, next) => {
  const queryString = req.query as unknown as QueryString;

  const features = new APIFeatures(Order.find(), queryString)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const orders = await features.query;

  res
    .status(200)
    .json({ status: 'success', results: orders.length, data: { orders } });
});

// ----------------------- Getting Single Order  ----------------------------

export const getSingleOrder = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const order = await Order.findById(id);

  if (!order) {
    return next(new AppError('No Order found with that ID', 404));
  }

  res.status(200).json({ status: 'succes', data: { order } });
});

// ----------------------- Creating Order  ----------------------------------

export const createOrder = catchAsync(async (req, res, next) => {
  const order = await Order.create(req.body);

  res.status(201).json({ status: 'succes', data: { order } });
});

// ----------------------- Updating Order -----------------------------------

export const updateOrder = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const order = await Order.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  res.status(200).json({ status: 'succes', data: { order } });
});

// ----------------------- Deleting Order -----------------------------------

export const deleteOrder = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const order = await Order.findByIdAndDelete(id);

  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
