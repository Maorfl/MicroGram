import Comment from "./Comment";
import MinUser from "./MinUser";

export default interface Post {
    _id: string;
    txt?: string;
    imgUrl: string;
    createdAt: number;
    by: MinUser;
    loc?: Location;
    comments: Comment[];
    likedBy: string[];
    tags: string[];
}