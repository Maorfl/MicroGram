
export class ModalState {
    public sideModal: boolean = false;
    public bottomModal: boolean = false;
    public postsModal: boolean = false;
    public storyModal: boolean = false;
}

export enum ModalActionType {
    SetSideModal = "SetSideModal",
    SetBottomModal = "SetBottomModal",
    SetPostsModal = "SetPostsModal",
    SetStoryModal = "SetStoryModal"
}

export interface ModalAction {
    type: ModalActionType
    payload: boolean
}

export function modalReducer(currentState: ModalState = new ModalState(), action: ModalAction): ModalState {
    switch (action.type) {
        case ModalActionType.SetSideModal:
            return JSON.parse(JSON.stringify({ ...currentState, sideModal: action.payload }))
        case ModalActionType.SetBottomModal:
            return JSON.parse(JSON.stringify({ ...currentState, bottomModal: action.payload }))
        case ModalActionType.SetPostsModal:
            return JSON.parse(JSON.stringify({ ...currentState, postsModal: action.payload }))
        case ModalActionType.SetStoryModal:
            return JSON.parse(JSON.stringify({ ...currentState, storyModal: action.payload }))
        default:
            return currentState
    }
}