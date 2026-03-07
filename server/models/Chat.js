const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  fullName: String,
  username: String,
  email: String,

  message: {
    type: String,
    required: true
  },

  reply: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});
chatSchema.index({ message: 1 });
module.exports = mongoose.model('Chat', chatSchema);