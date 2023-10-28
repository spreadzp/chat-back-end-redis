const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // Dynamic field names for chat IDs
  chatId: {
    type: Map, // Use Map to store dynamic keys
    of: [
      {
        message: String,
        timestampMessage: Number,
        clientId: String,
      },
    ],
  },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;