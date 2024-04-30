const Chat = require('../../../models/Chat');
const chatsService = require('../chats.service')

async function add(currChat, newMessage) {
    try {
        const chat = new Chat(currChat);
        chat.msgs.push(newMessage);

        await chat.save();
    } catch (error) {
        throw error
    }
}
async function edit(currChat, message, text) {
    try {
        const chat = new Chat(currChat);
        const message = chat.msgs.filter(msg => msg.messageId === message[0].messageId).content.txt = text;

        await chat.save();

    } catch (error) {
        throw error
    }
}

async function deleteMsg(chat, messageId) {
    try {
        const filteredMessages = chat.msgs.filter(msg => msg._id.toString() !== messageId)

        chat.msgs = filteredMessages;

        await chat.save();

        return Promise.resolve("Message deleted successfully")
    } catch (error) {
        throw error
    }
}


module.exports = {
    add,
    edit,
    deleteMsg
}