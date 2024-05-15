const postsService = require('./posts.service');

async function getPosts(req, res) {
    try {
        let posts;
        const { userId } = req.query;
        if (userId) posts = await postsService.query(userId)
        else posts = await postsService.query()

        res.json(posts)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

async function getPostById(req, res) {
    try {
        const post = await postsService.getById(req.params.id)
        res.json(post)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

async function addPost(req, res) {
    try {
        const addedPost = await postsService.add(req.body)
        res.json(addedPost)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

async function updatePost(req, res) {
    try {
        const updatedPost = await postsService.update(req.body)
        res.json(updatedPost)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

async function deletePost(req, res) {
    try {
        const message = await postsService.deletePost(req.params.id);

        res.json(message);
    } catch (err) {
        res.status(500).send(err.message)
    }
}

async function addComment(req, res) {
    try {
        const post = await postsService.getById(req.params.id);
        post.comments.push(req.body);
        const updatedPost = await postsService.comment(post);

        res.json(updatedPost);
    } catch (err) {
        res.status(500).send(err.message)
    }
}

async function deleteComment(req, res) {
    try {
        console.log(req.params);
        console.log(req.query);
        const post = await postsService.getById(req.params.id);
        post.comments = post.comments.filter((comment) => comment.commentId !== req.query.commentId);
        const updatedPost = await postsService.comment(post);

        res.json(updatedPost);
    } catch (error) {
        res.status(500).send(error.message)
    }
}

module.exports = {
    getPosts,
    getPostById,
    addPost,
    updatePost,
    deletePost,
    addComment,
    deleteComment
}