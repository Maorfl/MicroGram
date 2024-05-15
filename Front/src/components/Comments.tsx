import { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Comment from "../interfaces/Comment";
import { useNavigate } from "react-router-dom";
import { ClickTypes } from "../enums/clickTypes";
import { ModalActionType } from "../redux/ModalState";
import { handleClickService } from "../services/handleClickService";
import { userService } from "../services/userService";
import { utilService } from "../services/utilService";
import { faArrowUp, faHeart, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authService } from "../services/authService";
import profilePic from "../assets/images/profile-picture.jpeg";
import { feedbackService } from "../services/feedbackService";
import { commentService } from "../services/commentService";
import { PostActionType } from "../redux/PostState";

interface CommentsProps {}

const Comments: FunctionComponent<CommentsProps> = () => {
    const loggedUser = authService.getLoggedInUser();
    const post = useSelector((state: any) => state.postState.post);
    const [isChanged, setIsChanged] = useState<boolean>(false);
    const [text, setText] = useState<string>("");
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

    const handleSubmit = async () => {
        const comment: Comment = {
            commentId: utilService.makeId(6),
            by: {
                id: loggedUser?._id as string,
                username: loggedUser?.username as string,
                imgUrl: loggedUser?.imgUrl as string,
                fullname: loggedUser?.fullname as string,
            },
            txt: text,
            likedBy: [],
            createdAt: Date.now(),
            comments: [],
        };
        setText("");
        const updatedPost = await commentService.addComment(comment, post._id);
        dispatch({ type: PostActionType.SetPost, payload: { ...updatedPost } });
        setIsChanged(!isChanged);
    };

    const handleDelete = async (commentId: string) => {
        const updatedPost = await commentService.deleteComment(post._id, commentId);
        dispatch({ type: PostActionType.SetPost, payload: { ...updatedPost } });
        setIsChanged(!isChanged);
    };

    useEffect(() => {}, [isChanged]);

    return (
        <>
            <header className="w-full border-b">
                <div className="modal-line"></div>
                <div className="mt-3 flex justify-center">
                    <p className="font-bold">Comments</p>
                </div>
            </header>

            {post?.comments && post?.comments[0] ? (
                <div className="w-full">
                    {post?.comments?.map((comment: Comment) => {
                        return (
                            <div key={comment.commentId} className="flex items-center justify-between w-full px-3 mt-2">
                                <div className="flex">
                                    <div
                                        onClick={(e) => {
                                            handleUserClick(e);
                                        }}>
                                        <img
                                            src={comment.by.imgUrl || profilePic}
                                            alt="User image"
                                            className="rounded-image-sm me-3"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <div className="flex">
                                            <p className="m-0 font-bold text-sm ">{comment.by.username}</p>
                                            <p className="ps-2 m-0 text-[#8e8e8e] leading-none">
                                                {utilService.timePassed(comment.createdAt)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="m-0 font-normal text-black">{comment.txt}</p>
                                        </div>
                                        <div
                                            className="text-[#8e8e8e]"
                                            onClick={() => {
                                                setText(`@${comment.by.username} `);
                                            }}>
                                            <small className="font-semibold">Reply</small>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex">
                                    <span
                                        onClick={async (e) => {
                                            const data = {
                                                post,
                                                comment,
                                                user: loggedUser,
                                            };
                                            const options = {
                                                dispatch,
                                            };
                                            await handleClickService.handleClick(
                                                e,
                                                ClickTypes.likeComment,
                                                data,
                                                options
                                            );
                                            setIsChanged(!isChanged);
                                        }}>
                                        {comment.likedBy.filter((userId: string) => userId == loggedUser?._id)
                                            .length ? (
                                            <FontAwesomeIcon className="text-lg text-red-600" icon={faHeart} />
                                        ) : (
                                            <FontAwesomeIcon className="text-lg" icon={faHeart} />
                                        )}
                                    </span>

                                    <span
                                        className={`${loggedUser?._id === comment.by.id ? "block ms-4" : "hidden"}`}
                                        onClick={async () =>
                                            await feedbackService.promiseToast(
                                                handleDelete,
                                                "Comment deleted",
                                                comment.commentId
                                            )
                                        }>
                                        <FontAwesomeIcon className="text-lg" icon={faTrash} />
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <></>
            )}
            <div className="flex w-full items-center justify-between fixed bottom-0 h-12 border-t">
                <img src={profilePic} alt="User image" className="rounded-image-md mx-2" />
                <input
                    type="text"
                    className={`w-full placeholder-gray-400 outline-none`}
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                    placeholder={`Add a comment for ${post.by?.username}...`}
                />
                <button
                    type="submit"
                    className="flex items-center justify-center rounded-full bg-[#0095f6] text-white font-semibold mx-2 px-4 py-1 disabled:bg-[rgb(0,210,246)]"
                    onClick={async () => {
                        await feedbackService.promiseToast(handleSubmit, "Comment posted");
                    }}
                    disabled={!text}>
                    <FontAwesomeIcon icon={faArrowUp} className="text-2xl" />
                </button>
            </div>
        </>
    );
};

export default Comments;
