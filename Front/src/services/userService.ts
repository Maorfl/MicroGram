import Post from "../interfaces/Post";
import User from "../interfaces/User";
import { authService } from "./authService";
import axiosService from "./axiosService";
import { postService } from "./postService";

const ENDPOINT = '/users';

export const userService = {
    getUserPosts,
    getUserSavedPosts,
    updateUser,
    getUsers,
    getUserById,
    getUserByEmail,
    getUserPassword,
    updateUserPassword,
    deleteUser
}

async function getUserPosts(userId: string): Promise<Post[] | void> {
    try {
        return await postService.getPosts(userId);
    } catch (error) {
        throw new Error("Could not get user's posts");
    }
}

async function getUserSavedPosts(savedPosts: string[]): Promise<Post[]> {
    try {
        const posts: (Post | void)[] = await Promise.all(savedPosts.map((postId:string)=>postService.getPostById(postId)));
        const filteredPosts: Post[] = posts.filter((post): post is Post => post !== undefined);
        return filteredPosts;
    } catch (error) {
        throw new Error("Could not get saved posts");
    }
}

async function updateUser(updatedUser: User): Promise<User> {
    try {        
        const loggedUser = authService.getLoggedInUser();
        if (loggedUser?._id === updatedUser._id) sessionStorage.setItem("userInfo", JSON.stringify(updatedUser));
        return await axiosService.put(`${ENDPOINT}/${updatedUser._id}`, updatedUser);
    } catch (error) {
        throw new Error("Could not update user");
    }
}

async function getUsers(filter: string): Promise<User[]> {
    try {
        return await axiosService.get(ENDPOINT, filter);
    } catch (error) {
        throw new Error("Could not get users");
    }
}

async function getUserById(userId: string, minUser: boolean = false): Promise<User> {
    try {
        return await axiosService.get(`${ENDPOINT}/${userId}`, minUser);
    } catch (error) {
        throw new Error("Could not get user");
    }
}

async function getUserByEmail(email: string): Promise<User> {
    try {
        return await axiosService.get(`${ENDPOINT}/forgot/${email}`);
    } catch (error) {
        throw new Error("Could not get user");
    }
}

async function getUserPassword(userId: string): Promise<string> {
    try {
        return await axiosService.get(`${ENDPOINT}/${userId}/password`);
    } catch (error) {
        throw new Error("Could not get user's password");
    }
}

async function updateUserPassword(data:any):Promise<void>{
    try {
        return await axiosService.put(`${ENDPOINT}/${data.userId}/password`,data);
    } catch (error) {
        throw new Error("Could not update user's password");
    }
}

async function deleteUser(userId: string): Promise<void> {
    try {
        return await axiosService.delete(`${ENDPOINT}/${userId}`);
    } catch (error) {
        throw new Error("Could not delete user");
    }
}



