import dotenv from 'dotenv';
import { app } from './app.js';
import mongoose from 'mongoose';

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB_PASSWORD = process.env.DATABASE_PASSWORD!;

const DB = process.env.DATABASE?.replace('<PASSWORD>', DB_PASSWORD);

if (!DB) throw new Error('Could not connect with database');

mongoose.connect(DB);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
