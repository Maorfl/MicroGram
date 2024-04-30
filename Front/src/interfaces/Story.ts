import Location from "./Location";
import MinUser from "./MinUser";

export default interface Story {
    _id: string;
    imgUrl: string[];
    by: MinUser;
    loc?: Location;
    tags?: string[];
    createdAt: number
}