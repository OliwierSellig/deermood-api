import mongoose from 'mongoose';
import { getSlug } from '../utils/getSlug.js';

const requiredSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface IProduct extends Document {
  name: string;
  photos: string[];
  gender: 'male' | 'female' | 'unisex';
  description: string;
  price: number;
  sizes: { name: string; amount: number }[];
  materials: { name: string; amount: number }[];
  slug?: string;
  collections: {
    type: typeof mongoose.Schema.Types.ObjectId;
    ref: string;
  }[];
}

const productSchema = new mongoose.Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Product must have a name.'],
    unique: true,
    trim: true,
    maxlength: [40, 'Product name must have less or equal then 40 characters'],
    minlength: [8, 'Product name must have more or equal then 8 characters'],
  },
  slug: String,
  photos: [String],
  gender: {
    type: String,
    required: [true, 'Product must have a gender.'],
    enum: {
      values: ['male', 'female', 'unisex'],
      message: 'Gender must be either: male, female or unisex ',
    },
  },
  materials: [
    {
      name: { type: String, required: [true, 'A material must have a name.'] },
      amount: {
        type: Number,
        required: [true, 'A material must have an amount.'],
      },
    },
  ],
  description: {
    type: String,
    required: [true, 'Product must have a description.'],
    minlength: [
      40,
      'Product description must have more or equal then 40 characters',
    ],
    maxlength: [
      520,
      'Product description must have less or equal then 520 characters',
    ],
  },
  price: { type: Number, required: [true, 'Product must have a price.'] },
  sizes: [
    {
      name: {
        type: String,
        required: [true, 'A size must have a name.'],
        enum: {
          values: requiredSizes,
          message: 'Size must be either: XS, S, M, L, XL, XXL',
        },
      },
      amount: {
        type: Number,
        required: [true, 'A size must have an amount.'],
        min: [0, 'Amount must be a positive number.'],
      },
    },
  ],
  collections: [{ type: mongoose.Schema.ObjectId, ref: 'Collection' }],
});

productSchema.pre('save', function (next) {
  const existingSizes = this.sizes.map((size) => size.name);

  requiredSizes.forEach((size) => {
    if (!existingSizes.includes(size)) {
      this.sizes.push({ name: size, amount: 0 });
    }
  });

  next();
});

productSchema.pre('save', function (next) {
  this.slug = getSlug(this.name);
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;
