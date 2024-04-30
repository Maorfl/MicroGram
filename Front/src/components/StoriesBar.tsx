import { FunctionComponent, useEffect } from "react";
import UserStories from "./UserStories";
import { StoriesList } from "../types/StoriesList";
import { handleClickService } from "../services/handleClickService";
import { ClickTypes } from "../enums/clickTypes";
import { useDispatch } from "react-redux";
import Story from "../interfaces/Story";
import HighlightBar from "../interfaces/HighlightBar";
import profilePic from "../assets/images/profile-picture.jpeg";

interface StoriesBarProps {
    followingStories: StoriesList[] | HighlightBar[];
}

const StoriesBar: FunctionComponent<StoriesBarProps> = ({ followingStories }) => {
    const dispatch = useDispatch();

    useEffect(() => {}, []);

    return (
        <>
            {followingStories.length && followingStories[0] ? (
                <>
                    {"name" in followingStories[0] ? (
                        <></>
                    ) : (
                        <div className="flex flex-nowrap pe-3 overflow-scroll mb-2 hide-scrollbar">
                            {followingStories.map((userStories) => {
                                if ((userStories as Story[]).length) {
                                    return (
                                        <div key={(userStories as Story[])[0].by.id} className="flex flex-col ms-3">
                                            <div
                                                className="story-gradient"
                                                onClick={(e) => {
                                                    const options = { dispatch };
                                                    handleClickService.handleClick(e, ClickTypes.story, true, options);
                                                }}>
                                                <div className="story-white">
                                                    <img
                                                        src={(userStories as Story[])[0].by.imgUrl || profilePic}
                                                        className="rounded-image-md"
                                                        alt="User image"
                                                    />
                                                    <UserStories userStories={userStories as Story[]} />
                                                </div>
                                            </div>
                                            <div className="text-overflow text-sm place-self-center">
                                                {(userStories as Story[])[0].by.username}
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    )}
                </>
            ) : (
                <></>
            )}
        </>
    );
};

export default StoriesBar;
