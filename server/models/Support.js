var mongoose = require('mongoose');
import bcrypt from 'bcrypt';
var mongoosePaginate = require('mongoose-paginate');

/*

{
  wishlist
  shipping
  billing
  coins 
}

*/

var SupportSchema = new mongoose.Schema({
  user_id: String,
});

SupportSchema.index({'$**': 'text'})
SupportSchema.plugin(mongoosePaginate);


var Support = mongoose.model('Support', SupportSchema);
module.exports = Support;