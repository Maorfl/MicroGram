const Post = require('../../models/Post');
const validationService = require('../../services/validation.service');

async function query(userId = null) {
    try {
        let posts;
        if (userId) {
            posts = await Post.find({ "by.id": userId }).sort({ createdAt: -1 });
        }
        else posts = getRandomPosts();
        return posts
    } catch (err) {
        throw err
    }
}

async function getById(postId) {
    try {
        const post = await Post.findById(postId);
        return post
    } catch (err) {
        throw err
    }
}

async function add(post) {
    try {
        if (post.txt){
            post.txt = validationService.validateText(post.txt);
            const { error } = validationService.validatePost(post)
            if (error) return Promise.reject("Invalid data provided");
        }
        const newPost = new Post({...post});

        return await newPost.save();
    } catch (error) {
        throw error;
    }
}

async function update(post) {
    try {
        post.txt = validationService.validateText(post.txt);
        const postToSave = await Post.findOneAndUpdate({ _id: post._id }, post, { new: true });
        return postToSave
    } catch (err) {
        throw err
    }
}

async function deletePost(loggedinUser, postId) {
    try {
        const post = await Post.findById(postId);
        if (loggedinUser._id.$oid === post.by.id || loggedinUser.isAdmin) {
            await Post.deleteOne(({ _id: postId }));
            return `Post - ${postId} has been deleted!`;
        }
        else throw new Error("Not authorized to delete post");
    } catch (error) {
        throw error
    }
}

async function getRandomPosts(numRandomPosts = 10) {
    try {
        const randomPosts = await Post.aggregate([
            { $sample: { size: numRandomPosts } }
        ]);

        return randomPosts;
    } catch (error) {
        throw new Error('Error fetching random posts: ' + error.message);
    }
}

module.exports = {
    query,
    getById,
    add,
    update,
    deletePost
}