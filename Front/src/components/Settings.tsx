import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import {
    faAngleRight,
    faArrowRightFromBracket,
    faBan,
    faCircleInfo,
    faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FunctionComponent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useDispatch, useSelector } from "react-redux";
import { handleClickService } from "../services/handleClickService";
import { ClickTypes } from "../enums/clickTypes";
import { PostActionType } from "../redux/PostState";

interface SettingsProps {}

const Settings: FunctionComponent<SettingsProps> = () => {
    const isBottomModal = useSelector((state: any) => state.modalState.bottomModal);
    const loggedUser = authService.getLoggedInUser();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {}, []);

    return (
        <>
            {loggedUser && !isBottomModal && (
                <div className="bg-white flex flex-col settings-modal-container">
                    <div className="settings-container w-full border-solid border-t-8 border-b-8 border-gray-100">
                        <div className="flex flex-col mx-4">
                            <div
                                className="flex justify-between my-3 text-4xl"
                                onClick={(e) => {
                                    const options = {
                                        dispatch,
                                    };
                                    handleClickService.handleClick(e, ClickTypes.saved, "saved", options);
                                }}>
                                <div className="flex" style={{ cursor: "pointer" }}>
                                    <FontAwesomeIcon icon={faBookmark} className="me-2" />
                                    <h2 className="text-3xl self-center font-semibold ms-4 bottom-1">Saved</h2>
                                </div>
                                <FontAwesomeIcon className="text-3xl" icon={faAngleRight} />
                            </div>
                            <div
                                className="flex justify-between my-3"
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                    const options = {
                                        dispatch,
                                    };
                                    handleClickService.handleClick(e, ClickTypes.archive, true, options);
                                }}>
                                <div className="flex" style={{ cursor: "pointer" }}>
                                    <span className="text-4xl">
                                        <FontAwesomeIcon icon={faClockRotateLeft} />
                                    </span>
                                    <h2 className="text-3xl self-center ms-4 font-semibold bottom-1">Archive</h2>
                                </div>
                                <FontAwesomeIcon icon={faAngleRight} />
                            </div>

                            <div
                                className="flex justify-between my-3"
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                    const options = {
                                        dispatch,
                                    };
                                    handleClickService.handleClick(e, ClickTypes.blocked, null, options);
                                }}>
                                <div className="flex" style={{ cursor: "pointer" }}>
                                    <span className="text-4xl">
                                        <FontAwesomeIcon icon={faBan} />
                                    </span>
                                    <h2 className="text-3xl self-center ms-4 font-semibold bottom-1">Blocked</h2>
                                </div>
                                <FontAwesomeIcon icon={faAngleRight} />
                            </div>

                            <div
                                className="flex justify-between my-3"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    dispatch({ type: PostActionType.SetHeaderType, payload: "about" });
                                    navigate("/about");
                                }}>
                                <div className="flex">
                                    <span className="text-4xl">
                                        <FontAwesomeIcon icon={faCircleInfo} />
                                    </span>
                                    <h2 className="text-3xl self-center ms-4 font-semibold bottom-1">About</h2>
                                </div>
                                <FontAwesomeIcon icon={faAngleRight} />
                            </div>

                            <div
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                    const options = {
                                        dispatch,
                                        navigate,
                                    };
                                    handleClickService.handleClick(e, ClickTypes.logout, false, options);
                                }}
                                className="flex justify-between my-3 ">
                                <div className="flex  ">
                                    <span className="text-4xl">
                                        <FontAwesomeIcon icon={faArrowRightFromBracket} />
                                    </span>
                                    <h2 className="text-3xl ms-4 self-center font-semibold text-red-500 bottom-1">
                                        Logout
                                    </h2>
                                </div>
                                <FontAwesomeIcon icon={faAngleRight} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Settings;
