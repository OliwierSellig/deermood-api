import Admin from '../models/adminModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { checkPasswordCorrect } from '../utils/checkPasswordCorrect.js';
import { signJWT } from '../utils/signJWT.js';

// ----------------------- Logging as Admin ----------------------------

export const loginAdmin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin || !(await checkPasswordCorrect(password, admin.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = signJWT(admin._id.toString());

  res.status(201).json({
    status: 'succes',
    token,
    data: {
      admin: {
        firstName: admin.firstName,
        surname: admin.surname,
        email: admin.email,
        photo: admin.photo,
      },
    },
  });
});

// ----------------------- Getting All Admins ----------------------------

export const getAllAdmins = catchAsync(async (req, res, next) => {
  const admins = await Admin.find();

  res
    .status(200)
    .json({ status: 'succes', results: admins.length, data: { admins } });
});

// ----------------------- Getting Single Admin ----------------------------

export const getSingleAdmin = catchAsync(async (req, res, next) => {
  const id = req.params.adminId;
  const admin = await Admin.findById(id);

  res.status(200).json({ status: 'succes', data: { admin } });
});

// ----------------------- Creating Admin ----------------------------

export const createAdmin = catchAsync(async (req, res, next) => {
  const adminObject = {
    firstName: req.body.firstName,
    surname: req.body.surname,
    photo: req.body.photo,
    email: req.body.email,
    password: req.body.password,
  };
  const newAdmin = await Admin.create(adminObject);

  res.status(201).json({
    status: 'succes',
    data: {
      admin: {
        firstName: newAdmin.firstName,
        surname: newAdmin.surname,
        email: newAdmin.email,
        photo: newAdmin.photo,
      },
    },
  });
});

// ----------------------- Updating Admin ----------------------------

export const updateAdmin = catchAsync(async (req, res, next) => {
  const id = req.params.adminId;
  const updatedAdminObj: {
    firstName?: string;
    surname?: string;
    email?: string;
  } = {};

  if (req.body.firstName) updatedAdminObj.firstName = req.body.firstName;
  if (req.body.surname) updatedAdminObj.surname = req.body.surname;
  if (req.body.email) updatedAdminObj.email = req.body.email;

  const updatedAdmin = await Admin.findByIdAndUpdate(id, updatedAdminObj, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      admin: updatedAdmin,
    },
  });
});

// ----------------------- Deleting Admin ----------------------------

export const deleteAdmin = catchAsync(async (req, res, next) => {
  const id = req.params.adminId;
  const admin = await Admin.findByIdAndDelete(id);

  if (!admin) {
    return next(new AppError('No admin found with that ID', 404));
  }

  res.status(204).json({ status: 'succes', data: null });
});
