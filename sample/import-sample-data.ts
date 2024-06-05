import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import Product from '../src/models/productModel.ts';
import ProductCollection from '../src/models/productCollectionModel.ts';

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE!.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD!,
);

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

// READ JSON FILE
const products = JSON.parse(fs.readFileSync(`./sample/products.json`, 'utf-8'));
const productCollections = JSON.parse(
  fs.readFileSync('./sample/productCollections.json', 'utf-8'),
);

// IMPORT DATA INTO DB
const importData = async (collections: {
  products?: boolean;
  productCollections?: boolean;
}) => {
  try {
    if (collections.products) await Product.create(products);
    if (collections.productCollections)
      await ProductCollection.create(productCollections);
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async (collections: {
  products?: boolean;
  productCollections?: boolean;
}) => {
  try {
    if (collections.products) await Product.deleteMany();
    if (collections.productCollections) await ProductCollection.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import-products') {
  importData({ products: true });
}
if (process.argv[2] === '--delete-products') {
  deleteData({ products: true });
}
if (process.argv[2] === '--import') {
  importData({ products: true, productCollections: true });
}
if (process.argv[2] === '--delete') {
  deleteData({ products: true, productCollections: true });
}
