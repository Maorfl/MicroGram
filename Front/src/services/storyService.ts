import Story from "../interfaces/Story";
import axiosService from "./axiosService";

const ENDPOINT = '/stories';


export const storyService = {
    getStories,
    getStoryById,
    saveStory,
    deleteStory,
    getEmptyStory
}

async function getStories(userId: string, is24: boolean): Promise<Story[] | void> {
    try {
        const data = { userId, is24 };
        return await axiosService.get(`${ENDPOINT}`, data);
    } catch (error) {
        throw new Error("Cannot load stories");
    }
}

async function getStoryById(storyId: string): Promise<Story | void> {
    try {
        return await axiosService.get(`${ENDPOINT}/${storyId}`);
    } catch (error) {
        throw new Error("Cannot load story")
    }
}

async function saveStory(story: Story): Promise<Story | void> {
    try {
        if (story._id) return await axiosService.put(`${ENDPOINT}/${story._id}`, story);
        else return await axiosService.post(`${ENDPOINT}`, story)
    } catch (error) {
        throw new Error("Could not save story")
    }
}

async function deleteStory(storyId: string): Promise<void> {
    try {
        await axiosService.delete(`${ENDPOINT}/${storyId}`);
    } catch (error) {
        throw new Error("Could not delete");
    }
}

function getEmptyStory(): any {
    return {
        imgUrl: [],
        by: {
            id: "",
            username: "",
            imgUrl: "",
            fullname: ""
        },
        tags: [],
        createdAt: Date.now()
    };
}