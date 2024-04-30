import MinUser from "./MinUser";

export default interface Comment {
    commentId: string;
    by: MinUser;
    txt: string;
    likedBy: string[];
    createdAt: number;
    comments: [] | [{
        commentId: string,
        by: MinUser,
        txt: string,
        likeBy: string[],
        createdAt: number
    }]
}
