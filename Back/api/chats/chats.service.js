const Chat = require('../../models/Chat');
const usersService = require('../users/users.service');

async function getById(chatId) {
    try {
        const chat = await Chat.findById(chatId);
        return chat
    } catch (error) {
        throw error;
    }
}

async function add(chat) {
    try {
        const newChat = new Chat(chat);
        return await newChat.save();
    } catch (error) {
        throw error
    }
}

async function saveChatToUsers(usersIds, chatId) {
    try {
        await usersIds.forEach(async (userId) => {
            let user = await usersService.getById(userId);
            user.chats.push(chatId)
            await usersService.update(user)
        })
    } catch (error) {
        throw new Error(error)
    }
}


module.exports = {
    getById,
    add,
    saveChatToUsers
}
