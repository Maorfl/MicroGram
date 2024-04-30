import { FunctionComponent, useEffect, useState } from "react";
import User from "../interfaces/User";
import { useDispatch } from "react-redux";
import { UserActionType } from "../redux/UserState";
import { useNavigate } from "react-router-dom";
import { PostActionType } from "../redux/PostState";
import profilePic from "../assets/images/profile-picture.jpeg";
import { authService } from "../services/authService";

interface SearchedUsersProps {
    users: User[];
    search: string;
}

const SearchedUsers: FunctionComponent<SearchedUsersProps> = ({ users, search }) => {
    const loggedUser = authService.getLoggedInUser();
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        setFilteredUsers(
            users?.filter(
                (user: User) =>
                    user.username.toLowerCase().includes(search.toLowerCase()) && user._id !== loggedUser?._id
            )
        );
    }, [search]);

    return (
        <>
            {filteredUsers.length ? (
                <>
                    {filteredUsers.map((user: User) => {
                        return (
                            <div
                                key={user._id}
                                className="flex px-3 items-center mt-2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    dispatch({ type: UserActionType.SetUser, payload: user });
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
                                <div className="flex flex-col items-start">
                                    <p className="ms-3 text-bold m-0">{user.username}</p>
                                    <p className="ms-3 text-overflow text-[#737373] m-0">{user.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </>
            ) : (
                <div className="text-center w-full text-2xl font-semibold">No users found</div>
            )}
        </>
    );
};

export default SearchedUsers;
