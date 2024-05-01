import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FunctionComponent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postService } from "../services/postService";
import { feedbackService } from "../services/feedbackService";
import { PostActionType } from "../redux/PostState";
import { authService } from "../services/authService";
import User from "../interfaces/User";
import { userService } from "../services/userService";
import { ModalActionType } from "../redux/ModalState";
import { useNavigate } from "react-router-dom";

interface MyPostOptionsProps {}

const MyPostOptions: FunctionComponent<MyPostOptionsProps> = () => {
    const loggedUser = authService.getLoggedInUser();
    const post = useSelector((state: any) => state.postState.post);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDelete = async () => {
        (loggedUser as User).posts.splice((loggedUser as User).posts.indexOf(post._id), 1);
        await postService.deletePost(post._id);
        await userService.updateUser(loggedUser as User);
        dispatch({ type: PostActionType.SetHeaderType, payload: "profile" });
        dispatch({ type: ModalActionType.SetBottomModal, payload: false });
        navigate("/profile");
    };

    const handleEdit = async () => {};

    useEffect(() => {
        return () => {
            dispatch({ type: PostActionType.SetHeaderType, payload: "posts" });
        };
    }, []);

    return (
        <>
            <div className="modal-line"></div>
            <div className="w-full flex justify-around mt-5">
                <div className="flex flex-col">
                    <div
                        className="flex rounded-full h-16 w-16 outline outline-1 p-3 justify-center items-center"
                        onClick={async () => {
                            await feedbackService.promiseToast(handleDelete, "Post deleted successfully");
                        }}>
                        <FontAwesomeIcon icon={faTrash} />
                    </div>
                    <p className="m-0 text-center font-semibold">Delete</p>
                </div>
                <div className="flex flex-col">
                    <div
                        className="flex rounded-full h-16 w-16 outline outline-1 p-3 justify-center items-center"
                        onClick={async () => {
                            await feedbackService.promiseToast(handleEdit, "Post edited successfully");
                        }}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </div>
                    <p className="m-0 text-center font-semibold">Edit</p>
                </div>
            </div>
        </>
    );
};

export default MyPostOptions;
