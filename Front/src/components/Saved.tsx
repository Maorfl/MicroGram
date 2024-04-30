import { FunctionComponent, useEffect, useState } from "react";
import User from "../interfaces/User";
import { authService } from "../services/authService";
import { postService } from "../services/postService";
import PostsGrid from "./PostsGrid";
import { useSelector } from "react-redux";
import PostDetail from "./PostDetail";
import Post from "../interfaces/Post";

interface SavedProps {}

const Saved: FunctionComponent<SavedProps> = () => {
    const isPostsModal = useSelector((state: any) => state.modalState.postsModal);
    const selectedPost: Post = useSelector((state: any) => state.postState.post);
    const loggedUser = authService.getLoggedInUser();
    const [savedPosts, setSavedPosts] = useState<Post[]>([]);

    useEffect(() => {
        if (!isPostsModal && loggedUser && loggedUser.savedPosts[0]) {
            (async () => {
                const posts: any = await Promise.all(
                    (loggedUser as User)?.savedPosts?.map(async (postId: string) => {
                        return await postService.getPostById(postId);
                    })
                );
                setSavedPosts(posts);
            })();
        }
    }, [isPostsModal]);

    return (
        <>
            {savedPosts.length && savedPosts[0]._id ? (
                <>
                    {!isPostsModal ? (
                        <PostsGrid posts={savedPosts} header="saved" />
                    ) : (
                        <div className="pt-1 mb-14">
                            <PostDetail post={selectedPost} />
                        </div>
                    )}
                </>
            ) : (
                <div className="flex justify-center">
                    <p className="text-lg font-semibold">No saved posts</p>
                </div>
            )}
        </>
    );
};

export default Saved;
