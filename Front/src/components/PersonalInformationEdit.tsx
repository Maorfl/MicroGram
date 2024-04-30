import { useFormik } from "formik";
import { FunctionComponent, useEffect, useState } from "react";
import { authService } from "../services/authService";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import User from "../interfaces/User";
import { PostActionType } from "../redux/PostState";
import { userService } from "../services/userService";
import { UserActionType } from "../redux/UserState";
import { feedbackService } from "../services/feedbackService";

interface PersonalInformationEditProps {}

const PersonalInformationEdit: FunctionComponent<PersonalInformationEditProps> = () => {
    const loggedUser = authService.getLoggedInUser();
    const [password, setPassword] = useState<string>("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getPassword = async (): Promise<string> => {
        return await userService.getUserPassword(loggedUser?._id as string);
    };

    const handleDelete = async () => {
        const confirmation = prompt(`Type ${loggedUser?.username} to confirm deletion`);
        if (confirmation !== loggedUser?.username) return;

        dispatch({ type: PostActionType.SetHeaderType, payload: "none" });
        await userService.deleteUser(loggedUser?._id as string);
        await authService.logout();
        navigate("/login");
    };

    const formik = useFormik({
        initialValues: {
            email: loggedUser?.email,
            password: password,
        },
        enableReinitialize: true,
        validationSchema: yup.object({
            email: yup.string().email().required(),
            password: yup
                .string()
                .required()
                .min(8)
                .matches(
                    /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
                    "Password must contain at least 8 characters, one uppercase, one number and one special case character(!@#$%^&*()-_=+{};:,<.>)"
                ),
        }),

        onSubmit: async (values) => {
            let updatedUser: any = {
                ...(loggedUser as User),
                email: values.email as string,
            };
            const data = {
                userId: (loggedUser as User)._id,
                password: values.password,
            };
            await userService.updateUserPassword(data);
            dispatch({ type: PostActionType.SetHeaderType, payload: "profile" });
            updatedUser = await feedbackService.promiseToast(
                userService.updateUser,
                "Profile updated successfully",
                updatedUser
            );
            dispatch({ type: UserActionType.SetUser, payload: updatedUser });
            navigate("/profile");
        },
    });

    useEffect(() => {
        (async () => {
            setPassword(await getPassword());
        })();
    }, []);

    return (
        <>
            <div className="bg-[#ebf4fe] w-full h-screen px-3">
                <div className="pb-40"></div>
                <div className="rounded-xl bg-white w-80 p-2 m-auto">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="form-floating mb-2">
                            <input
                                type="email"
                                className="form-control border-t-0 border-s-0 border-e-0 focus:ring-0"
                                id="floatingEmail"
                                placeholder="email"
                                value={formik.values.email}
                                name="email"
                                onChange={formik.handleChange}
                            />
                            <label htmlFor="floatingEmail" className="text-[#7c7c7c]">
                                Email
                            </label>
                        </div>
                        <div className="form-floating">
                            <input
                                type="password"
                                className="form-control border-t-0 border-s-0 border-e-0 focus:ring-0"
                                id="floatingPassword"
                                placeholder="password"
                                value={formik.values.password}
                                name="password"
                                onChange={formik.handleChange}
                            />
                            <label htmlFor="floatingPassword" className="text-[#7c7c7c]">
                                Password
                            </label>
                        </div>
                        <button
                            type="submit"
                            className="flex w-full border-b font-medium text-[#0095f6] text-xl py-4 justify-center">
                            Save
                        </button>
                    </form>
                </div>
                <div className="mt-52 flex justify-center">
                    <div
                        className="w-1/2 flex justify-center m-auto rounded bg-white ring-1 ring-red-600 text-2xl font-semibold text-red-600 p-1"
                        onClick={() => {
                            feedbackService.promiseToast(handleDelete, "Account deleted");
                        }}>
                        Delete account
                    </div>
                </div>
            </div>
        </>
    );
};

export default PersonalInformationEdit;
