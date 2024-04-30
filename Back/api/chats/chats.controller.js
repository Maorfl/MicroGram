const chatsService = require('./chats.service');
const usersService = require('../users/users.service');
const messagesService = require('../chats/messages/messages.service')

async function getUserChats(req, res) {
    try {
        const user = await usersService.getById(req.query.userId);
        const chats = await Promise.all(user.chats.map(async (chatId) => {
            return await chatsService.getById(chatId);
        }));
        if (chats[0]) res.json(chats);
        else res.json([]);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function addChat(req, res) {
    try {
        const newChat = await chatsService.add(req.body);
        chatsService.saveChatToUsers(newChat.participators, newChat._id);

        res.json(newChat);
    } catch (error) {
        res.status(500).send(error.message)
    }
}

async function message(req, res) {
    try {
        const chat = await chatsService.getById(req.params.id);
        const message = chat.msgs.filter((msg) => msg.messageId == req.body.messageId);
        if (message.length) await messagesService.edit(chat, message, req.body);
        else await messagesService.add(chat, req.body);
         
        res.status(200)
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function deleteMessage(req, res) {
    try {
        const chat = await chatsService.getById(req.params.id);
        const messageToUser = await messagesService.deleteMsg(chat, req.query.messageId);

        res.send(messageToUser);
    } catch (error) {
        res.status(500).send(error.message)
    }
}

module.exports = {
    getUserChats,
    addChat,
    message,
    deleteMessage
}