import { useFormik } from "formik";
import { FunctionComponent, useEffect, useState } from "react";
import { authService } from "../services/authService";
import * as yup from "yup";
import { userService } from "../services/userService";
import User from "../interfaces/User";
import { useDispatch } from "react-redux";
import { PostActionType } from "../redux/PostState";
import { UserActionType } from "../redux/UserState";
import { useNavigate } from "react-router-dom";
import { feedbackService } from "../services/feedbackService";
import { uploadImg } from "../services/uploadService";

interface EditProfileProps {}

const EditProfile: FunctionComponent<EditProfileProps> = () => {
    const loggedUser = authService.getLoggedInUser();
    const [file, setFile] = useState<File | null>(null);
    const [picture, setPicture] = useState<string>("");
    const [selectedGender, setSelectedGender] = useState<string>("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            fullname: loggedUser?.fullname,
            username: loggedUser?.username,
            description: loggedUser?.description,
            gender: loggedUser?.gender,
        },
        enableReinitialize: true,
        validationSchema: yup.object({
            fullname: yup.string().required().min(3),
            username: yup.string().required().min(3),
            description: yup.string().min(3),
            gender: yup.string().required(),
        }),
        onSubmit: async (values) => {
            let url = null;
            if (file) url = await uploadImg(file as File);

            const updatedUser = {
                ...(loggedUser as User),
                fullname: values.fullname as string,
                username: values.username as string,
                description: values.description as string,
                gender: values.gender as string,
                imgUrl: url ? url.url : picture,
            };
            dispatch({ type: PostActionType.SetHeaderType, payload: "profile" });
            dispatch({ type: UserActionType.SetUser, payload: updatedUser });
            await feedbackService.promiseToast(userService.updateUser, "Profile updated successfully", updatedUser);
            navigate("/profile");
        },
    });

    const handleImageUpload = async (e: any) => {
        const selectedPicture = e.target.files?.[0];
        if (selectedPicture) {
            setFile(selectedPicture);
            feedbackService.successMsg("Image uploaded successfully");
        }
    };

    useEffect(() => {
        setSelectedGender(loggedUser?.gender as string);
        setPicture(loggedUser?.imgUrl as string);
    }, []);

    return (
        <>
            <div className="w-full">
                <div className="flex justify-center mt-1">
                    <label htmlFor="image-upload" className="cursor-pointer m-0 text-[#0095f6] font-semibold">
                        <div>
                            {file ? (
                                <img src={URL.createObjectURL(file)} alt="User image" className="rounded-image-lg" />
                            ) : (
                                <img src={picture} alt="User image" className="rounded-image-lg" />
                            )}
                        </div>
                        Edit picture
                        <input
                            id="image-upload"
                            style={{ opacity: 0, position: "absolute", display: "none" }}
                            type="file"
                            multiple={false}
                            capture="environment"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e)}
                        />
                    </label>
                </div>
                <div className="flex justify-center">
                    <form className="w-96 px-2 flex flex-col" onSubmit={formik.handleSubmit}>
                        <div className="form-floating mb-2">
                            <input
                                type="text"
                                className="form-control border-t-0 border-s-0 border-e-0 focus:ring-0"
                                id="floatingName"
                                placeholder="fullname"
                                value={formik.values.fullname}
                                name="fullname"
                                onChange={formik.handleChange}
                            />
                            <label htmlFor="floatingName" className="text-[#7c7c7c]">
                                Name
                            </label>
                        </div>
                        <div className="form-floating mb-2">
                            <input
                                type="text"
                                className="form-control border-t-0 border-s-0 border-e-0 focus:ring-0"
                                id="floatingUsername"
                                placeholder="Username"
                                value={formik.values.username}
                                name="username"
                                onChange={formik.handleChange}
                            />
                            <label htmlFor="floatingUsername" className="text-[#7c7c7c]">
                                Username
                            </label>
                        </div>
                        <div className="form-floating mb-2">
                            <input
                                type="text"
                                className="form-control border-t-0 border-s-0 border-e-0 focus:ring-0"
                                id="floatingDescription"
                                placeholder="Description"
                                value={formik.values.description}
                                name="description"
                                onChange={formik.handleChange}
                            />
                            <label htmlFor="floatingDescription" className="text-[#7c7c7c]">
                                Bio
                            </label>
                        </div>
                        <div className="ms-1 pb-3 border-b">
                            <p className="m-0 text-[#7c7c7c] mb-1">Gender</p>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="gender"
                                    id="femaleRadio"
                                    value={"Female"}
                                    checked={selectedGender === "Female"}
                                    onChange={(e) => setSelectedGender(e.target.value)}
                                />
                                <label className="form-check-label" htmlFor="femaleRadio">
                                    Female
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="gender"
                                    id="maleRadio"
                                    value={"Male"}
                                    checked={selectedGender === "Male"}
                                    onChange={(e) => setSelectedGender(e.target.value)}
                                />
                                <label className="form-check-label" htmlFor="maleRadio">
                                    Male
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="gender"
                                    id="preferRadio"
                                    value={"Prefer not to say"}
                                    checked={selectedGender === "Prefer not to say"}
                                    onChange={(e) => setSelectedGender(e.target.value)}
                                />
                                <label className="form-check-label" htmlFor="preferRadio">
                                    Prefer not to say
                                </label>
                            </div>
                        </div>
                        <div
                            className="border-b py-3 font-medium text-[#0095f6]"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate("/profile/edit-profile/personal-info");
                            }}>
                            Personal information settings
                        </div>
                        <button
                            type="submit"
                            className="flex border-b font-medium text-[#0095f6] text-xl py-3 justify-center">
                            Save
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditProfile;
