import { FunctionComponent, useEffect, useState } from "react";
import ChatHistory from "../interfaces/ChatHistory";
import { handleClickService } from "../services/handleClickService";
import { ClickTypes } from "../enums/clickTypes";
import { useDispatch } from "react-redux";
import { authService } from "../services/authService";
import User from "../interfaces/User";
import { userService } from "../services/userService";
import { utilService } from "../services/utilService";
import { useNavigate } from "react-router-dom";
import profilePic from "../assets/images/profile-picture.jpeg";

interface ChatProps {
    chat: ChatHistory;
}

const Chat: FunctionComponent<ChatProps> = ({ chat }) => {
    const loggedUser: User | null = authService.getLoggedInUser();
    const [participators, setParticipators] = useState<User[]>([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            const users: any = await Promise.all(
                chat.participators.map(async (userId: string) => {
                    return await userService.getUserById(userId);
                })
            );
            setParticipators(users);
        })();
    }, []);

    return (
        <>
            {participators.length ? (
                <div
                    className="flex mt-3 justify-between"
                    onClick={(e) => {
                        const options = {
                            dispatch,
                            navigate,
                        };
                        const data = {
                            user: participators[0]._id == loggedUser?._id ? participators[1] : participators[0],
                            chat: chat,
                        };
                        handleClickService.handleClick(e, ClickTypes.chat, data, options);
                    }}>
                    <div className="me-3 flex items-center justify-between">
                        <img
                            src={
                                participators[0]._id == loggedUser?._id
                                    ? participators[1]?.imgUrl || profilePic
                                    : participators[0]?.imgUrl || profilePic
                            }
                            alt="User image"
                            className="rounded-image-lg"
                        />
                        <div className="flex flex-col ms-2">
                            <p className="m-0">
                                {participators[0]._id == loggedUser?._id
                                    ? participators[1].username
                                    : participators[0].username}
                            </p>
                            <div className="text-[#737373]">
                                <p className="m-0 text-overflow me-3 flex-1">
                                    Sent {chat.msgs[chat.msgs.length - 1]?.content.txt}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <p className="m-0 text-[#737373]">
                            {utilService.timePassed(chat.msgs[chat.msgs.length - 1].createdAt)}
                        </p>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
};

export default Chat;
