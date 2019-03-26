import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
var mongoosePaginate = require('mongoose-paginate');

var ProductReviewSchema = new mongoose.Schema({
  comment: {
    type: String,
    trim: true
  },
  rating: Number,
  published: String,
  product_id: String,
  customer_id: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

ProductReviewSchema.index({'$**': 'text'})
ProductReviewSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('ProductReview', ProductReviewSchema);
