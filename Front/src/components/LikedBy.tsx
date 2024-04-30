import { FunctionComponent, useEffect, useState } from "react";
import User from "../interfaces/User";
import { userService } from "../services/userService";

interface LikedByProps {
    usersId: string[];
    isChanged: boolean;
}

const LikedBy: FunctionComponent<LikedByProps> = ({ usersId, isChanged }) => {
    const [likedUsers, setLikedUsers] = useState<User[]>([]);
    useEffect(() => {
        (async () => {
            const users: any = await Promise.all(
                usersId.map(async (userId) => {
                    return await userService.getUserById(userId);
                })
            );
            setLikedUsers(users);
        })();
    }, [isChanged]);

    {
        if (usersId.length) {
            return (
                <>
                    {likedUsers.length == 1 ? (
                        <p className="m-0">
                            Liked by
                            <span className="font-semibold">{` ${likedUsers[0].username}`}</span>
                        </p>
                    ) : (
                        likedUsers.length > 1 && (
                            <p className="m-0">
                                Liked by
                                <span className="font-semibold">{` ${likedUsers[0].username} `}</span>
                                and
                                <span className="font-semibold">{` ${likedUsers.length - 1} others`}</span>
                            </p>
                        )
                    )}
                </>
            );
        }
    }
};

export default LikedBy;
