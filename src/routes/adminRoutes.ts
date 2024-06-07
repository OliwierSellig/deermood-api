import express from 'express';
import {
  createAdmin,
  deleteAdmin,
  getAllAdmins,
  getSingleAdmin,
  loginAdmin,
  updateAdmin,
} from '../controllers/adminController.js';

const router = express.Router();

router.route('/login').post(loginAdmin);

router.route('/').get(getAllAdmins).post(createAdmin);

router
  .route('/:adminId')
  .get(getSingleAdmin)
  .patch(updateAdmin)
  .delete(deleteAdmin);

export default router;
