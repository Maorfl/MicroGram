import { FunctionComponent, useEffect, useState } from "react";
import Post from "../interfaces/Post";
import LikedBy from "./LikedBy";
import { utilService } from "../services/utilService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faComment, faHeart, faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { handleClickService } from "../services/handleClickService";
import { ClickTypes } from "../enums/clickTypes";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ModalActionType } from "../redux/ModalState";
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import profilePic from "../assets/images/profile-picture.jpeg";

interface PostDetailProps {
    post: Post;
}

const PostDetail: FunctionComponent<PostDetailProps> = ({ post }) => {
    const loggedUser = authService.getLoggedInUser();
    const [isChanged, setIsChanged] = useState<boolean>(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const data = {
        post,
        user: loggedUser,
    };

    const handleUserClick = async (e: any) => {
        const selectedUser = await userService.getUserById(post.by.id);
        const options = {
            dispatch,
            navigate,
        };
        dispatch({ type: ModalActionType.SetPostsModal, payload: false });
        handleClickService.handleClick(e, ClickTypes.profile, selectedUser, options);
    };

    useEffect(() => {}, [isChanged]);

    return (
        <div className="mb-4 posts-feed">
            <div className="flex px-3">
                <div className="flex-initial">
                    <img
                        className="rounded-image-xs"
                        src={post.by.imgUrl || profilePic}
                        alt="User Image"
                        onClick={async (e) => {
                            handleUserClick(e);
                        }}
                    />
                </div>
                <div className="flex-1 ms-3 text-base font-semibold">
                    <span
                        onClick={async (e) => {
                            handleUserClick(e);
                        }}>
                        {post.by.username}
                    </span>
                </div>
                <span
                    className={`text-xl ${
                        (location.pathname.includes("profile") && location.pathname.substring(1) !== "profile") ||
                        location.pathname.includes("chats") ||
                        location.pathname.includes("search")
                            ? "hidden"
                            : ""
                    }`}>
                    <button
                        onClick={(e) => {
                            const options = {
                                dispatch,
                            };
                            if (location.pathname.substring(1) === "profile")
                                handleClickService.handleClick(e, ClickTypes.moreProfile, post, options);
                            else handleClickService.handleClick(e, ClickTypes.more, post, options);
                        }}>
                        <FontAwesomeIcon icon={faEllipsisVertical} />
                    </button>
                </span>
            </div>

            <div className="image-container">
                <img src={post.imgUrl} alt="Post Image" className="mt-1 object-cover" />
            </div>

            <div className="flex justify-between px-3 mt-2 mb-1">
                <div className="flex justify-around w-1/3">
                    <span
                        onClick={(e) => {
                            handleClickService.handleClick(e, ClickTypes.like, data);
                            setIsChanged(!isChanged);
                        }}>
                        {post?.likedBy?.filter((userId: string) => userId == loggedUser?._id).length ? (
                            <FontAwesomeIcon className="text-2xl text-red-600" icon={faHeart} />
                        ) : (
                            <FontAwesomeIcon className="text-2xl" icon={faHeart} />
                        )}
                    </span>
                    <span
                        className="ms-3"
                        onClick={(e) => {
                            const options = {
                                dispatch,
                            };
                            handleClickService.handleClick(e, ClickTypes.comments, post, options);
                        }}>
                        <FontAwesomeIcon className="text-2xl" icon={faComment} />
                    </span>
                    <span
                        className="ms-3"
                        onClick={(e) => {
                            const options = {
                                dispatch,
                            };
                            handleClickService.handleClick(e, ClickTypes.send, post, options);
                        }}>
                        <FontAwesomeIcon className="text-2xl" icon={faPaperPlane} />
                    </span>
                </div>
                <span
                    className="text-end"
                    onClick={(e) => {
                        handleClickService.handleClick(e, ClickTypes.save, data);
                        setIsChanged(!isChanged);
                    }}>
                    {loggedUser?.savedPosts?.filter((postId: string) => postId == post._id).length ? (
                        <FontAwesomeIcon className="text-2xl text-blue-600" icon={faBookmark} />
                    ) : (
                        <FontAwesomeIcon className="text-2xl" icon={faBookmark} />
                    )}
                </span>
            </div>

            <div className="px-3">
                <LikedBy usersId={post.likedBy} isChanged={isChanged} />
                <p className="m-0">
                    <span
                        className="font-semibold"
                        onClick={async (e) => {
                            handleUserClick(e);
                        }}>
                        {post.by.username}
                    </span>
                    {` ${post.txt}`}
                </p>

                {post.comments.length > 1 ? (
                    <span
                        className="text-[#737373]"
                        onClick={(e) => {
                            const options = {
                                dispatch,
                            };
                            handleClickService.handleClick(e, ClickTypes.comments, post, options);
                        }}>
                        View all {post.comments.length} comments
                    </span>
                ) : (
                    post.comments.length == 1 && (
                        <p>
                            <span className="font-semibold">{post.comments[0].by.username}</span> {post.comments[0].txt}
                        </p>
                    )
                )}

                <p className="text-[#737373]">
                    <small>{` ${utilService.getTimeSinceCreation(post.createdAt)}`}</small>
                </p>
            </div>
        </div>
    );
};

export default PostDetail;
