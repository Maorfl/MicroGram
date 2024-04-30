const mongoose = require('mongoose');

const minUserSchema = new mongoose.Schema({
    _id: false,
    id: String,
    username: { type: String, required: true, minLength: 3 },
    imgUrl: { type: String, required: false },
    fullname: { type: String, required: true, minLength: 3 }
});

const locationSchema = new mongoose.Schema({
    _id: false,
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    name: { type: String, required: true }
});

const innerCommentSchema = new mongoose.Schema({
    _id: false,
    commentId: { type: String, required: true },
    by: minUserSchema,
    txt: { type: String, required: true },
    likedBy: [String],
    createdAt: { type: Number, required: true }
})

const commentSchema = new mongoose.Schema({
    _id: false,
    commentId: { type: String, required: true },
    by: minUserSchema,
    txt: { type: String, required: true },
    likedBy: [String],
    createdAt: { type: Number, required: true },
    comments: [innerCommentSchema]
})

const postSchema = new mongoose.Schema({
    txt: { type: String},
    imgUrl: { type: String, required: true },
    createdAt: { type: Number, required: true },
    by: { type: minUserSchema, required: true },
    loc: { type: locationSchema, required: false },
    comments: [{ type: commentSchema }],
    likedBy: [{ type: String }],
    tags: [{ type: String }]
});

const Post = mongoose.model('posts', postSchema);

module.exports = Post;