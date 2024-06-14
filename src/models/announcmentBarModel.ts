import mongoose from 'mongoose';

interface IAnnouncmentBar extends Document {
  content: string;
}

const announcmentBarSchema = new mongoose.Schema<IAnnouncmentBar>({
  content: {
    type: String,
    required: [true, 'Announcment Bar must have a conent.'],
    unique: true,
    trim: true,
    maxlength: [
      80,
      'Announcment Bar content must have less or equal then 80 characters',
    ],
    minlength: [
      12,
      'Announcment Bar content must have more or equal then 12 characters',
    ],
  },
});

const AnnouncmentBar = mongoose.model('AnnouncmentBar', announcmentBarSchema);

export default AnnouncmentBar;
