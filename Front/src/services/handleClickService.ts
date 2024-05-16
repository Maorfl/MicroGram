import ClickOptions from "../interfaces/ClickOptions";
import { ChatActionType } from "../redux/ChatState";
import { ModalActionType } from "../redux/ModalState";
import { PostActionType } from "../redux/PostState";
import { UserActionType } from "../redux/UserState";
import { authService } from "./authService";
import { postService } from "./postService";
import { userService } from "./userService";

export const handleClickService = {
    handleClick,
};

function handleClick(event: any, handleType: string, data: any, options: ClickOptions = {}) {
    event.preventDefault();
    switch (handleType) {
        case "profile":
            options.dispatch && options.dispatch({ type: UserActionType.SetUser, payload: data });
            options.dispatch && options.dispatch({ type: PostActionType.SetHeaderType, payload: handleType });
            options.dispatch && options.dispatch({ type: ModalActionType.SetSideModal, payload: false });
            options.navigate && options.navigate(`/profile/${authService.getLoggedInUser()?._id === data._id ? "" : data._id}`);
            break;
        case "more":
            options.dispatch && options.dispatch({ type: ModalActionType.SetBottomModal, payload: true });
            options.dispatch && options.dispatch({ type: PostActionType.SetPost, payload: data });
            options.dispatch && options.dispatch({ type: PostActionType.SetHeaderType, payload: "more" });
            break;
        case "moreProfile":
            options.dispatch && options.dispatch({ type: ModalActionType.SetBottomModal, payload: true });
            options.dispatch && options.dispatch({ type: PostActionType.SetPost, payload: data });
            options.dispatch && options.dispatch({ type: PostActionType.SetHeaderType, payload: "moreProfile" });
        break;
        case "comments":
            options.dispatch && options.dispatch({ type: PostActionType.SetPost, payload: { ...data } });
            options.dispatch && options.dispatch({ type: ModalActionType.SetBottomModal, payload: true });
            options.dispatch && options.dispatch({ type: PostActionType.SetHeaderType, payload: "comments" });
            break;
        case "send":
            options.dispatch && options.dispatch({ type: PostActionType.SetPost, payload: { ...data } });
            options.dispatch && options.dispatch({ type: ModalActionType.SetBottomModal, payload: true });
            options.dispatch && options.dispatch({ type: PostActionType.SetHeaderType, payload: "share" });
            break;
        case "like":
            (async () => {
                if (data.post.likedBy.includes(data.user._id)) data.post.likedBy.splice(data.post.likedBy.indexOf(data.user._id), 1);
                else data.post.likedBy.push(data.user._id);
                await postService.savePost(data.post);
            })();
            break;
        case "likeComment":
            (async () => {
                const updatedComment = {
                    ...data.comment,
                    likedBy: data.comment.likedBy.includes(data.user._id) ? data.comment.likedBy.filter((userId: string) => userId !== data.user._id) : [...data.comment.likedBy, data.user._id],
                } 
                const updatedPost = {
                    ...data.post,
                    comments: data.post.comments.map((c:any) => c.commentId === updatedComment.commentId ? updatedComment : c),
                };
                await postService.savePost(updatedPost);
                options.dispatch && options.dispatch({ type: PostActionType.SetPost, payload: {...updatedPost} });
            })();
            break;
        case "save":
            (async () => {
                if (data.user.savedPosts.includes(data.post._id)) data.user.savedPosts.splice(data.user.savedPosts.indexOf(data.post._id), 1);
                else data.user.savedPosts.push(data.post._id);
                await userService.updateUser(data.user);
            })();
            break;
        case "notifications":
            options.dispatch && options.dispatch({ type: PostActionType.SetHeaderType, payload: "notifications" });
            options.dispatch && options.dispatch({ type: ModalActionType.SetSideModal, payload: data });
            break;
        case "story":
            options.dispatch && options.dispatch({ type: ModalActionType.SetStoryModal, payload: data });
            break;
        case "settings":
            options.dispatch && options.dispatch({ type: ModalActionType.SetSideModal, payload: data });
            break;
        case "chat":
            options.dispatch && options.dispatch({ type: PostActionType.SetHeaderType, payload: "chat" });
            options.dispatch && options.dispatch({ type: UserActionType.SetUser, payload: data.user });
            options.dispatch && options.dispatch({ type: ChatActionType.SetChat, payload: data.chat });
            options.dispatch && options.dispatch({ type: ModalActionType.SetSideModal, payload: true });
            options.navigate && options.navigate(`/chats/${data.chat._id}`);
            break;
        case "chats":
            options.dispatch && options.dispatch({ type: ModalActionType.SetSideModal, payload: false });
            options.dispatch && options.dispatch({ type: PostActionType.SetHeaderType, payload: "none" });
            options.navigate && options.navigate("/chats");
            break;
        case "posts":
            options.dispatch && options.dispatch({ type: ModalActionType.SetPostsModal, payload: data });
            break;
        case "saved":
            options.dispatch && options.dispatch({ type: PostActionType.SetHeaderType, payload: data });
            break;
        case "archive":
            options.dispatch && options.dispatch({ type: PostActionType.SetHeaderType, payload: "archive" });
            options.dispatch && options.dispatch({ type: ModalActionType.SetBottomModal, payload: data });
            break;
        case "blocked":
            options.dispatch && options.dispatch({ type: PostActionType.SetHeaderType, payload: "blocked" });
            break;
        case "followers":
            options.dispatch && options.dispatch({ type: PostActionType.SetHeaderType, payload: data });
            options.dispatch && options.dispatch({ type: ModalActionType.SetSideModal, payload: true });
            break;
        case "following":
            options.dispatch && options.dispatch({ type: PostActionType.SetHeaderType, payload: data });
            options.dispatch && options.dispatch({ type: ModalActionType.SetSideModal, payload: true });
            break;
        case "back":
            const location = data.includes("profile") && data.length == 7 ? "profile" : data.includes("profile") && data.length > 7 ? "" : data;
            if (location === "search" || location === "reels") {
                options.dispatch && options.dispatch({ type: ModalActionType.SetPostsModal, payload: false });
                options.dispatch && options.dispatch({ type: PostActionType.SetHeaderType, payload: location });
            } else if (location === "chats") {
                options.dispatch && options.dispatch({ type: PostActionType.SetHeaderType, payload: "" });
                options.navigate && options.navigate("/");
            } else {
                options.dispatch && options.dispatch({ type: PostActionType.SetHeaderType, payload: location });
                options.dispatch && options.dispatch({ type: ModalActionType.SetPostsModal, payload: false });
                options.dispatch && options.dispatch({ type: ModalActionType.SetBottomModal, payload: false });
                options.dispatch && options.dispatch({ type: ModalActionType.SetSideModal, payload: false });
                options.navigate && options.navigate(`/${location}`);
            }
            break;
        case "backToHome":
            options.dispatch && options.dispatch({ type: PostActionType.SetHeaderType, payload: "" });
            options.navigate && options.navigate(`/`);
            break;
        case "backToChat":
            options.dispatch && options.dispatch({ type: PostActionType.SetHeaderType, payload: "chat" });
            options.dispatch && options.dispatch({ type: ModalActionType.SetPostsModal, payload: data });
            options.dispatch && options.dispatch({ type: ModalActionType.SetSideModal, payload: true });
            break;
        case "backToProfile":
            options.dispatch && options.dispatch({ type: PostActionType.SetHeaderType, payload: "profile" });
            options.dispatch && options.dispatch({ type: ModalActionType.SetPostsModal, payload: data });
            options.dispatch && options.dispatch({ type: ModalActionType.SetSideModal, payload: data });
            options.navigate && options.navigate(`/profile`);
            break;
        case "backToSettings":
            options.dispatch && options.dispatch({ type: PostActionType.SetHeaderType, payload: "settings" });
            break;
        case 'archiveBack':
            options.dispatch && options.dispatch({ type: PostActionType.SetHeaderType, payload: "settings" });
            options.dispatch && options.dispatch({ type: ModalActionType.SetBottomModal, payload: data });
            break;
        case "aboutBack":
            options.dispatch && options.dispatch({ type: PostActionType.SetHeaderType, payload: "settings" });
            options.dispatch && options.dispatch({ type: ModalActionType.SetSideModal, payload: true });
            options.navigate && options.navigate(`/profile`);
            break;
        case "logout":
            sessionStorage.removeItem("userInfo");
            document.cookie = "loginToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            options.dispatch && options.dispatch({ type: PostActionType.SetHeaderType, payload: "none" });
            options.dispatch && options.dispatch({ type: ModalActionType.SetBottomModal, payload: data });
            options.dispatch && options.dispatch({ type: ModalActionType.SetPostsModal, payload: data });
            options.dispatch && options.dispatch({ type: ModalActionType.SetSideModal, payload: data });
            options.dispatch && options.dispatch({ type: UserActionType.SetUser, payload: null });
            options.navigate && options.navigate("/login");
            break;
        default:
            break;
    }
}
