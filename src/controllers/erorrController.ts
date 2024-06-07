import { NextFunction, Request, Response } from 'express';
import { MongoError } from 'mongodb';
import { CastError } from 'mongoose';
import AppError from '../utils/appError.js';

interface CustomError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

interface MongooseValidationError extends CustomError {
  errors: { message: string }[];
}

const handleCastErrorDB = (err: CastError) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: MongoError) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/);
  if (!value || !value.length) return err;

  const message = `Duplicate field value: ${value[0]}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: MongooseValidationError) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err: CustomError, res: Response) => {
  res.status(err.statusCode!).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err: CustomError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode!).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log(`❌ Error`, err);

    res.status(500).json({ message: 'Something went very wrong!' });
  }
};

export default (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }
  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'CastError') error = handleCastErrorDB(error as CastError);
    if (((error as CustomError & { code: number }).code = 11000))
      error = handleDuplicateFieldsDB(error as MongoError);
    if (error.hasOwnProperty('errors'))
      error = handleValidationErrorDB(error as MongooseValidationError);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sendErrorProd(error, res);
  }

  res.status(err.statusCode).json({ status: err.status, message: err.message });
};
