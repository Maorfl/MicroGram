import { FunctionComponent, useEffect, useState } from "react";
import { authService } from "../services/authService";
import User from "../interfaces/User";
import { userService } from "../services/userService";
import { faCheck, faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { chatService } from "../services/chatService";
import ChatHistory from "../interfaces/ChatHistory";
import { ModalActionType } from "../redux/ModalState";
import { PostActionType } from "../redux/PostState";
import profilePic from "../assets/images/profile-picture.jpeg";
import { useLocation } from "react-router-dom";
import { feedbackService } from "../services/feedbackService";

interface ShareProps {}

const Share: FunctionComponent<ShareProps> = () => {
    const post = useSelector((state: any) => state.postState.post);
    const reel = useSelector((state: any) => state.reelState.reel);
    const loggedUser = authService.getLoggedInUser();
    const [followingUsers, setFollowingUsers] = useState<User[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [search, setSearch] = useState<string>("");
    const [isSelected, setIsSelected] = useState<boolean>(false);
    const [text, setText] = useState<string>("");
    const dispatch = useDispatch();
    const location = useLocation();

    const handleUserClick = (e: any, user: User) => {
        e.preventDefault();
        const userIds: string[] = selectedIds;
        const clickedId = user._id;
        if (selectedIds.includes(clickedId)) {
            userIds.splice(userIds.indexOf(clickedId), 1);
            setSelectedIds(userIds);
        } else {
            userIds.push(clickedId);
            setSelectedIds(userIds);
        }
        setIsSelected(!isSelected);
    };

    const handleSubmit = async () => {
        if (text || Object.keys(post).length > 0 || reel) {
            const selectedUsers = await Promise.all(
                selectedIds?.map(async (userId: string) => await userService.getUserById(userId))
            );
            const chats = await chatService.getUserChats(loggedUser?._id as string);
            if (!chats.length) {
                selectedUsers.forEach(async (user: User) => {
                    const newChat = await chatService.openChat((loggedUser as User)._id, user._id);
                    user.chats.push(newChat._id);
                    loggedUser?.chats.push(newChat._id);
                    await chatService.addMessage(
                        { reel: reel, post: post, txt: text },
                        (loggedUser as User)._id,
                        newChat._id
                    );
                    await userService.updateUser(user);
                    await userService.updateUser(loggedUser as User);
                });
            } else {
                chats.forEach(async (chat: ChatHistory) => {
                    selectedUsers.forEach(async (user: any) => {
                        if (user?.chats?.includes(chat._id))
                            await chatService.addMessage(
                                { reel: reel, post: post, txt: text },
                                (loggedUser as User)._id,
                                chat?._id
                            );
                        else {
                            const newChat = await chatService.openChat((loggedUser as User)._id, user._id);
                            user.chats.push(newChat._id);
                            loggedUser?.chats.push(newChat._id);
                            await chatService.addMessage(
                                { reel: reel, post: post, txt: text },
                                (loggedUser as User)._id,
                                newChat._id
                            );
                            await userService.updateUser(user);
                            await userService.updateUser(loggedUser as User);
                        }
                    });
                });
            }
            dispatch({ type: ModalActionType.SetBottomModal, payload: false });
            if (location.pathname === "/reels") dispatch({ type: PostActionType.SetHeaderType, payload: "reels" });
            else if (location.pathname === "/chats") dispatch({ type: PostActionType.SetHeaderType, payload: "chats" });
            else dispatch({ type: PostActionType.SetHeaderType, payload: "" });
        }
    };

    useEffect(() => {
        let followingUsers: any = [];
        (async () => {
            followingUsers = await Promise.all(
                (loggedUser as User).following?.map(async (userId: string) => await userService.getUserById(userId))
            );
            if (search.length) {
                followingUsers = followingUsers.filter((user: User) =>
                    user.fullname.toLowerCase().includes(search.toLowerCase())
                );
            }
            setFollowingUsers(followingUsers);
        })();
    }, [search]);

    return (
        <>
            <div className="modal-line"></div>
            <div className="mt-4">
                <div className="w-full px-3 py-1 flex gap-2 h-11">
                    <div className="flex items-center px-3 bg-[#EFEFEF] w-full rounded-lg">
                        <span className={`${search.length ? "text-[#d1d1d1]" : ""} flex`}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-lg" />
                        </span>
                        <input
                            className="bg-[#EFEFEF] h-9 ms-3 w-full text-lg"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            type="search"
                            placeholder="Search"
                        />
                        <button className={`${search === "" ? "hidden" : ""}`} onClick={() => setSearch("")}>
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>
                </div>
            </div>
            {followingUsers.length ? (
                <div className="grid grid-cols-3 gap-10 px-4 mt-3">
                    {followingUsers.map((user: User) => {
                        return (
                            <div
                                key={user._id}
                                id={user._id}
                                className="flex flex-col items-center relative"
                                onClick={(e) => {
                                    handleUserClick(e, user);
                                }}>
                                <img src={user.imgUrl || profilePic} alt="User image" className="rounded-image-lg" />
                                <p className="m-0 text-center text-sm text-overflow">{user.fullname}</p>
                                {selectedIds.includes(user._id) ? (
                                    <div className="selected-user flex items-center justify-center">
                                        <FontAwesomeIcon className="text-xl" icon={faCheck} />
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex justify-center mt-5">No users found</div>
            )}
            <div
                className={`w-full flex items-center px-3 border-t bg-white fixed bottom-0 ${
                    selectedIds.length ? "" : "hidden"
                }`}>
                <form className="w-full py-2">
                    <input
                        type="text"
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Write a message..."
                        className="w-full bg-transparent outline-none mb-2 placeholder:text-gray-600"
                    />
                    <button
                        type="submit"
                        className="w-full rounded bg-[#0095f6] text-white font-semibold py-2"
                        onClick={() => feedbackService.promiseToast(handleSubmit, "Sended")}>
                        Send
                    </button>
                </form>
            </div>
        </>
    );
};

export default Share;
