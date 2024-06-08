import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

interface IAdmin extends Document {
  firstName: string;
  surname: string;
  photo: string;
  email: string;
  password: string;
  passwordChangedAt: Date;
  passwordResetToken: string | undefined;
  passwordResetExpires: Date | undefined;
  createPasswordResetToken: () => string;
  changedPasswordAfter: (JWTTimestamp: number) => boolean;
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
    required: [true, 'Admin must  have a password'],
    minlength: [8, 'Password must contain at least 8 characters'],
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

adminSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

adminSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      (this.passwordChangedAt.getTime() / 1000).toString(),
      10,
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

adminSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
