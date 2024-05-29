import { useFormik } from "formik";
import { FunctionComponent, useState } from "react";
import { feedbackService } from "../services/feedbackService";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import User from "../interfaces/User";
import { userService } from "../services/userService";

interface ForgotPasswordProps {}

const ForgotPassword: FunctionComponent<ForgotPasswordProps> = () => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    const formik1 = useFormik({
        initialValues: { email: "" },
        validationSchema: yup.object({
            email: yup.string().email().required(),
        }),
        onSubmit: async (values: any) => {
            const user: any = await feedbackService.promiseToast(
                userService.getUserByEmail,
                "User found",
                values.email
            );
            if (user) setUser(user);
            else feedbackService.errorMsg("User not found");
        },
    });

    const formik2 = useFormik({
        initialValues: { password: "", confirmPassword: "" },
        validationSchema: yup.object({
            password: yup
                .string()
                .required()
                .min(8)
                .matches(
                    /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
                    "Password must contain at least 8 characters, one uppercase, one number and one special case character(!@#$%^&*()-_=+{};:,<.>)"
                ),
            confirmPassword: yup
                .string()
                .required()
                .min(8)
                .matches(
                    /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
                    "Password must contain at least 8 characters, one uppercase, one number and one special case character(!@#$%^&*()-_=+{};:,<.>)"
                ),
        }),
        onSubmit: async (values: any) => {
            if (values.password === values.confirmPassword) {
                const data = {
                    userId: (user as User)._id,
                    password: values.password,
                };
                await userService.updateUserPassword(data);
                feedbackService.successMsg("Password updated successfully");
                navigate("/login");
            } else feedbackService.errorMsg("Passwords do not match");
        },
    });

    return (
        <>
            {!user ? (
                <div className="flex justify-center">
                    <div>
                        <div className="flex-1 flex flex-col">
                            <h2 className="mt-4 text-center text-6xl billabong">Microgram</h2>

                            <form className="pt-7 w-52" onSubmit={formik1.handleSubmit}>
                                <div className="flex">
                                    <small className="m-0 text-gray-500">Enter your email</small>
                                </div>
                                <div className="mt-2">
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="Email"
                                        className="bg-[#FAFAFA] w-full rounded-[3px] py-1.5 ring-1 ring-gray-300 placeholder:text-gray-40 ps-1 "
                                        value={formik1.values.email}
                                        onInput={formik1.handleChange}
                                        onBlur={formik1.handleBlur}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="mt-3 font-bold w-full justify-center rounded login-bg px-3 py-1.5 text-sm text-white disabled:bg-sky-300"
                                    disabled={!(formik1.isValid && formik1.dirty)}>
                                    Enter
                                </button>
                            </form>

                            <p className="mt-16 text-center text-gray-500">
                                <Link
                                    to={"/login"}
                                    className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                                    Move to login
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex justify-center">
                    <div>
                        <div className="flex-1 flex flex-col">
                            <h2 className="mt-4 text-center text-6xl billabong">Microgram</h2>
                            <h2 className="mt-4 text-center text-2xl">{user?.fullname}</h2>

                            <form className="pt-7 w-52" onSubmit={formik2.handleSubmit}>
                                <div className="flex">
                                    <small className="m-0 text-gray-500">Enter new password</small>
                                </div>
                                <div className="mt-1">
                                    <input
                                        name="password"
                                        type="password"
                                        placeholder="Password"
                                        className="bg-[#FAFAFA] w-full rounded-[3px] py-1.5 ring-1 ring-gray-300 placeholder:text-gray-40 ps-1 "
                                        value={formik2.values.password}
                                        onInput={formik2.handleChange}
                                        onBlur={formik2.handleBlur}
                                    />
                                </div>
                                <div className="flex mt-3">
                                    <small className="m-0 text-gray-500">Re-enter password</small>
                                </div>
                                <div className="mt-1">
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Confirm password"
                                        className="bg-[#FAFAFA] w-full rounded-[3px] py-1.5 ring-1 ring-gray-300 placeholder:text-gray-40 ps-1 "
                                        value={formik2.values.confirmPassword}
                                        onInput={formik2.handleChange}
                                        onBlur={formik2.handleBlur}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="mt-3 font-bold w-full justify-center rounded login-bg px-3 py-1.5 text-sm text-white disabled:bg-sky-300"
                                    disabled={!(formik2.isValid && formik2.dirty)}>
                                    Update
                                </button>
                            </form>

                            <p className="mt-16 text-center text-gray-500">
                                <Link
                                    to={"/login"}
                                    className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                                    Move to login
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ForgotPassword;
