import { FunctionComponent, useEffect, useState } from "react";
import { authService } from "../services/authService";
import User from "../interfaces/User";
import { userService } from "../services/userService";
import NotifiedUser from "./NotifiedUser";

interface NotificationsProps {}

const Notifications: FunctionComponent<NotificationsProps> = () => {
    const loggedUser = authService.getLoggedInUser();
    const [notifiedUsers, setNotifiedUsers] = useState<User[]>([]);

    useEffect(() => {
        if (loggedUser && loggedUser.notifications?.length) {
            (async () => {
                const notifiedUsers: any = await Promise.all(
                    (loggedUser as User)?.notifications?.map(async (userId: string) => {
                        return await userService.getUserById(userId);
                    })
                );
                setNotifiedUsers(notifiedUsers);
            })();
        }
    }, []);

    return (
        <>
            {notifiedUsers[0] && notifiedUsers.length ? (
                <div className="w-full">
                    {notifiedUsers.map((user: User) => {
                        return <NotifiedUser key={user._id} user={user} />;
                    })}
                </div>
            ) : (
                <div className="mt-3 ms-3">
                    <p className="font-bold text-xl">You have no notifications</p>
                </div>
            )}
        </>
    );
};

export default Notifications;
