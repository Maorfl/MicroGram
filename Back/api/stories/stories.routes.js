const express = require('express');
const { getStories, getStoryById, addStory, deleteStory } = require('./stories.controller');
const { requireAuth } = require('../../middlewares/requireAuth.middleware');

const router = express.Router();

router.get('/', requireAuth, getStories)
router.get('/:id', requireAuth, getStoryById);
router.post('/', requireAuth, addStory);
router.delete('/:id', requireAuth, deleteStory);


module.exports = router;