import Post from "../interfaces/Post";
import axiosService from "./axiosService";

const ENDPOINT = "/posts"


export const postService = {
    getPosts,
    getPostById,
    savePost,
    deletePost,
    shufflePosts,
    getEmptyPost
}

function getEmptyPost(): any {
    return {
        txt: '',
        imgUrl: '',
        createdAt: Date.now(),
        by: {
            id: '',
            fullname: '',
            imgUrl: '',
            username: ''
        },
        comments: [],
        likedBy: [],
        tags: [],
    };
}
async function getPosts(userId: string | null): Promise<Post[] | void> {
    try {
        if (userId) return await axiosService.get(`${ENDPOINT}`, { userId });
        return await axiosService.get(ENDPOINT);
    } catch (error) {
        throw new Error("Cannot load posts");
    }
}

async function getPostById(postId: string): Promise<Post | void> {
    try {
        return await axiosService.get(`${ENDPOINT}/${postId}`);
    } catch (error) {
        throw new Error("Cannot load post")
    }
}

async function savePost(post: Post): Promise<Post | void> {
    try {
        if (post._id) return await axiosService.put(`${ENDPOINT}/${post._id}`, post);
        else return await axiosService.post(`${ENDPOINT}`, post)
    } catch (error) {
        throw new Error("Could not save post")
    }
}

async function deletePost(postId: string): Promise<void> {
    try {
        await axiosService.delete(`${ENDPOINT}/${postId}`);
    } catch (error) {
        throw new Error("Could not delete");
    }
}

function shufflePosts(posts: Post[]): Post[] {
    for (let i = posts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [posts[i], posts[j]] = [posts[j], posts[i]];
    }
    return posts;
}