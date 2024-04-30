const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, minLength: 3, unique: true },
    fullname: { type: String, required: true, minLength: 3 },
    email: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    imgUrl: { type: String, required: false },
    description: { type: String, required: false },
    password: { type: String, required: false },
    createdAt: { type: Number, required: true },
    following: [{ type: String }],
    followers: [{ type: String }],
    savedPosts: [{ type: String }],
    highlights: [{ type: String }],
    posts: [{ type: String }],
    reels: [{ type: String }],
    stories: [{ type: String }],
    chats: [{ type: String }],
    notifications: [{ type: String }],
    blocked: [{ type: String }],
    isAdmin: { type: Boolean }
});

const User = mongoose.model('users', userSchema);

module.exports = User;