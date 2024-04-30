import { FunctionComponent, useEffect, useState } from "react";
import MyReel from "../interfaces/MyReel";
import { useDispatch, useSelector } from "react-redux";
import { ReelActionType } from "../redux/ReelState";
import { useNavigate } from "react-router-dom";
import { PostActionType } from "../redux/PostState";
import User from "../interfaces/User";
import { reelService } from "../services/reelService";

interface ReelsGridProps {}

const ReelsGrid: FunctionComponent<ReelsGridProps> = () => {
    const selectedUser: User = useSelector((state: any) => state.userState.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [userReels, setUserReels] = useState<MyReel[]>([]);

    useEffect(() => {
        (async () => {
            if (selectedUser && selectedUser.reels.length) {
                const userReels: any = await reelService.getReels(selectedUser._id);
                setUserReels(userReels);
            }
        })();
    }, []);

    return (
        <>
            <div className="grid gap-[2px] grid-cols-3 grid-flow-row auto-rows-[minmax(300px,_1fr)] overflow-scroll max-h-dvh">
                {userReels.map((reel: MyReel) => {
                    return (
                        <div
                            className="my-button"
                            onClick={(e) => {
                                e.preventDefault();
                                dispatch({ type: ReelActionType.SetReel, payload: reel.reel });
                                dispatch({ type: PostActionType.SetHeaderType, payload: "reels" });
                                navigate("/reels");
                            }}>
                            <video src={reel.reel.reelInfo.url} className="h-full object-cover min-h-48" />
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default ReelsGrid;
