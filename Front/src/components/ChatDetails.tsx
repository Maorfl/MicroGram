import { faArrowLeft, faCamera, faClapperboard, faImage, faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MessageDetail from "../interfaces/MessageDetail";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { handleClickService } from "../services/handleClickService";
import { ClickTypes } from "../enums/clickTypes";
import { chatService } from "../services/chatService";
import { ChatActionType } from "../redux/ChatState";
import { ModalActionType } from "../redux/ModalState";
import { PostActionType } from "../redux/PostState";
import profilePic from "../assets/images/profile-picture.jpeg";
import { ReelActionType } from "../redux/ReelState";

interface ChatDetailsProps {}

const ChatDetails: FunctionComponent<ChatDetailsProps> = () => {
    const loggedUser = authService.getLoggedInUser();
    const user = useSelector((state: any) => state.userState.user);
    const chat = useSelector((state: any) => state.chatState.chat);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [text, setText] = useState<string>("");
    const lastContentDiv = useRef<HTMLDivElement>(null);
    const [isChanged, setIsChanged] = useState<boolean>(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const newMessage = chatService.makeNewMessage({ txt: text }, loggedUser?._id as string);
        const currChat = { ...chat, msgs: [...chat.msgs, newMessage] };
        dispatch({ type: ChatActionType.SetChat, payload: currChat });
        setText("");
        setIsChanged(!isChanged);
        await chatService.addMessage(newMessage.content, loggedUser?._id as string, chat._id);
    };

    useEffect(() => {
        if (lastContentDiv.current) {
            lastContentDiv.current.scrollIntoView({ behavior: "instant" });
        }
    }, [isChanged]);

    return (
        <>
            {user && (
                <div className="max-h-screen flex flex-col">
                    <div className="header flex-1">
                        <div
                            onClick={(e) => {
                                const options = {
                                    dispatch,
                                    navigate,
                                };
                                handleClickService.handleClick(e, ClickTypes.chats, null, options);
                            }}
                            className="flex-initial ms-2 text-2xl">
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </div>
                        <div
                            className="flex-1 flex justify-center w-1/2 items-center me-5"
                            onClick={(e) => {
                                e.preventDefault();
                                dispatch({ type: ModalActionType.SetSideModal, payload: false });
                                dispatch({ type: PostActionType.SetHeaderType, payload: "profile" });
                                navigate(`/profile/${user._id}`);
                            }}>
                            <div className="me-3">
                                <img src={user.imgUrl || profilePic} className="rounded-image-sm" alt="User image" />
                            </div>
                            <div className="flex flex-col">
                                <p className="font-bold text-lg text-overflow m-0 ">{user.fullname}</p>
                                <p className="text-[#737373] text-sm text-overflow m-0 leading-none">{user.username}</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full mb-14 overflow-scroll">
                        {chat.msgs?.length && chat.msgs[0] ? (
                            <div className="w-full px-2">
                                {chat.msgs.map((msg: MessageDetail) => (
                                    <div
                                        key={msg.messageId}
                                        ref={lastContentDiv}
                                        className={`flex ${
                                            msg.senderId == loggedUser?._id
                                                ? "place-content-start"
                                                : "place-content-end"
                                        }`}>
                                        {msg.content.reel ? (
                                            <div>
                                                <div
                                                    className="w-1/2 relative mt-2"
                                                    onClick={() => {
                                                        dispatch({
                                                            type: ReelActionType.SetReel,
                                                            payload: msg.content.reel,
                                                        });
                                                        dispatch({
                                                            type: PostActionType.SetHeaderType,
                                                            payload: "reels",
                                                        });
                                                        dispatch({
                                                            type: ModalActionType.SetSideModal,
                                                            payload: false,
                                                        });
                                                        navigate(`/reels`);
                                                    }}>
                                                    <div className="absolute top-2 left-2 flex items-center w-full bg-[#00000000]">
                                                        <img
                                                            src={
                                                                msg.content.reel.reelInfo.postedBy?.avatar || profilePic
                                                            }
                                                            alt="User image"
                                                            className="rounded-image-xs"
                                                        />
                                                        <p className="m-0 text-white font-semibold text-overflow">
                                                            {msg.content.reel.reelInfo.postedBy?.name}
                                                        </p>
                                                    </div>
                                                    <video
                                                        src={msg.content.reel.reelInfo.url}
                                                        autoPlay
                                                        muted
                                                        className="rounded"
                                                    />
                                                    <div className="absolute bottom-2 left-2 flex items-center w-full bg-[#00000000]">
                                                        <FontAwesomeIcon
                                                            className="text-xl text-white"
                                                            icon={faClapperboard}
                                                        />
                                                    </div>
                                                </div>
                                                {msg.content.txt.length ? (
                                                    <div className="w-fit flex px-2 mt-1">
                                                        <div
                                                            className={`${
                                                                msg.senderId == loggedUser?._id
                                                                    ? "bg-[#0095f6] text-white"
                                                                    : "bg-[#d8d8d8] text-black"
                                                            }  rounded-full p-2`}>
                                                            <p className="m-0">{msg.content.txt}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                        ) : msg.content.post ? (
                                            <div className="pt-2">
                                                <div
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        dispatch({
                                                            type: PostActionType.SetPost,
                                                            payload: msg.content.post,
                                                        });
                                                        dispatch({
                                                            type: PostActionType.SetHeaderType,
                                                            payload: "post",
                                                        });
                                                        dispatch({
                                                            type: ModalActionType.SetPostsModal,
                                                            payload: true,
                                                        });
                                                        dispatch({
                                                            type: ModalActionType.SetSideModal,
                                                            payload: false,
                                                        });
                                                    }}>
                                                    <div className="flex flex-col w-2/3 bg-[#dbdbdb] rounded">
                                                        <div className="flex items-center p-2">
                                                            <div className="me-3">
                                                                <img
                                                                    src={msg.content.post.by.imgUrl || profilePic}
                                                                    alt="User image"
                                                                    className="rounded-image-xs"
                                                                />
                                                            </div>
                                                            <p className="font-bold m-0 text-lg">
                                                                {msg.content.post.by.username}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <img
                                                                src={msg.content.post.imgUrl}
                                                                alt="Message image"
                                                                className="object-cover w-full aspect-square"
                                                            />
                                                        </div>
                                                        <div className="p-2 flex">
                                                            <p className="m-0 font-bold pe-1">
                                                                {msg.content.post.by.username}
                                                            </p>
                                                            <p className="m-0 text-overflow">{msg.content.post.txt}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {msg.content.txt.length ? (
                                                    <div className="w-fit px-2 mt-1">
                                                        <div
                                                            className={`${
                                                                msg.senderId == loggedUser?._id
                                                                    ? "bg-[#0095f6] text-white"
                                                                    : "bg-[#d8d8d8] text-black"
                                                            }  rounded-full p-2`}>
                                                            <p className="m-0">{msg.content.txt}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="w-fit px-2 mt-3">
                                                <div
                                                    className={`${
                                                        msg.senderId == loggedUser?._id
                                                            ? "bg-[#0095f6] text-white"
                                                            : "bg-[#d8d8d8] text-black"
                                                    }  rounded-full p-2`}>
                                                    <p className="m-0">{msg.content.txt}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>

                    <div className="w-full flex items-center fixed mt-2 bottom-0 h-14 px-2">
                        <div className="flex w-full rounded-full bg-[#dfdfdf] px-2 py-1">
                            <div className="rounded-full bg-[#0095f6] p-2 flex justify-center items-center self-center">
                                <FontAwesomeIcon className="text-white text-2xl" icon={faCamera} />
                            </div>
                            <div className="self-center w-full flex">
                                <input
                                    style={{ caretColor: "#0095f6" }}
                                    type="text"
                                    placeholder="Message..."
                                    className="bg-transparent ps-2 w-full outline-0 placeholder-gray-500"
                                    onChange={(e) => setText(e.target.value)}
                                    value={text}
                                />
                                <div className="flex justify-around items-center me-3">
                                    {text.length ? (
                                        <>
                                            <button
                                                className="text-[#0095f6] font-semibold text-xl"
                                                onClick={(e) => handleSubmit(e)}>
                                                Send
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <label htmlFor="voice">
                                                <FontAwesomeIcon className="text-2xl me-4" icon={faMicrophone} />
                                            </label>
                                            <input id="voice" type="file" accept="audio/*" hidden />

                                            <label htmlFor="image">
                                                <FontAwesomeIcon className="text-2xl" icon={faImage} />
                                            </label>
                                            <input id="image" type="file" accept="image/*" hidden />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatDetails;
