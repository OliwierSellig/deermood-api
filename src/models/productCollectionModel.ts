import mongoose from 'mongoose';
import { getSlug } from '../utils/getSlug.js';

interface IProductCollection extends Document {
  name: string;
  slug: string;
  description: string;
  photos: string[];
  gender: 'male' | 'female' | 'unisex';
}

const productCollectionSchema = new mongoose.Schema<IProductCollection>(
  {
    name: {
      type: String,
      required: [true, 'Collection must have a name.'],
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
    gender: {
      type: String,
      required: [true, 'Collection must attached to a gender.'],
      enum: {
        values: ['male', 'female', 'unisex'],
        message: 'Gender must be either: male, female or unisex ',
      },
    },
    slug: String,
    photos: [String],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

productCollectionSchema.virtual('products', {
  ref: 'Product',
  foreignField: 'productCollection',
  localField: '_id',
});

productCollectionSchema.pre('save', function (next) {
  this.slug = getSlug(this.name);
  next();
});

const ProductCollection = mongoose.model(
  'ProductCollection',
  productCollectionSchema,
);

export default ProductCollection;
