import { faBookmark, faEyeSlash, faQrcode, faUserMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FunctionComponent, useEffect, useState } from "react";
import { authService } from "../services/authService";
import { useDispatch, useSelector } from "react-redux";
import { userService } from "../services/userService";
import User from "../interfaces/User";
import { UserActionType } from "../redux/UserState";
import { ModalActionType } from "../redux/ModalState";

interface PostOptionsProps {}

const PostOptions: FunctionComponent<PostOptionsProps> = () => {
    const loggedUser = authService.getLoggedInUser();
    const post = useSelector((state: any) => state.postState.post);
    const [postBy, setPostBy] = useState<any>();
    const [isChanged, setIsChanged] = useState<boolean>(false);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            setPostBy((await userService.getUserById(post?.by.id)) as User);
        })();
    }, [isChanged]);

    return (
        <>
            <div className="modal-line"></div>
            <div className="flex justify-around mt-5 border-b pb-3">
                <div
                    className="flex flex-col"
                    onClick={async (e) => {
                        e.preventDefault();
                        if (loggedUser?.savedPosts.includes(post._id))
                            loggedUser.savedPosts.splice(loggedUser.savedPosts.indexOf(post._id), 1);
                        else loggedUser?.savedPosts.push(post._id);
                        setIsChanged(!isChanged);
                        dispatch({ type: UserActionType.SetUser, payload: loggedUser });
                        await userService.updateUser(loggedUser as User);
                    }}>
                    <div className="flex rounded-full h-16 w-16 outline outline-1 p-3 justify-center items-center">
                        <FontAwesomeIcon
                            className={`text-2xl ${loggedUser?.savedPosts.includes(post._id) ? "text-blue-600" : ""}`}
                            icon={faBookmark}
                        />
                    </div>
                    <p className="m-0 text-sm font-semibold text-center pt-1">
                        {loggedUser?.savedPosts.includes(post._id) ? "Unsave" : "Save"}
                    </p>
                </div>
                <div className="flex flex-col">
                    <div className="flex rounded-full h-16 w-16 outline outline-1 p-3 justify-center items-center">
                        <FontAwesomeIcon className="text-2xl" icon={faQrcode} />
                    </div>
                    <p className="m-0 text-sm font-semibold text-center pt-1">QR code</p>
                </div>
            </div>

            <div className="px-3 mt-3">
                <div
                    className="flex items-center"
                    onClick={async (e) => {
                        e.preventDefault();
                        if (
                            loggedUser?.following?.includes(postBy._id) &&
                            postBy.followers.includes((loggedUser as User)._id)
                        ) {
                            loggedUser?.following?.splice(loggedUser.followers.indexOf(postBy._id), 1);
                            postBy.followers.splice(postBy.followers.indexOf((loggedUser as User)._id), 1);
                            dispatch({ type: UserActionType.SetUser, payload: loggedUser });
                            dispatch({ type: ModalActionType.SetBottomModal, payload: false });
                            await userService.updateUser(postBy as User);
                            await userService.updateUser(loggedUser as User);
                        }
                    }}>
                    <FontAwesomeIcon className="text-xl me-3" icon={faUserMinus} />
                    <p className="text-xl m-0">Unfollow</p>
                </div>
                {loggedUser?.blocked?.includes(post.by.id) ? (
                    <div
                        className="flex items-center mt-4 pt-1"
                        onClick={async (e) => {
                            e.preventDefault();
                            const user = {
                                ...loggedUser,
                                blocked: loggedUser?.blocked?.slice(loggedUser?.blocked?.indexOf(postBy._id), 1),
                            };
                            setIsChanged(!isChanged);
                            dispatch({ type: UserActionType.SetUser, payload: user });
                            dispatch({ type: ModalActionType.SetBottomModal, payload: false });
                            await userService.updateUser(user as User);
                        }}>
                        <FontAwesomeIcon className="text-xl me-3 text-orange-400" icon={faEyeSlash} />
                        <p className="text-xl m-0">Unblock</p>
                    </div>
                ) : (
                    <div
                        className="flex items-center mt-4 pt-1"
                        onClick={async (e) => {
                            e.preventDefault();
                            const user = {
                                ...loggedUser,
                                blocked: [...(loggedUser as User).blocked, postBy._id],
                            };
                            setIsChanged(!isChanged);
                            dispatch({ type: UserActionType.SetUser, payload: user });
                            dispatch({ type: ModalActionType.SetBottomModal, payload: false });
                            await userService.updateUser(user as User);
                        }}>
                        <FontAwesomeIcon className="text-xl me-3" icon={faEyeSlash} />
                        <p className="text-xl m-0">Block</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default PostOptions;
