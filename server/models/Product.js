import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
var mongoosePaginate = require('mongoose-paginate');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

var ProductSchema = new mongoose.Schema({
  colors: [String],
  sizes: [String],
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: String,
  purchases: {
    type: Number,
    default: 0
  },
  reviews: [{
    user_id: String,
    comment: String,
    rating: {
      type: Number,
      default: 1,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  }],
  images: [String],
  type: String,
  url: String,
  importData: Object,
  importData_last_updated: {
    type: Date,
    default: Date.now,
  },
  cost: Number,
  cost_last_updated: {
    type: Date,
    default: Date.now,
  },
  markup: Number,
  price: {
    type: Number,
    required: false,
    trim: true
  },
  product_category_ids: [String],
  user_id: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

ProductSchema.index({'$**': 'text'})

ProductSchema.pre('create', function (error, doc, next) {
  //console.log('next', next, next(err))
  console.log('test')
  console.log('error', error)
  console.log('doc', doc)
  if(next){
    console.log('just testing next my friend heheh', next);
  }
})

ProductSchema.pre('update', function (next) {
    this.options.runValidators = true
    next()
})

ProductSchema.plugin(mongoosePaginate);
ProductSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('Product', ProductSchema);
