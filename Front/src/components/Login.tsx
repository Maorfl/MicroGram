import { useFormik } from "formik";
import * as yup from "yup";
import { FunctionComponent, useEffect } from "react";
import { authService } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import User from "../interfaces/User";
import Signin from "../interfaces/Signin";
import { useDispatch, useSelector } from "react-redux";
import { PostActionType } from "../redux/PostState";
import { UserActionType } from "../redux/UserState";
import { feedbackService } from "../services/feedbackService";

interface LoginProps {}

const Login: FunctionComponent<LoginProps> = () => {
    const loggedUser: User | null = authService.getLoggedInUser();
    const user: User = useSelector((state: any) => state.userState.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (loggedUser != null) {
            dispatch({ type: PostActionType.SetHeaderType, payload: "" });
            navigate("/", { state: { isLoggedIn: true } });
        }
    }, [user]);

    const formik = useFormik({
        initialValues: { username: "", password: "" },
        validationSchema: yup.object({
            username: yup.string().required().min(3),
            password: yup.string().required().min(8),
        }),
        onSubmit: async (values: Signin) => {
            const user: any = await feedbackService.promiseLoginToast(authService.login, values);
            dispatch({ type: UserActionType.SetUser, payload: user });
            dispatch({ type: PostActionType.SetHeaderType, payload: "" });
            navigate("/");
        },
    });

    return (
        <>
            <div className="flex justify-center">
                <div>
                    <div className="flex-1 flex flex-col">
                        <h2 className="mt-7 text-center text-6xl billabong">Microgram</h2>

                        <form className="pt-7 w-52" onSubmit={formik.handleSubmit}>
                            <div className="mt-2">
                                <input
                                    name="username"
                                    type="username"
                                    autoComplete="username"
                                    placeholder="Username"
                                    className="bg-[#FAFAFA] w-full rounded-[3px] py-1.5 ring-1 ring-gray-300 placeholder:text-gray-40 ps-1 "
                                    value={formik.values.username}
                                    onInput={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.username && formik.errors.username && (
                                    <p>
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
                                    className="bg-[#FAFAFA] w-full rounded-[3px] py-1.5 ring-1 ring-gray-300 placeholder:text-gray-40 ps-1"
                                    value={formik.values.password}
                                    onInput={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.password && formik.errors.password && (
                                    <p>
                                        <small className="text-danger">{formik.errors.password}</small>
                                    </p>
                                )}
                            </div>

                            <div className="mt-3 flex place-content-end">
                                <div className="text-sm">
                                    <Link
                                        to={"/forgot"}
                                        className="font-semibold text-indigo-600 hover:text-indigo-500">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="mt-3 font-bold w-full justify-center rounded login-bg px-3 py-1.5 text-sm text-white disabled:bg-sky-300"
                                disabled={!(formik.isValid && formik.dirty)}>
                                Log in
                            </button>
                        </form>

                        <p className="mt-10 text-center text-sm text-gray-500">
                            Don't have an account?
                            <Link
                                to={"/signup"}
                                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                                {" "}
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
