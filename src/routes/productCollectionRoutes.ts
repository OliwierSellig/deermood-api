import express from 'express';
import {
  createCollection,
  deleteCollection,
  getAllCollections,
  getSingleCollection,
  updateCollection,
} from '../controllers/productCollectionController.js';

const router = express.Router();

router.route('/').get(getAllCollections).post(createCollection);

router
  .route('/:id')
  .get(getSingleCollection)
  .patch(updateCollection)
  .delete(deleteCollection);

export default router;
