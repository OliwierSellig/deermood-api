import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

// ----------------------- Getting All Users ----------------------------

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res
    .status(200)
    .json({ status: 'succes', results: users.length, data: { users } });
});

// ----------------------- Getting Single User ----------------------------

export const getSingleUser = catchAsync(async (req, res, next) => {
  const id = req.params.userId;
  const user = await User.findById(id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({ status: 'succes', data: { user } });
});

// ----------------------- Getting User Orders ----------------------------

export const getUserOrders = catchAsync(async (req, res, next) => {
  const id = req.params.userId;
  const user = await User.findById(id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  console.log(user._id);

  const orders = await Order.find({ 'customer.id': user._id });

  res
    .status(200)
    .json({ status: 'succes', results: orders.length, data: { orders } });
});
