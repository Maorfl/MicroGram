import { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Archive from "./Archive";
import PostOptions from "./PostOptions";
import Comments from "./Comments";
import Share from "./Share";
import MyPostOptions from "./MyPostOptions";
import { PostActionType } from "../redux/PostState";

interface BottomModalProps {
    isBottomModal: boolean;
    currentComponent: string;
}

const BottomModal: FunctionComponent<BottomModalProps> = ({ isBottomModal, currentComponent }) => {
    const header = useSelector((state: any) => state.postState.component);
    const [currentHeader, setCurrentHeader] = useState<string>("");
    const dispatch = useDispatch();

    useEffect(() => {
        setCurrentHeader(header);
        if (currentComponent === "explore") dispatch({ type: PostActionType.SetHeaderType, payload: "explore" });
    }, [isBottomModal]);

    return (
        <>
            <div
                className={`bottomModal ${isBottomModal ? "active" : ""} ${
                    ((currentComponent === "home" || currentComponent === "explore") && currentHeader === "comments") ||
                    (currentComponent === "reels" && currentHeader === "reels-comments")
                        ? "h-92 bottom-0 rounded-xl"
                        : ((currentComponent === "home" || currentComponent === "explore") &&
                              currentHeader !== "comments") ||
                          (currentComponent === "reels" && currentHeader === "reels-share")
                        ? "h-2/3 bottom-0 rounded-xl"
                        : "h-full"
                }`}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                }}>
                {currentHeader === "archive" ? (
                    <Archive />
                ) : currentHeader === "comments" || currentHeader === "reels-comments" ? (
                    <Comments />
                ) : currentHeader === "share" || currentHeader === "reels-share" || currentHeader === "chats-share" ? (
                    <Share />
                ) : currentHeader === "more" ? (
                    <PostOptions />
                ) : currentHeader === "moreProfile" ? (
                    <MyPostOptions />
                ) : (
                    <></>
                )}
            </div>
        </>
    );
};

export default BottomModal;
