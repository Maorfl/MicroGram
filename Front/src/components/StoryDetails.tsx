import { FunctionComponent, useEffect } from "react";
import Story from "../interfaces/Story";
import { useDispatch } from "react-redux";
import { ModalActionType } from "../redux/ModalState";
import StoryHeader from "./StoryHeader";
import StoryFooter from "./StoryFooter";
import Highlight from "../interfaces/Highlight";

interface StoryDetailsProps {
    userStories: Story[] | Highlight[];
    story: Story | Highlight;
    currStoryIdx: number;
    setCurrentStoryIdx: Function;
    restartInterval: Function;
}

const StoryDetails: FunctionComponent<StoryDetailsProps> = ({
    story,
    userStories,
    currStoryIdx,
    setCurrentStoryIdx,
    restartInterval,
}) => {
    const dispatch = useDispatch();

    useEffect(() => {
        document.body.style.overflow = "hidden";
        if (currStoryIdx === userStories.length) {
            restartInterval(false);
            setCurrentStoryIdx(0);
            dispatch({ type: ModalActionType.SetStoryModal, payload: false });
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [story]);

    if (currStoryIdx < userStories.length) {
        return (
            <>
                <div className="fixed py-3 h-dvh top-0 left-0 w-full bg-black flex flex-col">
                    <StoryHeader userStories={userStories} currStoryIdx={currStoryIdx} setCurrentStoryIdx={setCurrentStoryIdx} />
                    <div className="flex-1">
                        <img
                            style={{ aspectRatio: "9/16" }}
                            src={(story as Story).imgUrl[0]}
                            alt="Story image"
                            className="object-fit rounded"
                        />
                    </div>

                    <div className="flex-none p-2">
                        <StoryFooter />
                    </div>
                </div>
            </>
        );
    }
};

export default StoryDetails;
