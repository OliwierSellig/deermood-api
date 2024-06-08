import { promisify } from 'util';
import Admin from '../models/adminModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { checkPasswordCorrect } from '../utils/checkPasswordCorrect.js';
import { signJWT } from '../utils/signJWT.js';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { sendEmail } from '../utils/email.js';
import crypto from 'crypto';

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
  } = {};

  if (req.body.firstName) updatedAdminObj.firstName = req.body.firstName;
  if (req.body.surname) updatedAdminObj.surname = req.body.surname;

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

// ----------------------- Forgoting Admin Password ----------------------------

export const forgotAdminPassword = catchAsync(async (req, res, next) => {
  const admin = await Admin.findOne({ email: req.body.email });

  if (!admin) {
    return next(new AppError('No admin found with that email address', 404));
  }

  const resetToken = admin.createPasswordResetToken();
  await admin.save({ validateBeforeSave: false });

  const message = `Forgot your password, please follow this token: ${resetToken} and this link <PASTE LINK HERE> to create a new password for your account.\nIf you did not forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: admin.email,
      subject: 'Reset your password (Valid for 10 minutes)',
      text: message,
    });

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

  const token = signJWT(admin._id.toString());

  res.status(200).json({ status: 'succes', token });
});
