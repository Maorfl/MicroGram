import { FunctionComponent, useEffect, useState } from "react";
import { authService } from "../services/authService";
import profilePic from "../assets/images/profile-picture.jpeg";
import { postService } from "../services/postService";
import { userService } from "../services/userService";
import User from "../interfaces/User";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PostActionType } from "../redux/PostState";
import { uploadImg, uploadVideo } from "../services/uploadService";
import "react-toastify/dist/ReactToastify.css";
import { feedbackService } from "../services/feedbackService";
import { reelService } from "../services/reelService";
import { storyService } from "../services/storyService";
import { UserActionType } from "../redux/UserState";

interface CreateProps {}

const Create: FunctionComponent<CreateProps> = () => {
    const loggedUser = authService.getLoggedInUser();
    const [createType, setCreateType] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    let text = "";
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleFileChange = (e: any, type: string) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && (selectedFile.type.includes("image") || selectedFile.type.includes("video"))) {
            if (selectedFile.type.includes("video") && (type === "post" || type === "story"))
                feedbackService.errorMsg("Please select an image");
            else if (selectedFile.type.includes("image") && type === "reel")
                feedbackService.errorMsg("Please select a video");
            else {
                setCreateType(type);
                setFile(selectedFile);
            }
        } else feedbackService.errorMsg("Please select an image or a video");
    };

    const handleSubmit = async () => {
        let url;

        if (file?.type.includes("image")) {
            url = await uploadImg(file as File);
            if (createType === "post") {
                let newPost: any = postService.getEmptyPost();
                newPost.txt = text;
                newPost.imgUrl = url.url;
                newPost.by.id = loggedUser?._id;
                newPost.by.fullname = loggedUser?.fullname;
                newPost.by.imgUrl = loggedUser?.imgUrl || profilePic;
                newPost.by.username = loggedUser?.username;

                newPost = await postService.savePost(newPost);
                (loggedUser as User).posts?.push(newPost._id);
            } else if (createType === "story") {
                let newStory: any = storyService.getEmptyStory();
                newStory.imgUrl = url.url;
                newStory.by.id = loggedUser?._id;
                newStory.by.fullname = loggedUser?.fullname;
                newStory.by.imgUrl = loggedUser?.imgUrl || profilePic;
                newStory.by.username = loggedUser?.username;

                newStory = await storyService.saveStory(newStory);
                (loggedUser as User).stories?.push(newStory._id);
            }
        } else if (file?.type.includes("video")) {
            url = await uploadVideo(file as File);
            let newReel: any = reelService.getEmptyReel();
            newReel.reel.reelInfo.url = url.url;
            newReel.reel.reelInfo.description = text;
            newReel.reel.reelInfo.postedBy.id = loggedUser?._id;
            newReel.reel.reelInfo.postedBy.avatar = loggedUser?.imgUrl || profilePic;
            newReel.reel.reelInfo.postedBy.name = loggedUser?.fullname;

            newReel = await reelService.saveReel(newReel);
            (loggedUser as User).reels?.push(newReel._id);
        }
        await updateUserAndNavigate();
    };
    async function updateUserAndNavigate() {
        const user = await userService.updateUser(loggedUser as User);
        dispatch({ type: UserActionType.SetUser, payload: user });
        dispatch({ type: PostActionType.SetHeaderType, payload: "" });
        navigate("/");
    }

    useEffect(() => {}, []);

    return (
        <>
            {createType === "post" ? (
                <div className="w-full">
                    <div className="flex justify-center text-3xl font-semibold py-1">New Post</div>
                    <div className="image-container flex justify-center">
                        {file && <img src={URL.createObjectURL(file)} alt="Post image" className="create-image" />}
                    </div>
                    <div className="w-full flex justify-center items-center px-3 border-t bg-white">
                        <div className="create-input">
                            <input
                                type="text"
                                placeholder="Description... (optional)"
                                className="w-full bg-transparent outline-none mb-2 placeholder:text-gray-600"
                                onChange={(e) => (text = e.target.value)}
                            />
                            <button
                                type="button"
                                className="w-full rounded bg-[#0095f6] text-white font-semibold py-2"
                                onClick={async () =>
                                    await feedbackService.promiseToast(handleSubmit, "Uploaded successfully")
                                }>
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            ) : createType === "reel" ? (
                <div className="w-full">
                    <div className="flex justify-center text-3xl font-semibold py-1">New Reel</div>
                    <div className="video-container flex justify-center">
                        {file && <video src={URL.createObjectURL(file)} controls />}
                    </div>
                    <div className="w-full flex justify-center items-center px-3 border-t bg-white">
                        <div className="create-input">
                            <input
                                type="text"
                                placeholder="Description... (optional)"
                                className="w-full bg-transparent outline-none mb-2 placeholder:text-gray-600"
                                onChange={(e) => (text = e.target.value)}
                            />
                            <button
                                type="button"
                                className="w-full rounded bg-[#0095f6] text-white font-semibold py-2"
                                onClick={async () =>
                                    await feedbackService.promiseToast(handleSubmit, "Uploaded successfully")
                                }>
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            ) : createType === "story" ? (
                <div className="w-full">
                    <div className="flex justify-center text-3xl font-semibold py-1">New Story</div>
                    <div className="image-container flex justify-center">
                        {file && <img src={URL.createObjectURL(file)} alt="Story image" className="create-image" />}
                    </div>
                    <div className="w-full flex justify-center items-center px-3 border-t bg-white">
                        <div className="create-input">
                            <input
                                type="text"
                                placeholder="Description... (optional)"
                                className="w-full bg-transparent outline-none mb-2 placeholder:text-gray-600"
                                onChange={(e) => (text = e.target.value)}
                            />
                            <button
                                type="button"
                                className="w-full rounded bg-[#0095f6] text-white font-semibold py-2"
                                onClick={async () =>
                                    await feedbackService.promiseToast(handleSubmit, "Uploaded successfully")
                                }>
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center mt-20">
                    <label
                        htmlFor="post-upload"
                        className="w-full flex justify-center font-semibold text-5xl text-blue-400 border-y border-y-blue-400 mb-20 py-3">
                        New Post
                        <input
                            id="post-upload"
                            style={{ opacity: 0, position: "absolute", display: "none" }}
                            type="file"
                            multiple={false}
                            capture="user"
                            onChange={(e) => handleFileChange(e, "post")}
                        />
                    </label>
                    <label
                        htmlFor="story-upload"
                        className="w-full flex justify-center font-semibold text-5xl text-orange-400 border-y border-y-orange-400 mb-20 py-3">
                        New Story
                        <input
                            id="story-upload"
                            style={{ opacity: 0, position: "absolute", display: "none" }}
                            type="file"
                            multiple={false}
                            capture="user"
                            onChange={(e) => handleFileChange(e, "story")}
                        />
                    </label>
                    <label
                        htmlFor="reel-upload"
                        className="w-full flex justify-center font-semibold text-5xl text-green-400 border-y border-y-green-400 py-3">
                        New Reel
                        <input
                            id="reel-upload"
                            style={{ opacity: 0, position: "absolute", display: "none" }}
                            type="file"
                            multiple={false}
                            capture="user"
                            accept="video/*"
                            onChange={(e) => handleFileChange(e, "reel")}
                        />
                    </label>
                </div>
            )}
        </>
    );
};

export default Create;
