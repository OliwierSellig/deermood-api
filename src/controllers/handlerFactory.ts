import { Model } from 'mongoose';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { QueryString } from '../types/types.js';
import APIFeatures from '../utils/apiFeatures.js';

// ----------------------- Getting All Documents ------------------------

export const getAll = <T extends Document>(Model: Model<T>) =>
  catchAsync(async (req, res, next) => {
    const queryString = req.query as unknown as QueryString;

    const features = new APIFeatures(Model.find(), queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const documents = await features.query;
    res.status(200).json({
      status: 'success',
      results: documents.length,
      data: { documents },
    });
  });

// ----------------------- Getting Single Document ----------------------

export const getOne = <T extends Document>(
  Model: Model<T>,
  modelName: string,
) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const doc = await Model.findById(id);

    if (!doc) {
      return next(new AppError(`No ${modelName} found with that ID`, 404));
    }

    res.status(200).json({ status: 'succes', data: { doc } });
  });

// ----------------------- Creating Document ----------------------------

export const creaetOne = <T extends Document>(Model: Model<T>) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({ status: 'succes', data: { doc } });
  });

// ----------------------- Updating Document ----------------------------

export const updateOne = <T extends Document>(
  Model: Model<T>,
  modelName: string,
) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const doc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError(`No ${modelName} found with that ID`, 404));
    }

    res.status(200).json({ status: 'succes', data: { doc } });
  });

// ----------------------- Deleting Document ----------------------------

export const deleteOne = <T extends Document>(
  Model: Model<T>,
  modelName: string,
) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const doc = await Model.findByIdAndDelete(id);
    if (!doc) {
      return next(new AppError(`No ${modelName} found with that ID`, 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
