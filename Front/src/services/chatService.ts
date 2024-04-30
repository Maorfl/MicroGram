import ChatHistory from "../interfaces/ChatHistory";
import MessageDetail from "../interfaces/MessageDetail";
import axiosService from "./axiosService";
import { utilService } from "./utilService";

const ENDPOINT = '/chats';

export const chatService = {
    getUserChats,
    openChat,
    deleteChat,
    addMessage,
    editMessage,
    deleteMessage,
    makeNewMessage
}

async function getUserChats(userId:string): Promise<ChatHistory[]> {
    try {
        return await axiosService.get(`${ENDPOINT}`,{userId});
    } catch (error) {
        throw new Error("Could not get user's chats");
    }
}

async function openChat(senderId: string, receiverId: string): Promise<ChatHistory> {
    try {
        const newChat = {
            participators: [senderId, receiverId],
            msgs: []
        }
        return await axiosService.post(`${ENDPOINT}`, newChat)
    } catch (error) {
        throw new Error("Could not open chat");
    }
}

async function deleteChat(chatId: string, userId: string): Promise<ChatHistory> {
    try {
        return await axiosService.delete(`${ENDPOINT}/${userId}?chatId=${chatId}`);
    } catch (error) {
        throw new Error("Could not delete chat")
    }
}

async function addMessage(content: any, senderId: string, chatId: string): Promise<MessageDetail> {
    try {
        const newMessage: MessageDetail = makeNewMessage(content,senderId)
        return await axiosService.put(`${ENDPOINT}/${chatId}`, newMessage);
    } catch (error) {
        throw new Error("Could not post message");
    }
}

async function editMessage(content: string, chatId: string): Promise<MessageDetail> {
    try {
        await axiosService.put(`${ENDPOINT}/${chatId}`, content);
        return await axiosService.put(`${ENDPOINT}/${chatId}`, content);
    } catch (error) {
        throw new Error("Could not edit message");
    }
}

async function deleteMessage(messageId: string, chatId: string): Promise<MessageDetail> {
    try {
        return await axiosService.delete(`${ENDPOINT}/?chatId=${chatId}messageId=${messageId}`)
    } catch (error) {
        throw new Error("Could not delete message");
    }
}

function makeNewMessage(content:any,senderId:string) {
    const newMessage = {
        messageId: utilService.makeId(),
        senderId: senderId,
        createdAt: Date.now(),
        content: {...content}
    }
    return newMessage
}