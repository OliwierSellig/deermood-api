// ----------------------- Getting All Themes ----------------------------

import Theme from '../models/themeModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const getAllThemes = catchAsync(async (req, res, next) => {
  const themes = await Theme.find();

  res
    .status(200)
    .json({ status: 'succes', results: themes.length, data: { themes } });
});

// ----------------------- Getting Single Theme ----------------------------

export const getSingleTheme = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const theme = await Theme.findById(id);

  if (!theme) {
    return next(new AppError('No theme found with that ID', 404));
  }

  res.status(200).json({ status: 'succes', data: { theme } });
});

// ----------------------- Creating Theme -----------------------------------

export const createTheme = catchAsync(async (req, res, next) => {
  const theme = await Theme.create(req.body);

  res.status(201).json({ status: 'succes', data: { theme } });
});

// ----------------------- Updating Theme -----------------------------------

export const updateTheme = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const theme = await Theme.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!theme) {
    return next(new AppError('No theme found with that ID', 404));
  }

  res.status(200).json({ status: 'succes', data: { theme } });
});

// ----------------------- Deleting Theme -----------------------------------

export const deleteTheme = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const theme = await Theme.findByIdAndDelete(id);

  if (!theme) {
    return next(new AppError('No theme found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
