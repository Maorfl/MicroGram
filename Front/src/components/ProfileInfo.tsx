import { FunctionComponent, useEffect, useState } from "react";
import User from "../interfaces/User";
import { handleClickService } from "../services/handleClickService";
import { ClickTypes } from "../enums/clickTypes";
import { useDispatch, useSelector } from "react-redux";
import { authService } from "../services/authService";
import StoriesBar from "./StoriesBar";
import { storyService } from "../services/storyService";
import Highlight from "../interfaces/Highlight";
import Story from "../interfaces/Story";
import { useNavigate, useParams } from "react-router-dom";
import profilePic from "../assets/images/profile-picture.jpeg";
import { userService } from "../services/userService";
import { UserActionType } from "../redux/UserState";
import { chatService } from "../services/chatService";
import ChatHistory from "../interfaces/ChatHistory";
import { feedbackService } from "../services/feedbackService";

interface ProfileInfoProps {
    postsRef: any;
}

interface HighlightBar {
    name: string;
    stories: Story[];
}

const ProfileInfo: FunctionComponent<ProfileInfoProps> = ({ postsRef }) => {
    const user = useSelector((state: any) => state.userState.user);
    const loggedUser = authService.getLoggedInUser();
    const [isMessageModal, setIsMessageModal] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [selectedUser, setSelectedUser] = useState<User>();
    const [userHighlights, setUserHighlights] = useState<HighlightBar[]>([]);
    const [isChanged, setIsChanged] = useState<boolean>(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const handlePostsClick = () => {
        if (postsRef.current) {
            postsRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleSend = async () => {
        if (message) {
            const chats = await chatService.getUserChats(loggedUser?._id as string);

            if (!chats.length) {
                const newChat = await chatService.openChat((loggedUser as User)._id, (selectedUser as User)._id);
                (selectedUser as User).chats.push(newChat._id);
                (loggedUser as User).chats.push(newChat._id);
                await chatService.addMessage({ txt: message }, (loggedUser as User)._id, newChat._id);
                await userService.updateUser(selectedUser as User);
                await userService.updateUser(loggedUser as User);
            } else {
                chats.forEach(async (chat: ChatHistory) => {
                    if ((selectedUser as User)?.chats?.includes(chat._id)) {
                        await chatService.addMessage({ txt: message }, (loggedUser as User)._id, chat?._id);
                    } else {
                        const newChat = await chatService.openChat(
                            (loggedUser as User)._id,
                            (selectedUser as User)._id
                        );
                        (selectedUser as User).chats.push(newChat._id);
                        (loggedUser as User).chats.push(newChat._id);
                        await chatService.addMessage({ txt: message }, (loggedUser as User)._id, newChat._id);
                        await userService.updateUser(selectedUser as User);
                        await userService.updateUser(loggedUser as User);
                    }
                });
            }
            setIsMessageModal(false);
        }
    };

    useEffect(() => {
        (async () => {
            if (id) setSelectedUser(await userService.getUserById(id as string));
            else setSelectedUser(loggedUser as User);
            const userHighlights: HighlightBar[] = [];
            const userHighlightsNames: string[] = [];
            let userHighlightsStories: any = [];
            if (selectedUser?.highlights?.length) {
                userHighlightsStories = await Promise.all(
                    (selectedUser as User)?.highlights?.map(async (highlight: Highlight) => {
                        userHighlightsNames.push(highlight.name);

                        highlight.stories?.map((storyId: string) => {
                            return storyService.getStoryById(storyId);
                        });
                    })
                );
            }
            userHighlightsNames.map((name: string, index: number) => {
                userHighlights.push({ name: name, stories: userHighlightsStories[index] as Story[] });
            });
            setUserHighlights(userHighlights);
        })();
    }, [isChanged, user]);

    if ((selectedUser as User)?._id) {
        return (
            <>
                <div className="mt-2">
                    <div className="flex px-4 items-center">
                        <div className="profile-div-image">
                            <div className="profile-add-icon"></div>
                            <img
                                className="rounded-image-md"
                                src={selectedUser?.imgUrl || profilePic}
                                alt="Profile image"
                            />
                        </div>
                        <div className="ms-7 flex-1 text-center my-button" onClick={() => handlePostsClick()}>
                            <p className="font-bold  m-0">{selectedUser?.posts?.length}</p>
                            <p className="text-sm font-normal m-0">posts</p>
                        </div>
                        <div
                            className="ms-7 flex-1 text-center my-button"
                            onClick={(e) => {
                                const options = {
                                    dispatch,
                                };
                                handleClickService.handleClick(e, ClickTypes.followers, "followers", options);
                            }}>
                            <p className="font-bold  m-0 px-0">{selectedUser?.followers?.length}</p>
                            <p className="text-sm font-normal m-0 px-0">followers</p>
                        </div>
                        <div
                            className="ms-7 flex-1 text-center my-button"
                            onClick={(e) => {
                                const options = {
                                    dispatch,
                                };
                                handleClickService.handleClick(e, ClickTypes.following, "following", options);
                            }}>
                            <p className="font-bold  m-0">{selectedUser?.following?.length}</p>
                            <p className="text-sm font-normal m-0">following</p>
                        </div>
                    </div>
                </div>

                <div className="ps-3">
                    <p className="font-semibold m-0">{selectedUser?.fullname}</p>
                    <p>{selectedUser?.description}</p>
                </div>

                {selectedUser?._id === loggedUser?._id ? (
                    <div className="flex justify-evenly px-3">
                        <div
                            className="profile-following-button my-button"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate("/profile/edit-profile");
                            }}>
                            Edit profile
                        </div>
                        <div className="profile-following-button ms-2 my-button">Share profile</div>
                    </div>
                ) : (
                    <div className="flex justify-evenly px-3">
                        <div
                            onClick={async (e) => {
                                e.preventDefault();
                                if (
                                    !loggedUser?.following?.includes(selectedUser?._id as string) ||
                                    !selectedUser?.followers?.includes(loggedUser?._id as string)
                                ) {
                                    setIsChanged(!isChanged);
                                    let updatedUser = {
                                        ...(loggedUser as User),
                                        following: [...(loggedUser as User).following, selectedUser?._id as string],
                                    };
                                    await userService.updateUser(updatedUser);
                                    updatedUser = {
                                        ...(selectedUser as User),
                                        followers: [...(selectedUser as User).followers, loggedUser?._id as string],
                                        notifications: [
                                            ...(selectedUser as User).notifications,
                                            loggedUser?._id as string,
                                        ],
                                    };
                                    dispatch({ type: UserActionType.SetUser, payload: updatedUser });
                                    await userService.updateUser(updatedUser);
                                } else {
                                    setIsChanged(!isChanged);
                                    let updatedUser = {
                                        ...(loggedUser as User),
                                        following: (loggedUser as User).following.filter(
                                            (id: string) => id !== selectedUser?._id
                                        ),
                                    };
                                    await userService.updateUser(updatedUser);
                                    updatedUser = {
                                        ...(selectedUser as User),
                                        followers: (selectedUser as User).followers.filter(
                                            (id: string) => id !== loggedUser?._id
                                        ),
                                    };
                                    dispatch({ type: UserActionType.SetUser, payload: updatedUser });
                                    await userService.updateUser(updatedUser);
                                }
                            }}
                            className={`my-button ${
                                loggedUser?.following?.includes(selectedUser?._id as string)
                                    ? "profile-following-button"
                                    : "profile-follow-button"
                            }`}>
                            {loggedUser?.following?.includes(selectedUser?._id as string) ? "Following" : "Follow"}
                        </div>
                        <div
                            className="profile-following-button ms-2 my-button"
                            onClick={() => {
                                setIsMessageModal(true);
                            }}>
                            Message
                        </div>
                    </div>
                )}

                <div
                    className={`messageModal flex justify-center items-center ${isMessageModal ? "block" : "hidden"}`}
                    onClick={() => setIsMessageModal(false)}>
                    <div className="h-44 w-80 rounded bg-white p-3 flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <p className="m-0 font-semibold">
                            Send message to <span className="font-bold text-lg">{selectedUser?.username}</span>
                        </p>
                        <textarea
                            placeholder="Message"
                            className="placeholder-gray-400 outline outline-2 outline-gray-200 ps-1 rounded mt-3"
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button
                            className="mt-2 border w-1/2 self-center rounded bg-[#1DA1F2] text-white font-semibold"
                            onClick={async () => await feedbackService.promiseToast(handleSend, "Message sent")}>
                            Send
                        </button>
                    </div>
                </div>

                {selectedUser?.highlights?.length && selectedUser?.highlights[0] ? (
                    <>
                        <StoriesBar followingStories={userHighlights} />
                    </>
                ) : (
                    <></>
                )}
            </>
        );
    }
};

export default ProfileInfo;
