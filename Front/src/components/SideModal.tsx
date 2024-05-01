import { FunctionComponent, useEffect, useState } from "react";
import Settings from "./Settings";
import { useDispatch, useSelector } from "react-redux";
import Saved from "./Saved";
import Notifications from "./Notifications";
import Blocked from "./Blocked";
import Followers from "./Followers";
import Following from "./Following";
import ChatDetails from "./ChatDetails";
import { ModalActionType } from "../redux/ModalState";
import BottomModal from "./BottomModal";
import { useLocation, useNavigate } from "react-router-dom";
import { PostActionType } from "../redux/PostState";

interface SideModalProps {
    isSideModal: boolean;
}

const SideModal: FunctionComponent<SideModalProps> = ({ isSideModal }) => {
    const header = useSelector((state: any) => state.postState.component);
    const [currentComponent, setCurrentComponent] = useState<string>("home");
    const isBottomModal = useSelector((state: any) => state.modalState.bottomModal);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (header === "settings") setCurrentComponent("settings");
    }, [header]);

    return (
        <>
            {!isBottomModal && (
                <div className={`sideModal ${isSideModal ? "sideModal-active" : ""}`}>
                    {header === "settings" ? (
                        <Settings />
                    ) : header === "saved" ? (
                        <Saved />
                    ) : header === "notifications" ? (
                        <Notifications />
                    ) : header === "blocked" ? (
                        <Blocked />
                    ) : header === "followers" ? (
                        <Followers />
                    ) : header === "following" ? (
                        <Following />
                    ) : header === "chat" ? (
                        <ChatDetails />
                    ) : (
                        <></>
                    )}
                </div>
            )}
            <div
                className={`modal-bg ${isBottomModal ? "active" : ""} `}
                onClick={(e) => {
                    e.preventDefault();
                    dispatch({ type: ModalActionType.SetBottomModal, payload: false });
                    if (location.pathname === "/chats") {
                        dispatch({ type: PostActionType.SetHeaderType, payload: "chats" });
                        navigate("/chats");
                    } else if (location.pathname === "/profile") {
                        dispatch({ type: PostActionType.SetHeaderType, payload: "profile" });
                        navigate("/profile");
                    }
                }}>
                <BottomModal isBottomModal={isBottomModal} currentComponent={currentComponent} />
            </div>
        </>
    );
};

export default SideModal;
