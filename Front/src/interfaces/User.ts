import Highlight from "./Highlight";

export default interface User {
    _id: string;
    username: string;
    imgUrl: string;
    fullname: string;
    email: string;
    gender: string;
    description?: string;
    password?: string;
    createdAt: number;
    following: string[];
    followers: string[];
    savedPosts: string[];
    highlights: Highlight[];
    posts: string[];
    reels: string[];
    stories: string[]
    chats: string[];
    notifications: string[];
    blocked: string[];
    isAdmin: boolean;
}


