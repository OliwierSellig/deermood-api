import express from 'express';
import {
  createAdmin,
  deleteAdmin,
  getAllAdmins,
  getSingleAdmin,
  loginAdmin,
  updateAdmin,
  protectAdmin,
  forgotAdminPassword,
  resetAdminPassword,
  updateAdminPassword,
  logoutAdmin,
} from '../controllers/adminController.js';

const router = express.Router();

router.route('/login').post(loginAdmin);

router.route('/logout').get(logoutAdmin);

router.route('/forgotPassword').post(forgotAdminPassword);

router.route('/resetPassword/:token').patch(resetAdminPassword);

router.use(protectAdmin);

router.route('/updatePassword').patch(updateAdminPassword);

router.route('/updateMe').patch(updateAdmin);

router.route('/deleteMe').patch(deleteAdmin);

router.route('/getMyInfo').patch(getSingleAdmin);

router.route('/').get(getAllAdmins).post(createAdmin);

export default router;
