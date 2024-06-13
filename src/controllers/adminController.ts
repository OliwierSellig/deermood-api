import { promisify } from 'util';
import Admin from '../models/adminModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { checkPasswordCorrect } from '../utils/checkPasswordCorrect.js';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import crypto from 'crypto';
import { createSendJWT } from '../utils/createSendJWT.js';
import { Email } from '../utils/email.js';
import { generate } from 'generate-password';

// ----------------------- Protecting Admin Route ----------------------------

export const protectAdmin = catchAsync(async (req, res, next) => {
  let token: string | undefined;
  if (
    req.headers?.authorization &&
    req.headers?.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1];

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );
  }

  const verifyAsync = promisify(jwt.verify) as (
    token: string,
    secretOrPublicKey: Secret,
  ) => Promise<JwtPayload>;

  const decoded = await verifyAsync(token, process.env.JWT_SECRET as Secret);

  const currentAdmin = await Admin.findById(decoded.id);

  if (!currentAdmin) {
    return next(
      new AppError(
        'The admin belonging to this token does no longer exist.',
        401,
      ),
    );
  }

  if (currentAdmin.changedPasswordAfter(decoded.iat!)) {
    return next(
      new AppError(
        'Admin recently changed password! Please log in again.',
        401,
      ),
    );
  }

  next();
});

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

  createSendJWT(
    {
      admin: {
        firstName: admin.firstName,
        surname: admin.surname,
        email: admin.email,
        photo: admin.photo,
      },
    },
    admin._id.toString(),
    201,
    res,
  );
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
  const password = generate({ length: 16, numbers: true });
  const adminObject = {
    firstName: req.body.firstName,
    surname: req.body.surname,
    photo: req.body.photo,
    email: req.body.email,
    password,
  };
  const newAdmin = await Admin.create(adminObject);

  await new Email(
    { name: req.body.firstName, email: req.body.email },
    'https://www.youtube.com/watch?v=9Ls3djzMUi4&t=286s',
  ).sendWelcomeAdmin(password);

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
  const updatedAdminObj: {
    firstName?: string;
    surname?: string;
  } = {};

  if (req.body.firstName) updatedAdminObj.firstName = req.body.firstName;
  if (req.body.surname) updatedAdminObj.surname = req.body.surname;

  const updatedAdmin = await Admin.findByIdAndUpdate(
    req.headers.adminid,
    updatedAdminObj,
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    status: 'success',
    data: {
      admin: updatedAdmin,
    },
  });
});

// ----------------------- Deleting Admin ----------------------------

export const deleteAdmin = catchAsync(async (req, res, next) => {
  const admin = await Admin.findByIdAndDelete(req.headers.adminid);

  if (!admin) {
    return next(new AppError('No admin found with that ID', 404));
  }

  res.status(204).json({ status: 'succes', data: null });
});

// ----------------------- Forgeting Admin Password ----------------------------

export const forgotAdminPassword = catchAsync(async (req, res, next) => {
  const admin = await Admin.findOne({ email: req.body.email });

  if (!admin) {
    return next(new AppError('No admin found with that email address', 404));
  }

  // const resetToken = admin.createPasswordResetToken();
  await admin.save({ validateBeforeSave: false });

  try {
    await new Email(
      {
        name: admin.firstName,
        email: admin.email,
      },
      '/https://www.youtube.com/watch?v=9Ls3djzMUi4&t=286s',
    ).sendAdminPasswordReset();

    res.status(200).json({ status: 'succes', message: 'Token sent to email!' });
  } catch (err) {
    admin.passwordResetToken = undefined;
    admin.passwordResetExpires = undefined;
    await admin.save({ validateBeforeSave: false });
    console.log(err);
    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500,
      ),
    );
  }
});

// ----------------------- Reseting Admin Password ----------------------------

export const resetAdminPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const admin = await Admin.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!admin) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  admin.password = req.body.password;
  admin.passwordResetToken = undefined;
  admin.passwordResetExpires = undefined;

  await admin.save();

  createSendJWT(null, admin._id.toString(), 201, res);
});

// ----------------------- Updating Admin Password ----------------------------

export const updateAdminPassword = catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req.headers.adminid).select('+password');

  if (!admin) {
    return next(new AppError('No admin found with that ID', 404));
  }

  if (!(await checkPasswordCorrect(req.body.currentPassword, admin.password))) {
    return next(
      new AppError(
        'Your current password is wrong. Please provide accurate password.',
        401,
      ),
    );
  }

  admin.password = req.body.newPassword;

  await admin.save();

  createSendJWT(
    {
      firstName: admin.firstName,
      surname: admin.surname,
      email: admin.email,
      photo: admin.photo,
    },
    admin._id.toString(),
    200,
    res,
  );
});
