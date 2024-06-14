import AnnouncmentBar from '../models/announcmentBarModel.js';
import {
  creaetOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './handlerFactory.js';

// ----------------------- Factory Functions ------------------------------

export const getAllAnnouncmentBars = getAll(AnnouncmentBar);

export const getSingleAnnouncmentBar = getOne(
  AnnouncmentBar,
  'announcment bar',
);

export const createAnnouncmentBar = creaetOne(AnnouncmentBar);

export const updateAnnouncmentBar = updateOne(
  AnnouncmentBar,
  'announcment bar',
);

export const deleteAnnouncmentBar = deleteOne(
  AnnouncmentBar,
  'announcment bar',
);
