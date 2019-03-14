import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
var mongoosePaginate = require('mongoose-paginate');

var BoardSchema = new mongoose.Schema({
  type: String,
  board: {
    pending: [String],
    processing: [String],
    reviewing: [String],
    resolved: [String],
  }
});

BoardSchema.index({'$**': 'text'})
BoardSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Board', BoardSchema);