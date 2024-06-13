import express from 'express';
import {
  getAllUsers,
  getSingleUser,
  getUserOrders,
} from '../controllers/userController.js';

const router = express.Router();

router.route('/').get(getAllUsers);

router.route('/:userId').get(getSingleUser);

router.route('/:userId/orders').get(getUserOrders);

export default router;
