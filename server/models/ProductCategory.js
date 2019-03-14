import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
var mongoosePaginate = require('mongoose-paginate');

var ProductCategorySchema = new mongoose.Schema({
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
  }
});

ProductCategorySchema.index({'$**': 'text'})
ProductCategorySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('ProductCategory', ProductCategorySchema);