import mongoose from 'mongoose';

const requiredSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Product must have a name.'],
    unique: true,
    trim: true,
    maxlength: [40, 'Product name must have less or equal then 40 characters'],
    minlength: [8, 'Product name must have more or equal then 8 characters'],
  },
  slug: String,
  images: [String],
  gender: {
    type: String,
    require: [true, 'Product must have a gender.'],
    enum: {
      values: ['men', 'women', 'unisex'],
      message: 'Gender must be either: men, women or unisex ',
    },
  },
  description: {
    type: String,
    require: [true, 'Product must have a description.'],
    minlength: [40, 'Product name must have more or equal then 40 characters'],
    maxlength: [
      520,
      'Product name must have less or equal then 520 characters',
    ],
  },
  price: { type: Number, required: [true, 'Product must have a price.'] },
  sizes: [
    {
      name: {
        type: String,
        require: [true, 'A size must have a name.'],
        enum: {
          values: requiredSizes,
          message: 'Size must be either: XS, S, M, L, XL, XXL',
        },
      },
      amount: {
        type: Number,
        require: [true, 'A size must have an amount.'],
        min: [0, 'Amount must be a positive number.'],
      },
    },
  ],
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

const Product = mongoose.model('Product', productSchema);

export default Product;
