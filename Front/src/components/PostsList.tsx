import { FunctionComponent, useEffect, useState } from "react";
import Post from "../interfaces/Post";
import PostDetail from "./PostDetail";
import { useSelector } from "react-redux";
import { authService } from "../services/authService";
import BottomModal from "./BottomModal";

interface PostsListProps {
    posts: Post[];
}

const PostsList: FunctionComponent<PostsListProps> = ({ posts }) => {
    const loggedUser = authService.getLoggedInUser();
    const selectedPost: Post = useSelector((state: any) => state.postState.post as Post);
    const isBottomModal = useSelector((state: any) => state.modalState.bottomModal);
    const [postsList, setPostsList] = useState<Post[]>([]);

    useEffect(() => {
        const postIndex = posts.findIndex((post) => post._id === selectedPost._id);
        const updatedPosts: Post[] = posts;
        updatedPosts.splice(postIndex, 1);
        updatedPosts.unshift(selectedPost);
        setPostsList(updatedPosts);
    }, [selectedPost]);
    return (
        <>
            {!isBottomModal && (
                <div className="pt-1 mb-14 scroll overflow-scroll">
                    {postsList[0] &&
                        loggedUser &&
                        postsList.map((post: Post) => {
                            if (!loggedUser?.blocked?.includes(post.by.id))
                                return <PostDetail key={post._id} post={post} />;
                            else return <></>;
                        })}
                </div>
            )}
            <BottomModal isBottomModal={isBottomModal} currentComponent="home" />
        </>
    );
};

export default PostsList;
