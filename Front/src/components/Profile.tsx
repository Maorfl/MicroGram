import { FunctionComponent, useEffect, useRef, useState } from "react";
import ProfileInfo from "./ProfileInfo";
import ProfileNav from "./ProfileNav";
import Post from "../interfaces/Post";
import User from "../interfaces/User";
import { postService } from "../services/postService";
import PostsList from "./PostsList";
import { useDispatch, useSelector } from "react-redux";
import { ModalActionType } from "../redux/ModalState";
import SideModal from "./SideModal";
import ClipLoader from "react-spinners/ClipLoader";

interface ProfileProps {}

const Profile: FunctionComponent<ProfileProps> = () => {
    const selectedUser: User = useSelector((state: any) => state.userState.user);
    const postsRef = useRef<HTMLDivElement>(null);
    const isSideModal: boolean = useSelector((state: any) => state.modalState.sideModal);
    const isPostsModal: boolean = useSelector((state: any) => state.modalState.postsModal);
    const [allPosts, setAllPosts] = useState<Post[]>([]);
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [isPending, setIsPending] = useState<boolean>(false);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            if (selectedUser && selectedUser.posts) {
                setIsPending(true);
                let userPosts: any = [];
                if (selectedUser?.posts?.length) {
                    userPosts = await Promise.all(
                        selectedUser?.posts?.map(async (postId: string) => {
                            return await postService.getPostById(postId);
                        })
                    );
                }
                const allPosts: any = await postService.getPosts(null);

                setAllPosts(allPosts);
                setUserPosts(userPosts);
                setIsPending(false);
            }
        })();
        return () => {
            dispatch({ type: ModalActionType.SetPostsModal, payload: false });
        };
    }, [isSideModal, selectedUser]);

    return (
        <>
            {!isPostsModal && !isSideModal ? (
                <div className="max-h-95">
                    <ProfileInfo postsRef={postsRef} />
                    {!isPending ? (
                        <ProfileNav
                            userPosts={userPosts}
                            allPosts={allPosts}
                            selectedUser={selectedUser}
                            postsRef={postsRef}
                        />
                    ) : (
                        <div className="flex justify-center mt-2">
                            <ClipLoader color="#0095f6" />
                        </div>
                    )}
                </div>
            ) : (
                !isSideModal && (
                    <>
                        <PostsList posts={userPosts} />
                    </>
                )
            )}

            <SideModal isSideModal={isSideModal} />
        </>
    );
};

export default Profile;
