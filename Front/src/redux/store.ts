import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { postReducer } from "./PostState";
import { userReducer } from "./UserState";
import { modalReducer } from "./ModalState";
import { chatReducer } from "./ChatState";
import { reelReducer } from "./ReelState";


const reducer = combineReducers({ postState: postReducer, userState: userReducer, modalState: modalReducer,chatState:chatReducer,reelState:reelReducer });
const store = configureStore({ reducer });

export default store;

