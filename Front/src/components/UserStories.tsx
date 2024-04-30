import { FunctionComponent, useEffect, useState } from "react";
import Story from "../interfaces/Story";
import StoryDetails from "./StoryDetails";
import { useSelector } from "react-redux";
import Highlight from "../interfaces/Highlight";

interface UserStoriesProps {
    userStories: Story[] | Highlight[];
}

const UserStories: FunctionComponent<UserStoriesProps> = ({ userStories }) => {
    const isStoryModal = useSelector((state: any) => state.modalState.storyModal);
    const [currStoryIdx, setCurrentStoryIdx] = useState<number>(0);
    let intervalId: any;

    const restartInterval = (isClear: boolean) => {
        if (isClear) {
            clearInterval(intervalId);
            intervalId = setInterval(() => {
                setCurrentStoryIdx((prevState) => prevState + 1);
            }, 3000);
        } else clearInterval(intervalId);
    };

    useEffect(() => {
        setCurrentStoryIdx(0);
        if (isStoryModal && !intervalId) {
            intervalId = setInterval(() => {
                setCurrentStoryIdx((prevState) => prevState + 1);
            }, 3000);
        }
        return () => {
            clearInterval(intervalId);
        };
    }, [isStoryModal]);

    return isStoryModal ? (
        <>
            <StoryDetails
                story={userStories[currStoryIdx]}
                userStories={userStories}
                currStoryIdx={currStoryIdx}
                setCurrentStoryIdx={setCurrentStoryIdx}
                restartInterval={restartInterval}
            />
        </>
    ) : (
        <></>
    );
};

export default UserStories;
