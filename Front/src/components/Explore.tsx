import { FunctionComponent, useEffect, useState } from "react";
import { postService } from "../services/postService";
import Post from "../interfaces/Post";
import PostsGrid from "./PostsGrid";
import PostsList from "./PostsList";
import { useDispatch } from "react-redux";
import { ModalActionType } from "../redux/ModalState";
import ClipLoader from "react-spinners/ClipLoader";

interface ExploreProps {
    postsModal: boolean;
}

const Explore: FunctionComponent<ExploreProps> = ({ postsModal }) => {
    const [isPending, setIsPending] = useState<boolean>(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            setIsPending(true);
            const posts = await postService.getPosts(null);
            setPosts(posts as Post[]);
            setIsPending(false);
        })();
        return () => {
            dispatch({ type: ModalActionType.SetPostsModal, payload: false });
        };
    }, []);

    return (
        <>
            {!postsModal ? (
                <>
                    {!isPending ? (
                        <PostsGrid posts={posts} header="explore" />
                    ) : (
                        <div className="flex justify-center mt-2">
                            <ClipLoader color="#0095f6" />
                        </div>
                    )}
                </>
            ) : (
                <PostsList posts={posts} />
            )}
        </>
    );
};

export default Explore;
