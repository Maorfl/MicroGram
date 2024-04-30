const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    _id:false,
    messageId: { type: String, required: true },
    senderId: { type: String, required: true },
    createdAt: { type: Number, required: true },
    content: { type: Object, required: true }
});

const chatSchema = new mongoose.Schema({
    participators: { type: [String], required: true },
    msgs: { type: [messageSchema], required: true }
});


const Chat = mongoose.model('chats', chatSchema);

module.exports = Chat;