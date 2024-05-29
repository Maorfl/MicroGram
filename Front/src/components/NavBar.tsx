import { FunctionComponent, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClapperboard, faHouse, faMagnifyingGlass, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { PostActionType } from "../redux/PostState";
import { UserActionType } from "../redux/UserState";
import { authService } from "../services/authService";
import { ModalActionType } from "../redux/ModalState";
import { userService } from "../services/userService";
import profilePic from "../assets/images/profile-picture.jpeg";
import { ReelActionType } from "../redux/ReelState";

interface NavBarProps {
    setHeader: Function;
}

const NavBar: FunctionComponent<NavBarProps> = ({ setHeader }) => {
    const loggedUser = authService.getLoggedInUser();
    const header = useSelector((state: any) => state.postState.component);
    const isStoryModal = useSelector((state: any) => state.modalState.storyModal);
    const isBottomModal = useSelector((state: any) => state.modalState.bottomModal);
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        if (!location.pathname.substring(1).includes("login") && location.pathname.substring(1) !== "signup") {
            if (location.pathname.substring(1).includes("chats")) setHeader("chats");
            else if (location.pathname.substring(1).includes("profile")) {
                if (location.pathname.substring(1) === "profile") setHeader("profile");
                else {
                    (async () => {
                        const user = await userService.getUserById(location.pathname.split("/")[2]);
                        dispatch({ type: UserActionType.SetUser, payload: user });
                        setHeader("profile");
                    })();
                }
            } else if (location.pathname.substring(1) === "forgot") return;
            else setHeader(location.pathname.substring(1));
        }
    }, []);

    return loggedUser &&
        header != "none" &&
        header != "reels" &&
        header != "reels-comments" &&
        header != "reels-share" &&
        header != "chat" &&
        !isStoryModal &&
        !isBottomModal ? (
        <>
            <nav className="navBar fixed">
                <NavLink to={"/"}>
                    <span
                        onClick={() => {
                            dispatch({ type: PostActionType.SetHeaderType, payload: "" });
                            dispatch({ type: ModalActionType.SetSideModal, payload: false });
                        }}>
                        <FontAwesomeIcon icon={faHouse} className="text-2xl" />
                    </span>
                </NavLink>

                <NavLink to={"/search"}>
                    <span
                        onClick={() => {
                            dispatch({ type: ModalActionType.SetPostsModal, payload: false });
                            dispatch({ type: PostActionType.SetHeaderType, payload: "search" });
                        }}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-2xl" />
                    </span>
                </NavLink>

                <NavLink to={"/create"}>
                    <span
                        onClick={() => {
                            dispatch({ type: PostActionType.SetHeaderType, payload: "create" });
                            dispatch({ type: ModalActionType.SetSideModal, payload: false });
                            dispatch({ type: ModalActionType.SetPostsModal, payload: false });
                        }}>
                        <FontAwesomeIcon icon={faSquarePlus} className="text-2xl " />
                    </span>
                </NavLink>

                <NavLink to={"/reels"}>
                    <span
                        onClick={() => {
                            dispatch({ type: PostActionType.SetHeaderType, payload: "reels" });
                            dispatch({ type: ModalActionType.SetSideModal, payload: false });
                            dispatch({ type: ModalActionType.SetPostsModal, payload: false });
                            dispatch({ type: ReelActionType.SetReel, payload: null });
                        }}>
                        <FontAwesomeIcon icon={faClapperboard} className="text-2xl" />
                    </span>
                </NavLink>

                <NavLink to={"/profile"}>
                    <span
                        onClick={() => {
                            dispatch({ type: UserActionType.SetUser, payload: loggedUser });
                            dispatch({ type: PostActionType.SetHeaderType, payload: "profile" });
                        }}>
                        <img
                            src={loggedUser.imgUrl || profilePic}
                            alt="avatar"
                            className="w-7 h-7 rounded-full object-cover"
                        />
                    </span>
                </NavLink>
            </nav>
        </>
    ) : (
        <></>
    );
};

export default NavBar;
