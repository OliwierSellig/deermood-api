import mongoose from 'mongoose';
import { productGenders, productSizes } from '../types/types.js';

const requiredSizes: productSizes[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

type DeliveryStatus = 'packed' | 'shipped' | 'delivered';

const deliveryStatus: DeliveryStatus[] = ['packed', 'shipped', 'delivered'];

const deliveryStatusObj = {
  isCompleted: {
    type: Boolean,
    required: [true, 'Delivery state must have an isCompleted status'],
  },
  complitionDate: Date,
};

type OrderStatusStage =
  | { isCompleted: false }
  | { isCompleted: true; complitionDate: Date };

interface IOrder extends Document {
  fullPrice: number;
  deliveryCost: number;
  discount?: { code: string; percentValue: number };
  finalPrice: number;
  orderDate: Date;
  deliveryStatus: DeliveryStatus;
  deliveryStatusHistory: {
    orderPlaced: OrderStatusStage;
    productPicked: OrderStatusStage;
    orderPacked: OrderStatusStage;
    sipped: OrderStatusStage;
    delivered: OrderStatusStage;
  };
  customer: {
    firstName: string;
    surName: string;
    email: string;
    photo?: string;
    id?: mongoose.Schema.Types.ObjectId;
    address: string;
    phone: number;
  };
  products: {
    name: string;
    slug: string;
    gender: productGenders;
    size: productSizes;
    price: number;
    quantity: number;
  }[];
}

const orderSchema = new mongoose.Schema<IOrder>({
  fullPrice: {
    type: Number,
    required: [true, 'Order must have a full price.'],
  },
  deliveryCost: {
    type: Number,
    required: [true, 'Order must have a delivery cost.'],
  },
  discount: {
    code: { type: String, required: [true, 'Discount must hava code.'] },
    percentValue: {
      type: Number,
      required: [true, 'Discount must have a percent value.'],
      max: [100, 'Discount value must be equal or less than 100%'],
      min: [1, 'Discount value must be equal or more than 1%'],
    },
  },
  finalPrice: {
    type: Number,
    required: [true, 'Order must have a final price.'],
  },
  orderDate: Date,
  deliveryStatus: {
    type: String,
    enum: {
      values: deliveryStatus,
      message: 'Delivery status must be either Packed, Sipped or Delivered',
    },
  },
  deliveryStatusHistory: {
    orderPlaced: deliveryStatusObj,
    productPicked: deliveryStatusObj,
    orderPacked: deliveryStatusObj,
    sipped: deliveryStatusObj,
    delivered: deliveryStatusObj,
  },
  customer: {
    firstName: {
      type: String,
      required: [true, 'Customer must have a first name.'],
    },
    surName: {
      type: String,
      required: [true, 'Customer must have a surname.'],
    },
    email: { type: String, required: [true, 'Customer must have an email.'] },
    photo: String,
    id: mongoose.Schema.ObjectId,
    address: {
      type: String,
      required: [true, 'Customer must have an address.'],
    },
    phone: {
      type: Number,
      required: [true, 'Customer must have a phone number.'],
    },
  },
  products: [
    {
      name: { type: String, required: [true, 'Product must have a name.'] },
      slug: { type: String, required: [true, 'Product must have a slug.'] },
      gender: {
        type: String,
        required: [true, 'Product must have a gender.'],
        enum: {
          values: ['mens', 'womens', 'unisex'],
          message: 'Gender must be either: mens, womens or unisex.',
        },
      },
      size: {
        type: String,
        required: [true, 'Product must have a size'],
        enum: {
          values: requiredSizes,
          message: 'Size must be either: XS, S, M, L, XL, XXL',
        },
      },
      price: { type: Number, required: [true, 'Product must have a price.'] },
      quantity: {
        type: Number,
        required: [true, 'Product must have a quantity.'],
        min: [1, 'Product quantity must be equal or higher than 1.'],
      },
    },
  ],
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
