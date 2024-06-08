import express from 'express';
import { getAllUsers, getSingleUser } from '../controllers/userController.js';

const router = express.Router();

router.route('/').get(getAllUsers);

router.route('/:userId').get(getSingleUser);

export default router;
