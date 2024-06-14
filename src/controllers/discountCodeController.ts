import DiscountCode from '../models/discountCodeModel.js';
import {
  creaetOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './handlerFactory.js';

// ----------------------- Factory Functions ------------------------------

export const getAllDiscountCodes = getAll(DiscountCode);

export const getSingleDiscountCode = getOne(DiscountCode, 'discount code');

export const createDiscountCode = creaetOne(DiscountCode);

export const updateDiscountCode = updateOne(DiscountCode, 'discount code');

export const deleteDiscountCode = deleteOne(DiscountCode, 'discount code');
