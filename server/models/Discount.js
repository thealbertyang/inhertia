import mongoose from 'mongoose'
import bcrypt from 'bcrypt';
var mongoosePaginate = require('mongoose-paginate');

var DiscountSchema = new mongoose.Schema({
  title: String,
  discount_code: String,
  discount_roles: String,
  discount_type: String,
  discount_value: String,
  views: Number,
  purchases: Number,
  published: String,
  expire_date: {
    type: Date,
    default: Date.now
  },
});

DiscountSchema.index({'$**': 'text'})
DiscountSchema.plugin(mongoosePaginate);

var Discount = mongoose.model('Discount', DiscountSchema);
module.exports = Discount;