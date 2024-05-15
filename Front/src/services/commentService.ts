import Comment from "../interfaces/Comment";
import axiosService from "./axiosService";

const ENDPOINT = '/posts';


export const commentService = {
    addComment,
    editComment,
    deleteComment
}

async function addComment(newComment: Comment, postId: string): Promise<Comment> {
    try {
        return await axiosService.post(`${ENDPOINT}/${postId}/comments`, newComment);
    } catch (error) {
        throw new Error("Could not post comment");
    }
}

async function editComment(txt: string, commentId: string, postId: string): Promise<Comment> {
    try {
        return await axiosService.put(`${ENDPOINT}/${postId}/comments?commentId=${commentId}`, txt);
    } catch (error) {
        throw new Error("Could not edit comment");
    }
}

async function deleteComment(postId:string,commentId:string): Promise<Comment> {
    try {
        return await axiosService.delete(`${ENDPOINT}/${postId}/comments?commentId=${commentId}`);
    } catch (error) {
        throw new Error("Could not delete comment");
    }
} 