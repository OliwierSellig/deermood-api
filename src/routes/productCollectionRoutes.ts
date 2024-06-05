import express from 'express';
import {
  createCollection,
  deleteCollection,
  filterCollectionsByGender,
  getAllCollections,
  getSingleCollection,
  updateCollection,
} from '../controllers/productCollectionController.js';

const router = express.Router();

router.route('/male').get(filterCollectionsByGender('male'), getAllCollections);
router
  .route('/female')
  .get(filterCollectionsByGender('female'), getAllCollections);

router.route('/').get(getAllCollections).post(createCollection);

router
  .route('/:id')
  .get(getSingleCollection)
  .patch(updateCollection)
  .delete(deleteCollection);

export default router;
