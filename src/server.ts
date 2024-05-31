import dotenv from 'dotenv';
import { app } from './app.js';
import mongoose from 'mongoose';
dotenv.config({ path: './config.env' });

const DB_PASSWORD = process.env.DATABASE_PASSWORD!;

const DB = process.env.DATABASE?.replace('<PASSWORD>', DB_PASSWORD);

if (!DB) throw new Error('Could not connect with database');

mongoose.connect(DB);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
