import { FunctionComponent, useEffect, useState } from "react";
import User from "../interfaces/User";
import { userService } from "../services/userService";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserActionType } from "../redux/UserState";
import { ModalActionType } from "../redux/ModalState";
import { PostActionType } from "../redux/PostState";
import { authService } from "../services/authService";
import profilePic from "../assets/images/profile-picture.jpeg";

interface FollowersProps {}

const Followers: FunctionComponent<FollowersProps> = () => {
    const loggedUser = authService.getLoggedInUser();
    const selectedUser = useSelector((state: any) => state.userState.user);
    const [followers, setFollowers] = useState<User[]>([]);
    const [isChanged, setIsChanged] = useState<boolean>(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedUser && selectedUser.followers.length) {
            (async () => {
                const followers: any = await Promise.all(
                    (selectedUser as User)?.followers?.map(async (userId: string) => {
                        return await userService.getUserById(userId);
                    })
                );
                setFollowers(followers);
            })();
        }
    }, [isChanged]);

    return (
        <>
            {followers.length && followers[0] ? (
                <div>
                    {followers.map((user: User) => {
                        return (
                            <div key={user._id} className="flex w-full items-center mt-3 justify-between px-3">
                                <div
                                    className="flex items-center w-full justify-between"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        dispatch({ type: UserActionType.SetUser, payload: user });
                                        dispatch({ type: ModalActionType.SetSideModal, payload: false });
                                        dispatch({ type: PostActionType.SetHeaderType, payload: "profile" });
                                        navigate(`/profile/${user._id}`);
                                    }}>
                                    <div className="flex items-center">
                                        <img
                                            src={user.imgUrl || profilePic}
                                            alt="User image"
                                            className="rounded-image-md"
                                        />
                                        <div className="ms-3 flex flex-col items-start">
                                            <p className="text-bold font-semibold text-overflow m-0 ">
                                                {user.username}
                                            </p>
                                            <p className="text-[#737373] text-overflow m-0">{user.fullname}</p>
                                        </div>
                                    </div>

                                    <div className="flex">
                                        {user._id !== loggedUser?._id ? (
                                            <div>
                                                {loggedUser?.followers?.includes(user._id) ? (
                                                    <button
                                                        className="btn-follow"
                                                        onClick={async (e) => {
                                                            e.preventDefault();
                                                            if (user.following?.includes((loggedUser as User)._id)) {
                                                                (user as User).following?.splice(
                                                                    (user as User).following?.findIndex(
                                                                        (userId: string) =>
                                                                            userId === (loggedUser as User)._id
                                                                    ),
                                                                    1
                                                                );
                                                            }
                                                            loggedUser?.followers?.splice(
                                                                loggedUser?.followers?.findIndex(
                                                                    (userId: string) => userId === (user as User)._id
                                                                ),
                                                                1
                                                            );
                                                            setIsChanged(!isChanged);
                                                            dispatch({
                                                                type: UserActionType.SetUser,
                                                                payload: loggedUser,
                                                            });
                                                            await userService.updateUser(user as User);
                                                            await userService.updateUser(loggedUser as User);
                                                        }}>
                                                        Remove
                                                    </button>
                                                ) : (
                                                    <button className="btn-follow" disabled>
                                                        Removed
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <div>
                                                {user._id !== loggedUser._id && (
                                                    <button
                                                        onClick={async (e) => {
                                                            e.preventDefault();

                                                            if ((loggedUser as User).followers?.includes(user._id)) {
                                                                {
                                                                    user.following?.includes(
                                                                        (loggedUser as User)._id
                                                                    ) &&
                                                                        user.following?.splice(
                                                                            user.following?.findIndex(
                                                                                (userId: string) =>
                                                                                    userId === loggedUser?._id
                                                                            ),
                                                                            1
                                                                        );
                                                                }
                                                                loggedUser?.followers?.splice(
                                                                    loggedUser?.followers?.findIndex(
                                                                        (userId: string) =>
                                                                            userId === (user as User)._id
                                                                    ),
                                                                    1
                                                                );
                                                            } else {
                                                                loggedUser?.followers?.push((user as User)._id);
                                                                user.notifications?.push(loggedUser?._id);
                                                                user.followers?.push((loggedUser as User)._id);
                                                            }
                                                            await userService.updateUser(user);
                                                            await userService.updateUser(loggedUser as User);
                                                        }}
                                                        className={`${
                                                            loggedUser?.following?.includes(user._id)
                                                                ? "btn-follow"
                                                                : "btn-following"
                                                        }`}>
                                                        {loggedUser?.following?.includes(user._id)
                                                            ? "Following"
                                                            : "Follow"}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="font-semibold text-lg ms-3 mt-2">You have no followers yet</p>
            )}
        </>
    );
};

export default Followers;
