import Product from '../models/productModel.js';
import {
  creaetOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './handlerFactory.js';

// ----------------------- Factory Functions ------------------------------

export const getAllProducts = getAll(Product);

export const getSingleProduct = getOne(Product, 'product');

export const createProduct = creaetOne(Product);

export const updateProduct = updateOne(Product, 'product');

export const deleteProduct = deleteOne(Product, 'product');
