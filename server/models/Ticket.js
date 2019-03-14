import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
var mongoosePaginate = require('mongoose-paginate');

var TicketSchema = new mongoose.Schema({
  user_id: String,
  type: String,
  assigned_user_id: String,
  priority: String,
  date: {
      type: Date,
      default: Date.now,
  },
  log: [{
    user_id: String,
    kind: String,
    message: String,
    status: String,
    read: [{
      date: { type: Date, default: Date.now },
      user_id: String
    }],
    date: {
      type: Date,
      default: Date.now,
    }
  }]
});

TicketSchema.index({'$**': 'text'})
TicketSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Ticket', TicketSchema);