import Signin from "../interfaces/Signin";
import Signup from "../interfaces/Signup";
import User from "../interfaces/User";
import axiosService from "./axiosService";
import { utilService } from "./utilService";


const ENDPOINT = "/auths"

const STORAGE_KEY: string = "userInfo";

export const authService = {
    login,
    getLoggedInUser,
    logout,
    signup
}


async function login(userInfo: Signin): Promise<User> {
    try {
        const loggedInUser: User = await axiosService.post(`${ENDPOINT}/login`, userInfo);
        utilService.saveToSessionStorage(STORAGE_KEY, loggedInUser);
        return loggedInUser
    } catch (error) {
        throw error;
    }
}

function getLoggedInUser(): User | null {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) as string);
}

async function logout(): Promise<void> {
    try {
        sessionStorage.removeItem(STORAGE_KEY);
        await axiosService.post(`${ENDPOINT}/logout`);
    } catch (error) {
        throw new Error("Could not logout");
    }
}

async function signup(userDetails: Signup): Promise<User> {
    try {
        const loggedInUser: User = await axiosService.post(`${ENDPOINT}/signup`, userDetails);
        utilService.saveToSessionStorage(STORAGE_KEY, loggedInUser);
        return loggedInUser;
    } catch (error) {
        throw new Error("Could not signup");
    }
}


