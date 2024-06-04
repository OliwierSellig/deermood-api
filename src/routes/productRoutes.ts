import express from 'express';
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
} from '../controllers/productController.js';

const router = express.Router();

router.route('/').get(getAllProducts).post(createProduct);

router.route('/:id').get(getSingleProduct);

export default router;
