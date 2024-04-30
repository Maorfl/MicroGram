import ChatHistory from "../interfaces/ChatHistory";

export class ChatState {
    public chat:ChatHistory | {} ={}
}

export enum ChatActionType {
    SetChat = "SetChat"
}

export interface ChatAction {
    type:ChatActionType
    payload:ChatHistory
}

export function chatReducer(currentState: ChatState = new ChatState(), action: ChatAction): ChatState {
    switch (action.type) {
        case ChatActionType.SetChat:
            return JSON.parse(JSON.stringify({ ...currentState, chat: action.payload }));
        default:
            return currentState;
    }
}