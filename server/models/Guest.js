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

var GuestSchema = new mongoose.Schema({
  user_id: String,
  discounts_used: [String],
});

GuestSchema.index({'$**': 'text'})
GuestSchema.plugin(mongoosePaginate);


var Guest = mongoose.model('Guest', GuestSchema);
module.exports = Guest;