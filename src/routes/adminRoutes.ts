import express from 'express';
import {
  createAdmin,
  deleteAdmin,
  loginAdmin,
  updateAdmin,
} from '../controllers/adminController.js';

const router = express.Router();

router.route('/login').post(loginAdmin);

router.route('/').post(createAdmin);

router.route('/:adminId').patch(updateAdmin).delete(deleteAdmin);

export default router;
