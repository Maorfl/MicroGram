import { FunctionComponent, useEffect, useState } from "react";
import User from "../interfaces/User";
import { postService } from "../services/postService";
import StoriesBar from "./StoriesBar";
import { storyService } from "../services/storyService";
import { useNavigate } from "react-router-dom";
import FeedPosts from "./FeedPosts";
import { authService } from "../services/authService";
import SideModal from "./SideModal";
import { useDispatch, useSelector } from "react-redux";
import { UserActionType } from "../redux/UserState";
import ClipLoader from "react-spinners/ClipLoader";

interface HomeProps {}

const Home: FunctionComponent<HomeProps> = ({}) => {
    const loggedUser = authService.getLoggedInUser();
    const isSideModal = useSelector((state: any) => state.modalState.sideModal);
    const [followingPosts, setFollowingPosts] = useState([]);
    const [followingStories, setFollowingStories] = useState([]);
    const [isPending, setIsPending] = useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!loggedUser) navigate("/login");
        else {
            (async () => {
                setIsPending(true);
                let posts: any = [];
                let stories: any = [];
                if (loggedUser?.following?.length) {
                    posts = await Promise.all(
                        (loggedUser as User)?.following?.map(async (userId: string) => {
                            return await postService.getPosts(userId);
                        })
                    );
                    stories = await Promise.all(
                        (loggedUser as User)?.following?.map(async (userId: string) => {
                            return await storyService.getStories(userId, true);
                        })
                    );
                }
                setFollowingPosts(posts);
                setFollowingStories(stories);
                dispatch({ type: UserActionType.SetUser, payload: loggedUser });
                setIsPending(false);
            })();
        }
    }, [isSideModal]);

    return (
        <>
            {!isSideModal && (
                <>
                    {!isPending ? (
                        <>
                            <StoriesBar followingStories={followingStories} />
                            <FeedPosts followingPosts={followingPosts.flat(1)} />
                        </>
                    ) : (
                        <div className="flex justify-center mt-2">
                            <ClipLoader color="#0095f6" />
                        </div>
                    )}
                </>
            )}

            <SideModal isSideModal={isSideModal} />
        </>
    );
};

export default Home;
