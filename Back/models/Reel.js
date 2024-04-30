const mongoose = require('mongoose');
const minUserSchema = new mongoose.Schema({
    _id: false,
    id: String,
    username: { type: String, required: true, minLength: 3 },
    imgUrl: { type: String, required: false },
    fullname: { type: String, required: true, minLength: 3 }
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
const postedBySchema = new mongoose.Schema({
    _id: false,
    id: { type: String, required: true },
    avatar: { type: String, required: true },
    name: { type: String, required: true }
});

const reelSchema = new mongoose.Schema({
    reel: {
        reelInfo: {
            url: { type: String, required: true },
            type: { type: String, required: true },
            description: { type: String },
            postedBy: { type: postedBySchema },
            likes: {
                count: { type: Number }
            },
            dislikes: {
                count: { type: Number }
            },
            comments: {
                count: { type: Number }
            },
            shares: {
                count: { type: Number }
            }
        },
        createdAt: { type: Number, required: true }
    },
    likedBy: { type: [String] },
    dislikedBy: { type: [String] },
    commentsArray: { type: [commentSchema] }
});


const Reel = mongoose.model('reels', reelSchema);

module.exports = Reel;
