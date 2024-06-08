import mongoose from 'mongoose';

interface IUser extends Document {
  firstName: string;
  surname: string;
  email: string;
  password: string;
  photo: string;
}

const userSchema = new mongoose.Schema<IUser>({
  firstName: {
    type: String,
    trim: true,
    required: [true, 'User must have a firstName'],
  },
  surname: {
    type: String,
    trim: true,
    required: [true, 'User must have a surname'],
  },
  photo: String,
  email: {
    type: String,
    unique: true,
    required: [true, 'User must have an email address'],
  },
  password: {
    type: String,
    select: false,
    required: [true, 'User must have a password'],
    minlength: [8, 'Password must contain at least 8 characters'],
  },
});

const User = mongoose.model('User', userSchema);

export default User;
