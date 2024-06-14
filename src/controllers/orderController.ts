import Order from '../models/orderModel.js';
import {
  creaetOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './handlerFactory.js';

// ----------------------- Factory Functions ------------------------------

export const getAllOrders = getAll(Order);

export const getSingleOrder = getOne(Order, 'order');

export const createOrder = creaetOne(Order);

export const updateOrder = updateOne(Order, 'order');

export const deleteOrder = deleteOne(Order, 'order');
