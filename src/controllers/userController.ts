import User from '../models/userModel.js';
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

  res.status(200).json({ status: 'succes', data: { user } });
});
