import MinUser from "./MinUser";

export default interface InnerComment {
    commentId: string;
    by: MinUser;
    txt: string;
    likedBy: string[];
    createdAt: number;
}
