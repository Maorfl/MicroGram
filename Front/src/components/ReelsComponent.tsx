import { FunctionComponent, useEffect, useState } from "react";
import profilePic from "../assets/images/profile-picture.jpeg";
import { Reels } from "@sayings/react-reels";
import "@sayings/react-reels/dist/index.css";
import { ReelMetaInfoType } from "../interfaces/ReelMetaInfoType";
import { reelService } from "../services/reelService";
import MyReel from "../interfaces/MyReel";
import ReelsType from "../interfaces/Reels";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PostActionType } from "../redux/PostState";
import { ModalActionType } from "../redux/ModalState";
import BottomModal from "./BottomModal";
import { UserActionType } from "../redux/UserState";
import { userService } from "../services/userService";
import { ReelActionType } from "../redux/ReelState";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ClickTypes } from "../enums/clickTypes";
import { handleClickService } from "../services/handleClickService";

interface ReelsComponentProps {}

const ReelsComponent: FunctionComponent<ReelsComponentProps> = () => {
    const isBottomModal = useSelector((state: any) => state.modalState.bottomModal);
    const reel = useSelector((state: any) => state.reelState.reel);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [reels, setReels] = useState<MyReel[]>([]);
    const [reelsList, setReelsList] = useState<ReelsType[]>([]);
    const loggedUser = authService.getLoggedInUser();
    const reelMetaInfo: ReelMetaInfoType = {
        videoDimensions: {
            height: 800,
            width: 400,
        },
        backGroundColor: "#00000030",
        borderRadius: 10,
    };

    useEffect(() => {
        (async () => {
            let reelsList = [];
            const reels = await reelService.getReels(null);
            if (reel != null) reelsList = [reel];
            else {
                reelsList = reels.map((reel: MyReel) => {
                    const innerReel = {
                        ...reel.reel,
                        reelInfo: {
                            ...reel.reel.reelInfo,
                            postedBy: {
                                ...reel.reel.reelInfo.postedBy,
                                avatar: (reel.reel.reelInfo.postedBy as any).avatar
                                    ? (reel.reel.reelInfo.postedBy as any).avatar
                                    : profilePic,
                            },
                        },
                    };
                    if (loggedUser && reel.reel.reelInfo.postedBy?.id === loggedUser._id) {
                        innerReel.rightMenu = {
                            options: [
                                {
                                    id: 1,
                                    label: "Delete",
                                    value: "Delete",
                                },
                            ],
                        };
                    }
                    return innerReel;
                });
            }
            setReels(JSON.parse(JSON.stringify(reels)));
            setReelsList(reelsList);
        })();
    }, [reel]);

    async function onLikeClicked(reel: any) {
        let index = -1;
        reels.forEach((currReel, currIndex) => {
            if (reel.id === currReel.reel.id) index = currIndex;
        });
        if (index > -1) {
            let reelToUpdate = JSON.parse(JSON.stringify(reels[index]));
            if (!reelToUpdate.likedBy.includes(loggedUser?._id)) reelToUpdate.likedBy.push(loggedUser?._id);
            else reelToUpdate.likedBy.splice(reelToUpdate.likedBy.indexOf(loggedUser?._id), 1);
            reelToUpdate.reel.reelInfo.likes.count = reelToUpdate.likedBy.length;
            await reelService.saveReel(reelToUpdate);
        }
    }

    async function onDislikeClicked(reel: any) {
        let index = -1;
        reels.forEach((currReel, currIndex) => {
            if (reel.id === currReel.reel.id) index = currIndex;
        });
        if (index > -1) {
            let reelToUpdate = JSON.parse(JSON.stringify(reels[index]));
            if (!reelToUpdate.dislikedBy.includes(loggedUser?._id)) reelToUpdate.dislikedBy.push(loggedUser?._id);
            else reelToUpdate.dislikedBy.splice(reelToUpdate.dislikedBy.indexOf(loggedUser?._id), 1);
            reelToUpdate.reel.reelInfo.dislikes.count = reelToUpdate.dislikedBy.length;
            await reelService.saveReel(reelToUpdate);
        }
    }

    async function onAvatarClicked(reel: any) {
        let index = -1;
        reels.forEach((currReel, currIndex) => {
            if (reel.reelInfo.url === currReel.reel.reelInfo.url) index = currIndex;
        });
        if (index > -1) {
            const userId = reels[index].reel.reelInfo.postedBy?.id;
            const user = await userService.getUserById(userId as string);
            dispatch({ type: UserActionType.SetUser, payload: user });
            dispatch({ type: PostActionType.SetHeaderType, payload: "profile" });
            navigate(`/profile/${userId}`);
        }
    }
    return (
        <>
            {reels.length && reelsList.length ? (
                <Reels
                    reels={reelsList}
                    reelMetaInfo={reelMetaInfo}
                    onMenuItemClicked={async (reel) => {
                        await reelService.deleteReel(reel.reel._id);
                        navigate("/reels");
                    }}
                    onLikeClicked={(reel) => onLikeClicked(reel)}
                    onDislikeClicked={(reel) => onDislikeClicked(reel)}
                    onCommentClicked={(reel) => {
                        dispatch({ type: ModalActionType.SetBottomModal, payload: true });
                        dispatch({ type: PostActionType.SetPost, payload: null });
                        dispatch({ type: PostActionType.SetHeaderType, payload: "reels-comments" });
                        dispatch({ type: ReelActionType.SetReel, payload: reel });
                    }}
                    onShareClicked={(reel) => {
                        dispatch({ type: ModalActionType.SetBottomModal, payload: true });
                        dispatch({ type: PostActionType.SetPost, payload: null });
                        dispatch({ type: PostActionType.SetHeaderType, payload: "reels-share" });
                        dispatch({ type: ReelActionType.SetReel, payload: reel });
                    }}
                    onAvatarClicked={(reel) => onAvatarClicked(reel)}
                />
            ) : (
                <div>
                    <div className="header-reels-noreels border-b">
                        <div
                            onClick={(e) => {
                                const options = {
                                    dispatch,
                                    navigate,
                                };
                                handleClickService.handleClick(e, ClickTypes.backToHome, null, options);
                            }}
                            className="flex-initial  text-2xl">
                            <FontAwesomeIcon className="ms-3" icon={faArrowLeft} />
                        </div>
                        <div className="flex-1 font-bold text-overflow m-0 text-2xl">Reels</div>
                        <div className="me-2"></div>
                    </div>
                    <div className="w-full flex justify-center mt-16 text-2xl font-semibold">No reels to show</div>
                </div>
            )}
            <div
                className={`modal-bg will-change-transform ${isBottomModal ? "active" : ""} `}
                onClick={(e) => {
                    e.preventDefault();
                    dispatch({ type: ModalActionType.SetBottomModal, payload: false });
                }}>
                <BottomModal isBottomModal={isBottomModal} currentComponent={"reels"} />
            </div>
        </>
    );
};

export default ReelsComponent;
