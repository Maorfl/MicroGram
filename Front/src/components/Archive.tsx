import { FunctionComponent, useEffect, useState } from "react";
import { authService } from "../services/authService";
import { storyService } from "../services/storyService";
import Story from "../interfaces/Story";
import User from "../interfaces/User";
import ArchiveDetails from "./ArchiveDetails";
import { useDispatch, useSelector } from "react-redux";
import { ModalActionType } from "../redux/ModalState";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ClickTypes } from "../enums/clickTypes";
import { handleClickService } from "../services/handleClickService";
import ClipLoader from "react-spinners/ClipLoader";

interface ArchiveProps {}

const Archive: FunctionComponent<ArchiveProps> = () => {
    const loggedUser = authService.getLoggedInUser();
    const [archiveStories, setArchiveStories] = useState<Story[]>([]);
    const [isPending, setIsPending] = useState<boolean>(false);
    const isBottomModal = useSelector((state: any) => state.modalState.bottomModal);
    const dispatch = useDispatch();

    useEffect(() => {
        if (isBottomModal) {
            (async () => {
                setIsPending(true);
                const archive: any = await Promise.all(
                    (loggedUser as User)?.stories?.map(async (storyId: string) => {
                        return await storyService.getStoryById(storyId);
                    })
                );
                archive.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                setArchiveStories(archive);
                setIsPending(false);
            })();
        }

        return () => {
            dispatch({ type: ModalActionType.SetBottomModal, payload: false });
        };
    }, []);

    return (
        <>
            <header className="header">
                <div
                    onClick={(e) => {
                        const options = {
                            dispatch,
                        };
                        handleClickService.handleClick(e, ClickTypes.archiveBack, false, options);
                    }}
                    className="flex-initial ms-2 text-2xl">
                    <FontAwesomeIcon icon={faArrowLeft} />
                </div>
                <div className="flex-1 font-bold text-overflow text-2xl">Stories Archive</div>
                <div className="me-2"></div>
            </header>

            {!isPending ? (
                <>
                    {archiveStories[0] && archiveStories.length ? (
                        <div className="grid gap-[2px] grid-cols-3 grid-flow-row auto-rows-[minmax(0,_1fr)]">
                            {archiveStories.map((story: Story, index, allStories) => {
                                return (
                                    <ArchiveDetails
                                        key={story._id}
                                        story={story}
                                        allStories={allStories}
                                        index={index}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="ms-3 mt-3">
                            <p className="font-bold text-xl">No stories found</p>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex justify-center mt-2">
                    <ClipLoader color="#0095f6" />
                </div>
            )}
        </>
    );
};

export default Archive;
