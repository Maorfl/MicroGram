import Post from "../interfaces/Post";

export class PostState {
    public post: Post | null = null;
    public component: string = "none";
}


export enum PostActionType {
    SetPost = "SetPost",
    SetHeaderType = "SetHeaderType",
}

export interface PostAction {
    type: PostActionType;
    payload: Post | string;
}


export function postReducer(currentState: PostState = new PostState(), action: PostAction): PostState {
    switch (action.type) {
        case PostActionType.SetPost:
            return JSON.parse(JSON.stringify({
                ...currentState,
                post: { ...action.payload as Post },
            }));
        case PostActionType.SetHeaderType:
            return JSON.parse(JSON.stringify({
                ...currentState, component: action.payload.toString()
            }))
        default:
            return currentState;
    }
}
