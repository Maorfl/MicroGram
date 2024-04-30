import { FunctionComponent, useEffect, useMemo } from "react";
import User from "../interfaces/User";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faHeart, faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { faAngleDown, faArrowLeft, faBars } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { handleClickService } from "../services/handleClickService";
import { ClickTypes } from "../enums/clickTypes";
import { ModalActionType } from "../redux/ModalState";
import { PostActionType } from "../redux/PostState";

interface AppHeaderProps {}

const AppHeader: FunctionComponent<AppHeaderProps> = () => {
    const user: User = useSelector((state: any) => state.userState.user);
    const header: string = useSelector((state: any) => state.postState.component);
    const currentHeader = useMemo(() => {
        if (header === "more" || header === "comments" || header === "share") return "";
        else return header;
    }, [header]);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {}, [header]);

    switch (currentHeader) {
        case "":
            return (
                <div className="header items-center justify-between">
                    <div className="flex-1">
                        <p className="m-0 billabong text-4xl font-bold">MicroGram</p>
                    </div>
                    <div className="flex-initial flex justify-between">
                        <span
                            className="text-3xl me-4 back-button"
                            onClick={(e) => {
                                const options = {
                                    dispatch,
                                };
                                handleClickService.handleClick(e, ClickTypes.notifications, true, options);
                            }}>
                            <FontAwesomeIcon icon={faHeart} />
                        </span>
                        <span
                            className="text-3xl ms-1 back-button"
                            onClick={(e) => {
                                const options = {
                                    navigate,
                                    dispatch,
                                };
                                handleClickService.handleClick(e, ClickTypes.chats, null, options);
                            }}>
                            <FontAwesomeIcon icon={faCommentDots} />
                        </span>
                    </div>
                </div>
            );
        case "profile":
            if (location.pathname === "/profile") {
                return (
                    <div className="header">
                        <div className="flex w-full">
                            <p className="font-bold text-2xl m-0">{user?.username}</p>
                            <p className="self-center m-0 pt-2 ps-2">
                                <FontAwesomeIcon icon={faAngleDown} />
                            </p>
                        </div>

                        <div className="justify-self-end flex flex-row-reverse justify-between items-center">
                            <FontAwesomeIcon
                                icon={faBars}
                                className="text-3xl ms-4 me-2 back-button"
                                onClick={(e) => {
                                    const options = {
                                        dispatch,
                                    };
                                    dispatch({ type: PostActionType.SetHeaderType, payload: "settings" });
                                    dispatch({ type: ModalActionType.SetPostsModal, payload: false });
                                    handleClickService.handleClick(e, ClickTypes.settings, true, options);
                                }}
                            />
                            <div>
                                <Link to="/create" className="mt-1 me-4">
                                    <FontAwesomeIcon icon={faSquarePlus} className="text-3xl" />
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            } else if (location.pathname === "/profile/edit-profile") {
                return (
                    <div className="header">
                        <div
                            onClick={(e) => {
                                const options = {
                                    dispatch,
                                    navigate,
                                };
                                handleClickService.handleClick(e, ClickTypes.backToProfile, false, options);
                            }}
                            className="flex-initial ms-2 text-2xl back-button">
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </div>
                        <div className="flex-1 font-bold text-overflow m-0 text-2xl">Edit profile</div>
                        <div className="me-2"></div>
                    </div>
                );
            } else if (location.pathname === "/profile/edit-profile/personal-info") {
                return (
                    <div className="header bg-[#ebf4fe]">
                        <div
                            onClick={(e) => {
                                const options = {
                                    dispatch,
                                    navigate,
                                };
                                handleClickService.handleClick(e, ClickTypes.backToProfile, false, options);
                            }}
                            className="flex-initial ms-2 text-2xl back-button">
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </div>
                        <div className="flex-1 font-bold text-overflow m-0 text-2xl">Personal details</div>
                        <div className="me-2"></div>
                    </div>
                );
            } else {
                return (
                    <div className="header items-center">
                        <div
                            onClick={(e) => {
                                const options = {
                                    dispatch,
                                    navigate,
                                };
                                handleClickService.handleClick(e, ClickTypes.backToHome, null, options);
                            }}
                            className="flex-initial ms-2 text-2xl back-button">
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </div>
                        <p className="flex-1 font-bold text-overflow m-0 text-2xl">{user.username}</p>
                    </div>
                );
            }
        case "reels-share":
            return (
                <div className="header-reels">
                    <div
                        onClick={(e) => {
                            const options = {
                                dispatch,
                                navigate,
                            };
                            handleClickService.handleClick(e, ClickTypes.backToHome, null, options);
                        }}
                        className="flex-initial ms-2 text-2xl back-button">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </div>
                    <div className="flex-1 font-bold text-overflow m-0 text-2xl">Reels</div>
                    <div className="me-2"></div>
                </div>
            );
        case "reels":
            return (
                <div className="header-reels">
                    <div
                        onClick={(e) => {
                            const options = {
                                dispatch,
                                navigate,
                            };
                            handleClickService.handleClick(e, ClickTypes.backToHome, null, options);
                        }}
                        className="flex-initial ms-2 text-2xl back-button">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </div>
                    <div className="flex-1 font-bold text-overflow m-0 text-2xl">Reels</div>
                    <div className="me-2"></div>
                </div>
            );
        case "reels-comments":
            return (
                <div className="header-reels">
                    <div
                        onClick={(e) => {
                            const options = {
                                dispatch,
                                navigate,
                            };
                            handleClickService.handleClick(e, ClickTypes.backToHome, null, options);
                        }}
                        className="flex-initial ms-2 text-2xl back-button">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </div>
                    <div className="flex-1 font-bold text-overflow m-0 text-2xl">Reels</div>
                    <div className="me-2"></div>
                </div>
            );
        case "tagged":
            return (
                <div className="header">
                    <div
                        onClick={(e) => {
                            const options = {
                                dispatch,
                            };
                            handleClickService.handleClick(e, ClickTypes.backToProfile, false, options);
                        }}
                        className="flex-initial ms-2 text-2xl back-button">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </div>
                    <div className="flex-1 font-bold text-overflow m-0 text-2xl">Tagged</div>
                    <div className="me-2"></div>
                </div>
            );
        case "posts":
            return (
                <div className="header">
                    <div
                        onClick={(e) => {
                            const options = {
                                dispatch,
                            };
                            handleClickService.handleClick(e, ClickTypes.backToProfile, false, options);
                        }}
                        className="flex-initial ms-2 text-2xl back-button">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </div>
                    <div className="flex-1 font-bold text-overflow m-0 text-2xl">Posts</div>
                    <div className="me-2"></div>
                </div>
            );
        case "post":
            return (
                <div className="header">
                    <div
                        onClick={(e) => {
                            const options = {
                                dispatch,
                            };
                            handleClickService.handleClick(e, ClickTypes.backToChat, false, options);
                        }}
                        className="flex-initial ms-2">
                        <FontAwesomeIcon className="text-2xl" icon={faArrowLeft} />
                    </div>
                    <div className="flex items-center">
                        <p className="m-0 billabong text-4xl font-bold ms-5">MicroGram</p>
                    </div>
                    <div className="me-2"></div>
                </div>
            );
        case "explore":
            return (
                <div className="header">
                    <div
                        onClick={(e) => {
                            const options = {
                                dispatch,
                                navigate,
                            };
                            handleClickService.handleClick(e, ClickTypes.back, location.pathname.substring(1), options);
                        }}
                        className="flex-initial ms-2 text-2xl back-button">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </div>
                    <div className="flex-1 font-bold text-overflow m-0 text-2xl">Explore</div>
                    <div className="me-2"></div>
                </div>
            );
        case "create":
            return (
                <div className="header border-b">
                    <div
                        onClick={(e) => {
                            const options = {
                                dispatch,
                                navigate,
                            };
                            handleClickService.handleClick(e, ClickTypes.backToHome, null, options);
                        }}
                        className="flex-initial ms-2 text-2xl back-button">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </div>
                    <div className="flex-1 font-bold text-overflow m-0 text-2xl">Create</div>
                    <div className="me-2"></div>
                </div>
            );
        case "settings":
            return (
                <div className="header">
                    <div
                        onClick={(e) => {
                            const options = {
                                dispatch,
                                navigate,
                            };
                            handleClickService.handleClick(e, ClickTypes.back, location.pathname.substring(1), options);
                        }}
                        className="flex-initial ms-2 text-2xl back-button">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </div>
                    <div className="flex-1 font-bold text-overflow m-0 text-2xl">Settings</div>
                    <div className="me-2"></div>
                </div>
            );
        case "about":
            return (
                <div className="header">
                    <div
                        onClick={(e) => {
                            const options = {
                                dispatch,
                                navigate,
                            };
                            handleClickService.handleClick(e, ClickTypes.aboutBack, null, options);
                        }}
                        className="flex-initial ms-2 text-2xl back-button">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </div>
                    <div className="flex-1 font-bold text-overflow m-0 text-2xl">About</div>
                    <div className="me-2"></div>
                </div>
            );
        case "saved":
            return (
                <div className="header">
                    <div
                        onClick={(e) => {
                            const options = {
                                dispatch,
                                navigate,
                            };
                            handleClickService.handleClick(
                                e,
                                ClickTypes.backToSettings,
                                location.pathname.substring(1),
                                options
                            );
                        }}
                        className="flex-initial ms-2 text-2xl back-button">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </div>
                    <div className="flex-1 font-bold text-overflow m-0 text-2xl">Saved</div>
                    <div className="me-2"></div>
                </div>
            );
        case "notifications":
            return (
                <div className="header">
                    <div
                        onClick={(e) => {
                            const options = {
                                dispatch,
                                navigate,
                            };
                            handleClickService.handleClick(e, ClickTypes.back, location.pathname.substring(1), options);
                        }}
                        className="flex-initial ms-2 text-2xl back-button">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </div>
                    <div className="flex-1 font-bold text-overflow text-2xl">Notifications</div>
                    <div className="me-2"></div>
                </div>
            );
        case "archive":
            return <></>;
        case "blocked":
            return (
                <div className="header">
                    <div
                        onClick={(e) => {
                            const options = {
                                dispatch,
                                navigate,
                            };
                            handleClickService.handleClick(
                                e,
                                ClickTypes.backToSettings,
                                location.pathname.substring(1),
                                options
                            );
                        }}
                        className="flex-initial ms-2 text-2xl back-button">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </div>
                    <div className="flex-1 font-bold text-overflow text-2xl">Blocked</div>
                    <div className="me-2"></div>
                </div>
            );
        case "followers":
            return (
                <div className="header">
                    <div
                        onClick={(e) => {
                            const options = {
                                dispatch,
                            };
                            handleClickService.handleClick(e, ClickTypes.backToProfile, false, options);
                        }}
                        className="flex-initial ms-2 text-2xl back-button">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </div>
                    <div className="flex-1 font-bold text-overflow text-2xl">{user.username}</div>
                    <div className="me-2 font-semibold">Followers</div>
                </div>
            );
        case "following":
            return (
                <div className="header">
                    <div
                        onClick={(e) => {
                            const options = {
                                dispatch,
                            };
                            handleClickService.handleClick(e, ClickTypes.backToProfile, false, options);
                        }}
                        className="flex-initial ms-2 text-2xl back-button">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </div>
                    <div className="flex-1 font-bold text-overflow text-2xl">{user.username}</div>
                    <div className="me-2 font-semibold">Following</div>
                </div>
            );
        case "none":
            return <></>;
        default:
            return <></>;
    }
};

export default AppHeader;
