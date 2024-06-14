import express from 'express';
import {
  createAnnouncmentBar,
  deleteAnnouncmentBar,
  getAllAnnouncmentBars,
  getSingleAnnouncmentBar,
  updateAnnouncmentBar,
} from '../controllers/announcmentBarController.js';

const router = express.Router();

router.route('/').get(getAllAnnouncmentBars).post(createAnnouncmentBar);

router
  .route('/:id')
  .get(getSingleAnnouncmentBar)
  .patch(updateAnnouncmentBar)
  .delete(deleteAnnouncmentBar);

export default router;
