import express from 'express';
import {
  createDiscountCode,
  deleteDiscountCode,
  getAllDiscountCodes,
  getSingleDiscountCode,
  updateDiscountCode,
} from '../controllers/discountCodeController.js';

const router = express.Router();

router.route('/').get(getAllDiscountCodes).post(createDiscountCode);

router
  .route('/:id')
  .get(getSingleDiscountCode)
  .patch(updateDiscountCode)
  .delete(deleteDiscountCode);

export default router;
