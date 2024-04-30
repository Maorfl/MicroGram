import { FunctionComponent, useEffect } from "react";
import Story from "../interfaces/Story";
import Highlight from "../interfaces/Highlight";

interface StoryHeaderProps {
    userStories: Story[] | Highlight[];
    currStoryIdx: number;
    setCurrentStoryIdx: Function;
}

const StoryHeader: FunctionComponent<StoryHeaderProps> = ({ userStories, currStoryIdx }) => {
    const makeStoriesBar = (userStories: Story[]) => {
        return userStories.map((story: Story, index: number) => (
            <div key={story._id} className="story-bar-unseen">
                <div
                    className={`w-full ${index > currStoryIdx ? "story-bar-unseen" : "story-bar-seen"} ${
                        index === currStoryIdx ? " story-bar-active " : ""
                    } `}></div>
            </div>
        ));
    };
    useEffect(() => {}, [currStoryIdx]);

    return (
        <>
            <div className="half-black absolute top-0 left-0 w-full h-14 ">
                <div className="absolute top-5 px-1 w-full grid grid-flow-col gap-1  ">
                    {makeStoriesBar(userStories as Story[])}
                </div>
            </div>
        </>
    );
};

export default StoryHeader;
