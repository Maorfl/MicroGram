import { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Comment from "../interfaces/Comment";
import { useNavigate } from "react-router-dom";
import { ClickTypes } from "../enums/clickTypes";
import { ModalActionType } from "../redux/ModalState";
import { handleClickService } from "../services/handleClickService";
import { userService } from "../services/userService";
import { utilService } from "../services/utilService";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authService } from "../services/authService";
import profilePic from "../assets/images/profile-picture.jpeg";

interface CommentsProps {}

const Comments: FunctionComponent<CommentsProps> = () => {
    const loggedUser = authService.getLoggedInUser();
    const post = useSelector((state: any) => state.postState.post);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleUserClick = async (e: any) => {
        const selectedUser = await userService.getUserById(post.by.id);
        const options = {
            dispatch,
            navigate,
        };
        dispatch({ type: ModalActionType.SetPostsModal, payload: false });
        handleClickService.handleClick(e, ClickTypes.profile, selectedUser, options);
    };

    useEffect(() => {}, [isLiked]);

    return (
        <>
            <header className="w-full border-b">
                <div className="modal-line"></div>
                <div className="mt-3 flex justify-center">
                    <p className="font-bold">Comments</p>
                </div>
            </header>

            {post?.comments && post?.comments[0] ? (
                <div>
                    {post?.comments?.map((comment: Comment) => {
                        return (
                            <div key={comment.commentId} className="flex px-3">
                                <div
                                    onClick={(e) => {
                                        handleUserClick(e);
                                    }}>
                                    <img
                                        src={comment.by.imgUrl || profilePic}
                                        alt="User image"
                                        className="rounded-image-sm"
                                    />
                                </div>

                                <div className="flex flex-col flex-1">
                                    <div className="flex">
                                        <p className="m-0 text-bold text-sm">{comment.by.username}</p>
                                        <p className="ps-2 m-0 text-[#8e8e8e]">
                                            {utilService.getDay(comment.createdAt)}
                                        </p>
                                    </div>
                                    <div>{comment.txt}</div>
                                    <div className="text-[#8e8e8e]" onClick={() => {}}>
                                        Reply
                                    </div>
                                </div>

                                <div>
                                    <span
                                        onClick={async (e) => {
                                            const data = {
                                                post,
                                                comment,
                                                user: loggedUser,
                                            };
                                            await handleClickService.handleClick(e, ClickTypes.likeComment, data);
                                            setIsLiked(!isLiked);
                                        }}>
                                        {comment.likedBy.filter((userId: string) => userId == loggedUser?._id)
                                            .length ? (
                                            <FontAwesomeIcon className="text-2xl text-red-600" icon={faHeart} />
                                        ) : (
                                            <FontAwesomeIcon className="text-2xl" icon={faHeart} />
                                        )}
                                    </span>
                                </div>

                                {comment.comments.length && comment.comments[0] ? (
                                    <div className="flex-none"></div>
                                ) : (
                                    <></>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <></>
            )}
        </>
    );
};

export default Comments;
