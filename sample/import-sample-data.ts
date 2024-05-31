import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import Product from '../src/models/productModel.ts';

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE!.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD!,
);

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

// READ JSON FILE
const products = JSON.parse(fs.readFileSync(`./sample/products.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Product.create(products);
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
