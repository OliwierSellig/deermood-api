import mongoose from 'mongoose';

interface IAdmin extends Document {
  firstName: string;
  surname: string;
  photo: string;
  email: string;
  password: string;
}

const adminSchema = new mongoose.Schema<IAdmin>({
  firstName: {
    type: String,
    trim: true,
    required: [true, 'Admin must have a firstName'],
    maxlength: [16, 'Product name must have less or equal than 16 characters'],
    minlength: [2, 'First name must have at least 2 characters '],
  },
  surname: {
    type: String,
    trim: true,
    required: [true, 'Admin must have a firstName'],
    maxlength: [24, 'Product name must have less or equal than 24 characters'],
    minlength: [2, 'First name must have at least 2 characters '],
  },
  photo: String,
  email: {
    type: String,
    unique: true,
    required: [true, 'Admin must have an email address'],
  },
  password: {
    type: String,
    select: false,
    required: [true, 'Admin must have a password'],
    minlength: [8, 'Password must contain at least 8 characters'],
  },
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
