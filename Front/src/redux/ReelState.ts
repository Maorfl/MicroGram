import MyReel from "../interfaces/MyReel";

export class ReelState {
    public reel:MyReel | null = null;
}

export enum ReelActionType {
    SetReel = "SetReel"
}

export interface ReelAction {
    type:ReelActionType;
    payload:MyReel;
}

export function reelReducer(currentState:ReelState = new ReelState(), action:ReelAction):ReelState {
    switch (action.type) {
        case ReelActionType.SetReel:
            return { ...currentState, reel: action.payload };
        default:
            return currentState;
    }
}