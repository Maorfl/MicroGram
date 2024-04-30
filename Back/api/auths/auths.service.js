const User = require('../../models/User');
const validationService = require('../../services/validation.service')
const jwt = require("jsonwebtoken");
const userService = require('../users/users.service');
const _ = require('lodash');

const jwtKey = "dev";

async function login(username, password) {
    try {
        const { error } = validationService.validateLogin({ username, password });
        if (error) throw new Error('Invalid username or password')

        const user = await User.findOne({ username: { $regex: username, $options: 'i' } })
        if (!user) throw new Error('Invalid username or password')

        jwt.verify(user.password,'dev');

        return _.pick(user, ["_id",
            "username",
            "imgUrl",
            "fullname",
            "email",
            "gender",
            "description",
            "createdAt",
            "following",
            "followers",
            "savedPosts",
            "highlights",
            "posts",
            "reels",
            "stories",
            "chats",
            "notifications",
            "blocked",
            "isAdmin"])
    } catch (error) {
        throw error;
    }
}

async function signup(username, password, email, fullname, gender) {
    try {
        const existingUser = await User.findOne({
            $or: [
                { username: { $regex: username, $options: 'i' } },
                { email: { $regex: email, $options: 'i' } }
            ]
        });
        if (existingUser) {
            throw new Error("User already exists!");
        }

        const passwordToken = jwt.sign(password, jwtKey);

        const newUser = await userService.add({ username, password: passwordToken, fullname, email, gender });

        return _.pick(newUser, ["_id",
            "username",
            "imgUrl",
            "fullname",
            "email",
            "gender",
            "description",
            "createdAt",
            "following",
            "followers",
            "savedPosts",
            "highlights",
            "posts",
            "reels",
            "stories",
            "chats",
            "notifications",
            "blocked",
            "isAdmin"]);
    } catch (error) {
        throw error;
    }
}

function getLoginToken(user) {
    const token = jwt.sign({
        _id: user._id,
        username: user.username,
        imgUrl: user.imgUrl,
        fullname: user.fullname,
        email: user.email,
        gender: user.gender,
        description: user.description,
        createdAt: user.createdAt,
        following: user.following,
        followers: user.followers,
        savedPosts: user.savedPosts,
        highlights: user.highlights,
        posts: user.posts,
        reels: user.reels,
        stories: user.stories,
        chats: user.chats,
        blocked: user.blocked,
        notifications: user.notifications,
        isAdmin: user.isAdmin
    }, jwtKey);
    return token;
}

function setUserToken(res,user){
    const loginToken = getLoginToken(user);
    res.cookie("loginToken", loginToken, { maxAge: 86400000, HttpOnly: true });
}

module.exports = {
    login,
    signup,
    getLoginToken,
    setUserToken
}