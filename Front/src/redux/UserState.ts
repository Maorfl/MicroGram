import User from "../interfaces/User";

export class UserState {
    public user: User | {} = {}
}

export enum UserActionType {
    SetUser = "SetUser",
}

export interface UserAction {
    type: UserActionType;
    payload: User;
}

export function userReducer(currentState: UserState = new UserState(), action: UserAction): UserState {
    switch (action.type) {
        case UserActionType.SetUser:
            return JSON.parse(JSON.stringify({ ...currentState, user: { ...action.payload } }));
        default:
            return currentState;
    };
}

