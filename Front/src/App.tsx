import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./style/App.scss";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import NavBar from "./components/NavBar";
import Search from "./components/Search";
import Profile from "./components/Profile";
import AppHeader from "./components/AppHeader";
import { useEffect, useState } from "react";
import { authService } from "./services/authService";
import useCookie from "./hooks/useCookie";
import { Cookie } from "./types/CookieType";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { UserActionType } from "./redux/UserState";
import { PostActionType } from "./redux/PostState";
import UserChats from "./components/UserChats";
import About from "./components/About";
import ChatDetails from "./components/ChatDetails";
import ReelsComponent from "./components/ReelsComponent";
import EditProfile from "./components/EditProfile";
import { userService } from "./services/userService";
import User from "./interfaces/User";
import PersonalInformationEdit from "./components/PersonalInformationEdit";
import Create from "./components/Create";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./components/ForgotPassword";

function App() {
    let loggedUser = authService.getLoggedInUser();
    const [header, setHeader] = useState<string>("");
    const cookie: Cookie = useCookie("loginToken");
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            if (cookie) {
                loggedUser = jwtDecode(cookie.toString());
                loggedUser = await userService.getUserById((loggedUser as User)._id);
                sessionStorage.setItem("userInfo", JSON.stringify(loggedUser));
                dispatch({ type: PostActionType.SetHeaderType, payload: header });
                dispatch({ type: UserActionType.SetUser, payload: loggedUser });
            } else if (loggedUser) {
                const user = await userService.getUserById(loggedUser._id);
                sessionStorage.setItem("userInfo", JSON.stringify(user));
                dispatch({ type: UserActionType.SetUser, payload: user });
                dispatch({ type: PostActionType.SetHeaderType, payload: header });
            }
        })();
    }, [header]);

    return (
        <Router>
            <ToastContainer />
            <div className="main">
                <AppHeader />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/forgot" element={<ForgotPassword />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/create" element={<Create />} />
                    <Route path="/reels" element={<ReelsComponent />} />
                    <Route path="/profile" element={<Profile />}>
                        <Route path="/profile/:id" element={<Profile />} />
                    </Route>
                    <Route path="/profile/edit-profile" element={<EditProfile />} />
                    <Route path="/profile/edit-profile/personal-info" element={<PersonalInformationEdit />} />
                    <Route path="/chats" element={<UserChats />}>
                        <Route path="/chats/:id" element={<ChatDetails />} />
                    </Route>
                    <Route path="/about" element={<About />} />
                </Routes>
                <NavBar setHeader={setHeader} />
            </div>
        </Router>
    );
}

export default App;
