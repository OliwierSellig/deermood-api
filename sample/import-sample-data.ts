import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import Product from '../src/models/productModel.ts';
import Admin from '../src/models/adminModel.ts';
import Theme from '../src/models/themeModel.ts';
import User from '../src/models/userModel.ts';
import Order from '../src/models/orderModel.ts';
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
const admins = JSON.parse(fs.readFileSync(`./sample/admins.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`./sample/users.json`, 'utf-8'));
const orders = JSON.parse(fs.readFileSync(`./sample/orders.json`, 'utf-8'));
const themes = JSON.parse(fs.readFileSync(`./sample/themes.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async (collections: {
  products?: boolean;
  productCollections?: boolean;
  admins?: boolean;
  users?: boolean;
  orders?: boolean;
  themes?: boolean;
}) => {
  try {
    if (collections.products) await Product.create(products);
    if (collections.productCollections)
      await ProductCollection.create(productCollections);
    if (collections.admins) {
      const adminList = admins.map((admin) => {
        return {
          firstName: admin.firstName,
          surname: admin.surname,
          photo: admin.photo,
          email: admin.email,
          password: admin.password,
        };
      });
      await Admin.create(adminList);
    }
    if (collections.users) {
      const userList = users.map((user) => {
        return {
          firstName: user.firstName,
          surname: user.surname,
          photo: user.photo,
          email: user.email,
          password: user.password,
        };
      });
      await User.create(userList);
    }
    if (collections.orders) {
      await Order.create(orders);
    }
    if (collections.themes) await Theme.create(themes);
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async (collections: {
  products?: boolean;
  productCollections?: boolean;
  admins?: boolean;
  users?: boolean;
  orders?: boolean;
  themes?: boolean;
}) => {
  try {
    if (collections.products) await Product.deleteMany();
    if (collections.productCollections) await ProductCollection.deleteMany();
    if (collections.admins) await Admin.deleteMany();
    if (collections.orders) {
      await Order.deleteMany();
    }
    if (collections.themes) await Theme.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import-orders') {
  importData({ orders: true });
}
if (process.argv[2] === '--delete-orders') {
  deleteData({ orders: true });
}
if (process.argv[2] === '--import-themes') {
  importData({ themes: true });
}
if (process.argv[2] === '--delete-themes') {
  deleteData({ themes: true });
}
if (process.argv[2] === '--import-users') {
  importData({ users: true });
}
if (process.argv[2] === '--delete-users') {
  deleteData({ users: true });
}
if (process.argv[2] === '--import-products') {
  importData({ products: true });
}
if (process.argv[2] === '--delete-products') {
  deleteData({ products: true });
}
if (process.argv[2] === '--import-admins') {
  importData({ admins: true });
}
if (process.argv[2] === '--delete-admins') {
  deleteData({ admins: true });
}
if (process.argv[2] === '--import') {
  importData({
    products: true,
    productCollections: true,
    admins: true,
    users: true,
  });
}
if (process.argv[2] === '--delete') {
  deleteData({
    products: true,
    productCollections: true,
    admins: true,
    users: true,
  });
}
