const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({ 
  chatId: {
    type: Map, 
    of: [
      {
        message: String,
        timestampMessage: Number,
        clientId: String,
        address: String,
        publicKey: String,
      },
    ],
  },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;