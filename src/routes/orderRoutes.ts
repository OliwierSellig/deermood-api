import express from 'express';
import {
  createOrder,
  deleteOrder,
  getSingleOrder,
  getAllOrders,
  updateOrder,
} from '../controllers/orderController.js';

const router = express.Router();

router.route('/').get(getAllOrders).post(createOrder);

router.route('/:id').get(getSingleOrder).patch(updateOrder).delete(deleteOrder);

export default router;
