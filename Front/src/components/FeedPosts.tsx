import { FunctionComponent, useEffect } from "react";
import Post from "../interfaces/Post";
import PostDetail from "./PostDetail";

interface FeedPostsProps {
    followingPosts: Post[];
}

const FeedPosts: FunctionComponent<FeedPostsProps> = ({ followingPosts }) => {
    useEffect(() => {}, [followingPosts]);

    return (
        <>
            {followingPosts.length ? (
                <div className="pt-1 mb-14 overflow-scroll">
                    {followingPosts.map((post: Post) => {
                        return <PostDetail key={post._id} post={post} />;
                    })}
                </div>
            ) : (
                <div className="flex justify-center">
                    <p className="text-lg font-semibold">You need to follow users to see posts</p>
                </div>
            )}
        </>
    );
};

export default FeedPosts;
