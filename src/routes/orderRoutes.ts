import express from 'express';
import {
  createOrder,
  deleteOrder,
  getSingleOrder,
  gettAllOrders,
  updateOrder,
} from '../controllers/orderController.js';

const router = express.Router();

router.route('/').get(gettAllOrders).post(createOrder);

router.route('/:id').get(getSingleOrder).patch(updateOrder).delete(deleteOrder);

export default router;
