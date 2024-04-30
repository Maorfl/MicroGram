const joi = require('joi');
const jwt = require("jsonwebtoken");

const jwtKey = "dev";

const validateUser = (userData) => {
    const userJoiSchema = joi.object({
        _id: joi.object({
            "$oid": joi.string().required()
        }),
        username: joi.string().required().min(3),
        imgUrl: joi.string(),
        fullname: joi.string().required(),
        email: joi.string().required().email(),
        gender: joi.string().required(),
        description: joi.string(),
        password: joi.string().required().regex(/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/),
        createdAt: joi.number().required(),
        following: joi.array().items(joi.string()),
        followers: joi.array().items(joi.string()),
        savedPosts: joi.array().items(joi.string()),
        highlights: joi.array().items(joi.string()),
        posts: joi.array().items(joi.string()),
        stories: joi.array().items(joi.string()),
        chats: joi.array().items(joi.string()),
        notifications: joi.array().items(joi.string()),
        blocked: joi.array().items(joi.string()),
        isAdmin: joi.boolean().required()
    });

    return userJoiSchema.validate(userData);
};

const validateLogin = (loginData) => {
    const loginSchema = joi.object({
        username: joi.string().required().min(3),
        password: joi.string().required().min(8).regex(/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/)
    });

    return loginSchema.validate(loginData);
};

const locationSchema = joi.object({
    lat: joi.number().required(),
    lng: joi.number().required(),
    name: joi.string().required()
});

const minUserSchema = joi.object({
    id: joi.string(),
    username: joi.string().required().min(3),
    imgUrl: joi.string().optional(),
    fullname: joi.string().required().min(3)
});

const innerCommentSchema = joi.object({
    commentId: joi.string().required(),
    by: minUserSchema.required(),
    txt: joi.string().required(),
    likedBy: joi.array().items(joi.string()),
    createdAt: joi.number().required()
});

const commentSchema = joi.object({
    commentId: joi.string().required(),
    by: minUserSchema.required(),
    txt: joi.string().required(),
    likedBy: joi.array().items(joi.string()),
    createdAt: joi.number().required(),
    comments: joi.array().items(innerCommentSchema)
});

const validatePost = (postData) => {
    const postSchema = joi.object({
        txt: joi.string().required(),
        imgUrl: joi.string().required(),
        createdAt: joi.number().required(),
        by: minUserSchema.required(),
        loc: locationSchema.optional(),
        comments: joi.array().items(commentSchema),
        likedBy: joi.array().items(minUserSchema),
        tags: joi.array().items(joi.string())
    });

    return postSchema.validate(postData);
}

const validateText = (text) => {
    text = text.replace(/[&<>"'/]/g, function (match) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;',
            '/': '&#x2F;'
        }[match];
    });

    return text;
}

const validateToken = (token) => {
    return jwt.verify(token, jwtKey)
}


module.exports = {
    validateUser,
    validateLogin,
    validatePost,
    validateText,
    validateToken
}

