import { FunctionComponent, useEffect } from "react";
import { useSelector } from "react-redux";
import Archive from "./Archive";
import PostOptions from "./PostOptions";
import Comments from "./Comments";
import Share from "./Share";
import MyPostOptions from "./MyPostOptions";

interface BottomModalProps {
    isBottomModal: boolean;
    currentComponent: string;
}

const BottomModal: FunctionComponent<BottomModalProps> = ({ isBottomModal, currentComponent }) => {
    const header = useSelector((state: any) => state.postState.component);

    useEffect(() => {}, [header]);

    return (
        <>
            <div
                className={`bottomModal ${isBottomModal ? "active" : ""} ${
                    (currentComponent === "home" && header === "comments") ||
                    (currentComponent === "reels" && header === "reels-comments")
                        ? "h-92 bottom-0 rounded-xl"
                        : (currentComponent === "home" && header !== "comments") ||
                          (currentComponent === "reels" && header === "reels-share")
                        ? "h-2/3 bottom-0 rounded-xl"
                        : "h-full"
                }`}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                }}>
                {header === "archive" ? (
                    <Archive />
                ) : header === "comments" || header === "reels-comments" ? (
                    <Comments />
                ) : header === "share" || header === "reels-share" || header === "chats-share" ? (
                    <Share />
                ) : header === "more" ? (
                    <PostOptions />
                ) : header === "moreProfile" ? (
                    <MyPostOptions />
                ) : (
                    <></>
                )}
            </div>
        </>
    );
};

export default BottomModal;
