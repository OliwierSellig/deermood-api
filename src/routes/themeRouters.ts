import express from 'express';
import {
  createTheme,
  deleteTheme,
  getAllThemes,
  getSingleTheme,
  updateTheme,
} from '../controllers/themeContoller.js';

const router = express.Router();

router.route('/').get(getAllThemes).post(createTheme);

router.route('/:id').get(getSingleTheme).patch(updateTheme).delete(deleteTheme);

export default router;
