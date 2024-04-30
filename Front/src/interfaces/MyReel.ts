import Comment from "./Comment";
import ReelsType from "./Reels";


export default interface MyReel extends ReelsType {
    _id: string,
    reel: ReelsType
    likedBy: string[]
    dislikedBy: string[]
    commentsArray: Comment[]
}