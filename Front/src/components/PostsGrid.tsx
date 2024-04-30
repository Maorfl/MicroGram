import { FunctionComponent } from "react";
import Post from "../interfaces/Post";
import { useDispatch } from "react-redux";
import { PostActionType } from "../redux/PostState";
import { ModalActionType } from "../redux/ModalState";

interface PostsGridProps {
    posts: Post[];
    header: string;
}

const PostsGrid: FunctionComponent<PostsGridProps> = ({ posts, header }) => {
    const dispatch = useDispatch();

    const handlePostClick = async (e: any, post: Post) => {
        e.preventDefault();
        dispatch({ type: PostActionType.SetPost, payload: { ...post } });
        dispatch({ type: ModalActionType.SetPostsModal, payload: true });
        dispatch({ type: PostActionType.SetHeaderType, payload: header });
    };

    if (posts[0] && posts.length) {
        return (
            <>
                <div className="grid gap-[2px] grid-cols-3 grid-flow-row auto-rows-[minmax(0,_1fr)]">
                    {posts.map((post: Post) => {
                        return (
                            <div key={post._id} className="my-button">
                                <img
                                    className="object-cover aspect-square"
                                    onClick={(e) => handlePostClick(e, post)}
                                    src={post.imgUrl}
                                />
                            </div>
                        );
                    })}
                </div>
            </>
        );
    }
};

export default PostsGrid;
