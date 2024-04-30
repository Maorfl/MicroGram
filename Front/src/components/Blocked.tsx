import { FunctionComponent, useEffect, useState } from "react";
import { authService } from "../services/authService";
import User from "../interfaces/User";
import { userService } from "../services/userService";
import profilePic from "../assets/images/profile-picture.jpeg";

interface BlockedProps {}

const Blocked: FunctionComponent<BlockedProps> = () => {
    const loggedUser = authService.getLoggedInUser();
    const [blockedUsers, setBlockedUsers] = useState<User[]>([]);
    const [isChanged, setIsChanged] = useState<boolean>(false);

    const handleClick = async (e: any, user: User) => {
        e.preventDefault();

        if (loggedUser?.blocked?.includes(user._id)) loggedUser.blocked.splice(loggedUser.blocked.indexOf(user._id), 1);
        else loggedUser?.blocked.push(user._id);

        setIsChanged(!isChanged);
        await userService.updateUser(loggedUser as User);
    };

    useEffect(() => {
        (async () => {
            const blockedUsers: any = await Promise.all(
                (loggedUser as User)?.blocked?.map(async (userId: string) => {
                    return await userService.getUserById(userId);
                })
            );
            setBlockedUsers(blockedUsers);
        })();
    }, [isChanged]);

    return (
        <>
            {blockedUsers.length && blockedUsers[0] ? (
                blockedUsers.map((user: User) => {
                    return (
                        <div key={user._id} className="flex items-center w-full mt-3 justify-between px-3">
                            <div className="flex items-center w-full">
                                <div className="place-self-start">
                                    <img
                                        src={user.imgUrl || profilePic}
                                        alt="User image"
                                        className="rounded-image-lg"
                                    />
                                </div>
                                <div className="flex flex-col items-start ms-3">
                                    <p className="flex-1 text-overflow text-lg m-0 font-bold">{user.username}</p>
                                    <p className="flex-1 text-overflow m-0 text-[#737373]">{user.fullname}</p>
                                </div>
                            </div>
                            <div>
                                <button
                                    onClick={(e) => handleClick(e, user)}
                                    className={`${
                                        loggedUser?.blocked.includes(user._id) ? "btn-following" : "btn-follow"
                                    }`}>
                                    {loggedUser?.blocked.includes(user._id) ? "Unblock" : "Block"}
                                </button>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p className="ms-3 mt-2 font-semibold text-xl">You have no blocked users</p>
            )}
        </>
    );
};

export default Blocked;
