import { CommentsType, SharesType } from "@sayings/react-reels/dist/components/ReelsComponent/reels.type";

export default interface ReelsType {
    id: number; 
    reelInfo: {
        url: string; 
        type: string; 
        description?: string; 
        postedBy?: {
            id: string;
            avatar: string; 
            name: string; 
        };
        likes?: {
            count: number;
        };
        dislikes?: {
            count: number;
        };
        comments?: CommentsType;
        shares?: SharesType;
        createdAt: number;
    }
    rightMenu?: { 
        options: Array<{ 
            id: number; 
            label: string; 
            value: string; 
        }>
    };
    bottomSection?: { 
        component: JSX.Element; 
    };
}