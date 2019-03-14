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

var CustomerSchema = new mongoose.Schema({
  user_id: String,
  stripe_customer_id: String,
  wishlist: [{
    product_id: String
  }],
  discounts_used: [String],
  shipping: [{
    first_name: String,
    last_name: String,
    phone: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    postal_code: String,
    country: String,
  }],
  shipping_primary_id: String,
  coins: Number
});

CustomerSchema.index({'$**': 'text'})
CustomerSchema.plugin(mongoosePaginate);


var Customer = mongoose.model('Customer', CustomerSchema);
module.exports = Customer;