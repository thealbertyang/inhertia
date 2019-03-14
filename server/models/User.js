var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate');
import bcrypt from 'bcrypt'

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  phone: String,
  username: {
    type: String,
    unique: true,
    trim: true
  },
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  roles: [String],
  password: {
    type: String,
    required: true,
  },
  avatar: String,
  verifyEmail: String,
  forgotPassword: String,
  date: {
    type: Date,
    default: Date.now,
  },
});
//authenticate input against database

UserSchema.statics.authenticate = async function (account, password, callback) {
  console.log('didwe get in herec', account)
  await User.findOne({ $or: [{ username: account }, { email: account }] })
    .exec(function (err, user) {


      if (err) {
  console.log('didwe get in herec122')

        return callback(err)
      } else if (!user) {
  console.log('didwe get in herec122 nope')

        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }


      bcrypt.compare(password, user.password, function (err, result) {

  console.log('didwe get in herec12 teayewssss2')

        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}


UserSchema.index({'$**': 'text'})
UserSchema.plugin(mongoosePaginate);

var User = mongoose.model('User', UserSchema);
module.exports = User;