// ----------------------- Getting All Themes ----------------------------

import Theme from '../models/themeModel.js';
import {
  creaetOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './handlerFactory.js';

// ----------------------- Factory Functions ------------------------------

export const getAllThemes = getAll(Theme);

export const getSingleTheme = getOne(Theme, 'theme');

export const createTheme = creaetOne(Theme);

export const updateTheme = updateOne(Theme, 'theme');

export const deleteTheme = deleteOne(Theme, 'theme');
