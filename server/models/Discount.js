import mongoose from 'mongoose'
import bcrypt from 'bcrypt';
var mongoosePaginate = require('mongoose-paginate');

var DiscountSchema = new mongoose.Schema({
  title: String,
  discount_code: String,
  discount_type: String,
  discount_value: String,
  uses: Number,
});

DiscountSchema.index({'$**': 'text'})
DiscountSchema.plugin(mongoosePaginate);

var Discount = mongoose.model('Discount', DiscountSchema);
module.exports = Discount;
