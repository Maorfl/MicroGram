import { useFormik } from "formik";
import { FunctionComponent, useState } from "react";
import * as yup from "yup";
import Signup from "../interfaces/Signup";
import { authService } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { UserActionType } from "../redux/UserState";
import { PostActionType } from "../redux/PostState";
import { feedbackService } from "../services/feedbackService";

interface SignUpProps {}

const SignUp: FunctionComponent<SignUpProps> = () => {
    const [selectedGender, setSelectedGender] = useState<string>("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: { username: "", password: "", email: "", fullname: "", gender: "" },
        validationSchema: yup.object({
            username: yup.string().required().min(3).max(20),
            password: yup
                .string()
                .required()
                .min(8)
                .matches(
                    /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
                    "Password must contain at least 8 characters, one uppercase, one number and one special case character(!@#$%^&*()-_=+{};:,<.>)"
                ),
            email: yup.string().email().required(),
            fullname: yup.string().required().min(3),
        }),
        onSubmit: async (values: Signup) => {
            const user = await feedbackService.promiseToast(authService.signup, "Account created successfully", {
                ...values,
                gender: selectedGender,
            });
            dispatch({ type: UserActionType.SetUser, payload: user });
            dispatch({ type: PostActionType.SetHeaderType, payload: "" });
            navigate("/");
        },
    });
    return (
        <>
            <div className="flex justify-center">
                <div>
                    <div className="flex flex-col pt-9 w-full">
                        <h2 className="text-center text-6xl billabong">Register</h2>

                        <form onSubmit={formik.handleSubmit} className="mt-7 w-52">
                            <div className="mt-2">
                                <input
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    placeholder="Username"
                                    className="bg-[#FAFAFA] w-full rounded-[3px] py-1.5 text-gray-900 ring-1 ring-gray-300 placeholder:text-gray-400 ps-1"
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.username && formik.errors.username && (
                                    <p className="m-0">
                                        <small className="text-danger">{formik.errors.username}</small>
                                    </p>
                                )}
                            </div>
                            <div className="mt-2">
                                <input
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    className="bg-[#FAFAFA] w-full rounded-[3px] py-1.5 text-gray-900 ring-1 ring-gray-300 placeholder:text-gray-400 ps-1"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.password && formik.errors.password && (
                                    <p className="m-0">
                                        <small className="text-danger">{formik.errors.password}</small>
                                    </p>
                                )}
                            </div>
                            <div className="mt-2">
                                <input
                                    name="email"
                                    type="email"
                                    autoComplete="current-email"
                                    placeholder="Email"
                                    className="bg-[#FAFAFA] w-full rounded-[3px] py-1.5 text-gray-900 ring-1 ring-gray-300 placeholder:text-gray-400 ps-1"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <p className="m-0 text-wrap">
                                        <small className="text-danger">{formik.errors.email}</small>
                                    </p>
                                )}
                            </div>
                            <div className="mt-2">
                                <input
                                    name="fullname"
                                    type="text"
                                    autoComplete="current-fullname"
                                    placeholder="Full Name"
                                    className="bg-[#FAFAFA] w-full rounded-[3px] py-1.5 text-gray-900 ring-1 ring-gray-300 placeholder:text-gray-400 ps-1"
                                    value={formik.values.fullname}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.fullname && formik.errors.fullname && (
                                    <p className="m-0 text-wrap">
                                        <small className="text-danger">{formik.errors.fullname}</small>
                                    </p>
                                )}
                            </div>
                            <div className="mt-2 ms-1 pb-3 border-b">
                                <p className="m-0 text-[#7c7c7c] mb-1">Gender</p>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="gender"
                                        id="femaleRadio"
                                        value={"Female"}
                                        checked={selectedGender === "Female"}
                                        onChange={(e) => {
                                            setSelectedGender(e.target.value);
                                        }}
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
                                        onChange={(e) => {
                                            setSelectedGender(e.target.value);
                                            formik.handleChange;
                                        }}
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
                                        onChange={(e) => {
                                            setSelectedGender(e.target.value);
                                        }}
                                    />
                                    <label className="form-check-label" htmlFor="preferRadio">
                                        Prefer not to say
                                    </label>
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="mt-4 font-bold w-full justify-center rounded login-bg py-2 text-sm text-white disabled:bg-sky-300"
                                    disabled={!(formik.isValid && formik.dirty)}>
                                    Sign up
                                </button>
                            </div>
                        </form>
                    </div>

                    <div>
                        <p className="mt-6 text-center text-sm text-gray-500">
                            Already have an account?
                            <Link to={"/login"} className="font-semibold leading-6 text-indigo-600">
                                {" "}
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUp;
