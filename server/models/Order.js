import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
var mongoosePaginate = require('mongoose-paginate');

var OrderSchema = new mongoose.Schema({
  stripe_customer_id: String,
  stripe_source_id: String,
  stripe_charge_id: String,
  discounts: [{
    title: String,
    discount_code: String,
    discount_amount: Number,
  }],
  amounts: {
    items: Number,
    total: Number,
    sub_total: Number,
    discounts: Number,
    shipping: Number,
    tax: Number,
  },
  items: [{
    id: String,
    title: String,
    color: String,
    size: String,
    quantity: Number,
    price: Number,
    markup: Number,
    cost: Number,
    images: [String],
  }],
  shipping: {
    first_name: String,
    last_name: String,
    phone: String,
    email: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    postal_code: String,
    country: String,
  },
  status: {
    type: String,
    required: false,
    trim: true,
    default: 'pending',
  },
  messages: [{
    user_id: String,
    message: String,
    status: String,
    date: {
      type: Date,
      default: Date.now,
    }
  }],
  user_id: {
    type: String,
    required: true,
    trim: true,
  },
  ticket_id: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

OrderSchema.index({'$**': 'text'})
OrderSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Order', OrderSchema);
