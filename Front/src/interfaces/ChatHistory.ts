import MessageDetail from "./MessageDetail";

export default interface ChatHistory {
    _id: string;
    participators: string[];
    msgs: MessageDetail[];
}

