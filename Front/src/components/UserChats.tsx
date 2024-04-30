import { FunctionComponent, useEffect, useState } from "react";
import SideModal from "./SideModal";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { faArrowLeft, faCommentMedical, faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authService } from "../services/authService";
import { PostActionType } from "../redux/PostState";
import ClipLoader from "react-spinners/ClipLoader";
import ChatHistory from "../interfaces/ChatHistory";
import { chatService } from "../services/chatService";
import Chat from "./Chat";
import { userService } from "../services/userService";
import PostDetail from "./PostDetail";
import { ModalActionType } from "../redux/ModalState";
import { ReelActionType } from "../redux/ReelState";

interface UserChatsProps {}

const UserChats: FunctionComponent<UserChatsProps> = () => {
    const loggedUser = authService.getLoggedInUser();
    const [userChats, setUserChats] = useState<ChatHistory[]>([]);
    const [isPending, setIsPending] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const isSideModal = useSelector((state: any) => state.modalState.sideModal);
    const isPostsModal = useSelector((state: any) => state.modalState.postsModal);
    const isBottomModal = useSelector((state: any) => state.modalState.bottomModal);
    const post = useSelector((state: any) => state.postState.post);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            setIsPending(true);
            let userChats: any = await chatService.getUserChats(loggedUser?._id as string);
            if (search.length) {
                let participators = await Promise.all(
                    userChats.map(async (chat: ChatHistory) => {
                        return chat.participators[0] == loggedUser?._id
                            ? await userService.getUserById(chat.participators[1])
                            : await userService.getUserById(chat.participators[0]);
                    })
                );
                participators = participators.filter((participator) =>
                    participator.username.toLowerCase().includes(search.toLowerCase())
                );
                userChats = userChats.filter((chat: ChatHistory) => {
                    return participators.some((participator: any) => {
                        return chat.participators.includes(participator._id);
                    });
                });
            }
            userChats.sort(
                (a: ChatHistory, b: ChatHistory) =>
                    b.msgs[b.msgs.length - 1]?.createdAt - a.msgs[a.msgs.length - 1]?.createdAt
            );
            setUserChats(userChats);
            setIsPending(false);
        })();
    }, [search]);

    return (
        <>
            {!isSideModal && !isPostsModal && !isBottomModal ? (
                <>
                    <div className="header items-center">
                        <div
                            onClick={(e) => {
                                e.preventDefault();
                                dispatch({ type: PostActionType.SetHeaderType, payload: "" });
                                navigate("/");
                            }}
                            className="flex-initial ms-2 text-2xl back-button">
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </div>
                        <div className="flex-1 font-bold text-overflow text-2xl">{loggedUser?.username}</div>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                dispatch({ type: PostActionType.SetPost, payload: null });
                                dispatch({ type: ReelActionType.SetReel, payload: null });
                                dispatch({ type: ModalActionType.SetBottomModal, payload: true });
                                dispatch({ type: PostActionType.SetHeaderType, payload: "chats-share" });
                            }}
                            className="flex-initial ms-3 text-3xl text-end">
                            <FontAwesomeIcon icon={faCommentMedical} />
                        </button>
                    </div>

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

                    <div className="w-full px-3 mt-2">
                        <p className="font-bold">Messages</p>
                        {!isPending ? (
                            <div className="w-full">
                                {userChats.length ? (
                                    <>
                                        {userChats.map((chat: ChatHistory) => {
                                            return <Chat key={chat?._id} chat={chat} />;
                                        })}
                                    </>
                                ) : (
                                    <p className="font-semibold text-center text-2xl pt-3">No chats found</p>
                                )}
                            </div>
                        ) : (
                            <div className="flex justify-center mt-2">
                                <ClipLoader color="#0095f6" />
                            </div>
                        )}
                    </div>
                </>
            ) : (
                !isSideModal && !isBottomModal && isPostsModal && <PostDetail post={post} />
            )}
            <SideModal isSideModal={isSideModal} />
        </>
    );
};

export default UserChats;
