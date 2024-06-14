import ProductCollection from '../models/productCollectionModel.js';
import {
  creaetOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './handlerFactory.js';

// ----------------------- Factory Functions ------------------------------

export const getAllCollections = getAll(ProductCollection);

export const getSingleCollection = getOne(ProductCollection, 'collection');

export const createCollection = creaetOne(ProductCollection);

export const updateCollection = updateOne(ProductCollection, 'collection');

export const deleteCollection = deleteOne(ProductCollection, 'collection');
