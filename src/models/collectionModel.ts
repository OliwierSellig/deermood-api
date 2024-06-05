import mongoose from 'mongoose';

interface ICollection extends Document {
  name: string;
  slug: string;
  description: string;
  photos: string[];
}

const collectionSchema = new mongoose.Schema<ICollection>({
  name: {
    type: String,
    required: [true, 'Collection must have a name.'],
    unique: true,
    trim: true,
    maxlength: [
      32,
      'Collection name must have less or equal then 32 characters',
    ],
  },
  description: {
    type: String,
    required: [true, 'Collection must have a description.'],
    minlength: [
      20,
      'Collection description must have more or equal then 20 characters',
    ],
    maxlength: [
      200,
      'Collection description must have less or equal then 200 characters',
    ],
  },
  slug: String,
  photos: [String],
});

const Collection = mongoose.model('Collection', collectionSchema);

export default Collection;
