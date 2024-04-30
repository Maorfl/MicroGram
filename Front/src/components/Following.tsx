import { FunctionComponent, useEffect, useState } from "react";
import User from "../interfaces/User";
import { userService } from "../services/userService";
import { useDispatch, useSelector } from "react-redux";
import { UserActionType } from "../redux/UserState";
import { useNavigate } from "react-router-dom";
import { ModalActionType } from "../redux/ModalState";
import { PostActionType } from "../redux/PostState";
import { authService } from "../services/authService";
import profilePic from "../assets/images/profile-picture.jpeg";

interface FollowingProps {}

const Following: FunctionComponent<FollowingProps> = () => {
    const loggedUser = authService.getLoggedInUser();
    const selectedUser = useSelector((state: any) => state.userState.user);
    const [following, setFollowing] = useState<User[]>([]);
    const [isChanged, setIsChanged] = useState<boolean>(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedUser && selectedUser.following?.length) {
            (async () => {
                const following: any = await Promise.all(
                    (selectedUser as User)?.following?.map(async (userId: string) => {
                        return await userService.getUserById(userId);
                    })
                );
                setFollowing(following);
            })();
        }
    }, [isChanged]);

    return (
        <>
            {following.length && following[0] ? (
                <>
                    {following.map((user: User) => {
                        return (
                            <div key={user._id} className="flex w-full mt-3 items-center  justify-between px-3">
                                <div
                                    className="flex items-center"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        dispatch({ type: UserActionType.SetUser, payload: user });
                                        dispatch({ type: ModalActionType.SetSideModal, payload: false });
                                        dispatch({ type: PostActionType.SetHeaderType, payload: "profile" });
                                        navigate(`/profile/${user._id}`);
                                    }}>
                                    <div>
                                        <img
                                            src={user.imgUrl || profilePic}
                                            alt="User image"
                                            className="rounded-image-md"
                                        />
                                    </div>
                                    <div className="ms-3 flex flex-col items-start">
                                        <p className="text-bold font-semibold text-overflow m-0 ">{user.username}</p>
                                        <p className="text-[#737373] text-overflow m-0">{user.fullname}</p>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        onClick={async (e) => {
                                            e.preventDefault();

                                            if ((loggedUser as User).following?.includes(user._id)) {
                                                loggedUser?.following?.splice(
                                                    loggedUser?.following?.findIndex(
                                                        (userId: string) => userId === user._id
                                                    ),
                                                    1
                                                );
                                                if (user.followers?.includes((loggedUser as User)._id)) {
                                                    user.followers?.splice(
                                                        user.followers?.findIndex(
                                                            (userId: string) => userId === (loggedUser as User)._id
                                                        ),
                                                        1
                                                    );
                                                }
                                            } else {
                                                loggedUser?.following?.push(user._id);
                                                user.notifications?.push((loggedUser as User)._id);
                                                user.followers?.push((loggedUser as User)._id);
                                            }
                                            setIsChanged(!isChanged);
                                            dispatch({ type: UserActionType.SetUser, payload: loggedUser });
                                            await userService.updateUser(user);
                                            await userService.updateUser(loggedUser as User);
                                        }}
                                        className={`${
                                            loggedUser?.following?.includes(user._id) ? "btn-follow" : "btn-following"
                                        }`}>
                                        {loggedUser?.following?.includes(user._id) ? "Following" : "Follow"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </>
            ) : (
                <p className="ms-3 mt-2 font-semibold text-xl">You are not following anyone</p>
            )}
        </>
    );
};

export default Following;
