import mongoose from 'mongoose';

interface IDiscountCode extends Document {
  code: string;
  isActive: boolean;
  discountValue: number;
}

const discountCodeSchema = new mongoose.Schema<IDiscountCode>({
  code: {
    type: String,
    required: [true, 'Discount code must have a code.'],
    unique: true,
    trim: true,
    maxlength: [32, 'Discount code must have less or equal then 32 characters'],
    minlength: [
      6,
      'Discount code content must have more or equal then 6 characters',
    ],
  },
  isActive: {
    type: Boolean,
    required: [true, 'Discount code must have an activity status'],
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount code must have a value'],
    min: [1, 'Discount code value must be equal or greather than 1%'],
    max: [100, 'Discount code value must be equal or less than 100%'],
  },
});

const DiscountCode = mongoose.model('DiscountCode', discountCodeSchema);

export default DiscountCode;
