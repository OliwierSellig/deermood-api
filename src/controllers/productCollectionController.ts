import { NextFunction, Request, Response } from 'express';
import ProductCollection from '../models/productCollectionModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// ------------------- Filtering Collections By Gender ------------------------

export const filterCollectionsByGender =
  (gender: 'male' | 'female' | 'unisex') =>
  (req: Request, res: Response, next: NextFunction) => {
    req.query.gender = gender;
    next();
  };

// ----------------------- Getting All Collections ----------------------------

export const getAllCollections = catchAsync(async (req, res, next) => {
  const gender = req.query.gender;
  const productCollections = await ProductCollection.find(
    gender ? { gender } : {},
  );

  res.status(200).json({
    message: 'succes',
    results: productCollections.length,
    data: { collections: productCollections },
  });
});

// ----------------------- Getting Single Collection ----------------------------

export const getSingleCollection = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const collection = await ProductCollection.findById(id);

  if (!collection) {
    return next(new AppError('No collection found with that ID', 404));
  }

  res.status(200).json({ status: 'succes', data: { collection } });
});

// ----------------------- Creating Collection ----------------------------

export const createCollection = catchAsync(async (req, res, next) => {
  const newCollecion = await ProductCollection.create(req.body);

  res.status(201).json({ status: 'succes', data: { newCollecion } });
});

// ----------------------- Updating Collection ----------------------------

export const updateCollection = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const collection = await ProductCollection.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!collection) {
    return next(new AppError('No collection found with that ID', 404));
  }

  res.status(200).json({ status: 'succes', data: { collection } });
});

// ----------------------- Deleting Collection ----------------------------

export const deleteCollection = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const collection = await ProductCollection.findByIdAndDelete(id);
  if (!collection) {
    return next(new AppError('No collection found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
