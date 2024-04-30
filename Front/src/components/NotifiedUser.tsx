import { FunctionComponent } from "react";
import User from "../interfaces/User";
import { authService } from "../services/authService";
import { useDispatch } from "react-redux";
import { handleClickService } from "../services/handleClickService";
import { ClickTypes } from "../enums/clickTypes";
import { useNavigate } from "react-router-dom";
import profilePic from "../assets/images/profile-picture.jpeg";

interface NotifiedUserProps {
    user: User;
}

const NotifiedUser: FunctionComponent<NotifiedUserProps> = ({ user }) => {
    const loggedUser = authService.getLoggedInUser();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <>
            <div
                className="w-full flex justify-between items-center px-3"
                onClick={(e) => {
                    const options = {
                        dispatch,
                        navigate,
                    };
                    handleClickService.handleClick(e, ClickTypes.profile, user, options);
                }}>
                <div className="flex items-center">
                    <img src={user.imgUrl || profilePic} alt="User image" className="rounded-image-lg" />
                    <div className="flex flex-col items-start ms-3">
                        <span className="font-bold text-overflow">{user.username}</span>
                        started following you.
                    </div>
                </div>
                <div>
                    <button
                        className={`ms-3 ${
                            user.following.includes(loggedUser?._id as string) ? "btn-following" : "btn-follow"
                        }`}>
                        {user.following.includes(loggedUser?._id as string) ? "Following" : "Follow"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default NotifiedUser;
