import { FunctionComponent } from "react";
import Post from "../interfaces/Post";
import { authService } from "../services/authService";
import User from "../interfaces/User";
import { useDispatch } from "react-redux";
import { PostActionType } from "../redux/PostState";

interface TaggedPostsProps {
    allPosts: Post[]
}

const TaggedPosts: FunctionComponent<TaggedPostsProps> = ({ allPosts }) => {
    const user: User = authService.getLoggedInUser() as User;
    const dispatch = useDispatch();

    const handlePostClick = (e: any, post: Post, component: string) => {
        e.preventDefault();
        dispatch({ type: PostActionType.SetPost, post:{ ...post, component: component} });
    }

    return (
        <>
            <div className="grid gap-[2px] grid-cols-3 grid-flow-row auto-rows-[minmax(0,_1fr)]">
                {allPosts.filter((post: Post) => post.tags.includes(user._id)).map((post: Post) => {
                    return <div key={post._id}><img className="aspect-square" onClick={(e) => handlePostClick(e, post, "tagged")} src={post.imgUrl} /></div>
                })}
            </div>
        </>
    );
}

export default TaggedPosts;