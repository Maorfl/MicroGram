const express = require('express');
const { getPosts, getPostById, addPost, updatePost, deletePost, addComment, deleteComment } = require('./posts.controller');
const { requireAuth } = require('../../middlewares/requireAuth.middleware')

const router = express.Router();

router.get('/', getPosts)
router.get('/:id', getPostById)
router.post('/', requireAuth, addPost)
router.put('/:id', requireAuth, updatePost)
router.delete('/:id', requireAuth, deletePost)
router.post('/:id/comments', requireAuth, addComment)
router.delete('/:id/comments', requireAuth, deleteComment)


module.exports = router