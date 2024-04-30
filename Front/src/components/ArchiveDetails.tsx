import { FunctionComponent, useEffect, useState } from "react";
import Story from "../interfaces/Story";
import { utilService } from "../services/utilService";

interface ArchiveDetailsProps {
    story: Story;
    allStories: Story[];
    index: number;
}

const ArchiveDetails: FunctionComponent<ArchiveDetailsProps> = ({ story, allStories, index }) => {
    const [isFirst, setIsFirst] = useState<boolean>(true);

    useEffect(() => {
        setIsFirst(
            allStories.findIndex(
                (s) =>
                    utilService.getDay(s.createdAt) === utilService.getDay(story.createdAt) &&
                    utilService.getMonth(s.createdAt) === utilService.getMonth(story.createdAt)
            ) === index
        );
    }, []);

    return (
        <>
            <div className="archive">
                {isFirst && (
                    <div className="archive-date flex flex-col justify-center ">
                        <p className="text-lg font-semibold text-center leading-none m-0">
                            {utilService.getDay(story.createdAt)}
                        </p>
                        <p className="text-xs text-center m-0 leading-none">{utilService.getMonth(story.createdAt)}</p>
                    </div>
                )}
                <img src={story.imgUrl[0]} alt="Story image" className="h-full object-cover" />
            </div>
        </>
    );
};
export default ArchiveDetails;
