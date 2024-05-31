import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, require: [true, 'Product must have a name!'] },
});

const Product = mongoose.model('Product', productSchema);

export default Product;
