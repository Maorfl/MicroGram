import MyReel from "../interfaces/MyReel";
import axiosService from "./axiosService";

const ENDPOINT = "/reels"
async function getReels(userId: string | null): Promise<any | void> {
    try {
        if (userId) return await axiosService.get(`${ENDPOINT}`, { userId });
        return await axiosService.get(ENDPOINT);
    } catch (error) {
        throw new Error("Cannot load reels");
    }
}


async function saveReel(reel: MyReel): Promise<MyReel | void> {
    try {
        if (reel._id) return await axiosService.put(`${ENDPOINT}/${reel._id}`, reel);
        else return await axiosService.post(`${ENDPOINT}/${reel._id}`, reel)
    } catch (error) {
        throw new Error("Could not save reel")
    }
}

async function deleteReel(reelId: string): Promise<void> {
    try {
        await axiosService.delete(`${ENDPOINT}/${reelId}`);
    } catch (error) {
        throw new Error("Could not delete reel")
    }
}
function getEmptyReel(): any {
    return {
        reel: {
            reelInfo: {
                url: '',
                type: "video/mp4",
                description: '',
                postedBy: {
                    id: '',
                    avatar: '',
                    name: ''
                },
                likes: {
                    count: 0
                },
                dislikes: {
                    count: 0
                },
                comments: {
                    count: 0
                },
                shares: {
                    count: 0
                }
            },
            createdAt: Date.now()
        },
        likedBy: [],
        dislikedBy: [],
        commentsArray: []
    };
}

export const reelService = {
    getReels,
    saveReel,
    deleteReel,
    getEmptyReel
}