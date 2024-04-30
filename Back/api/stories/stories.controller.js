const storiesService = require('./stories.service');

async function getStories(req, res) {
    {
        try {
            const { userId, is24 } = req.query;
            const stories = await storiesService.getStories(userId, is24);

            res.json(stories);
        } catch (err) {
            res.status(500).send(err.message)
        }
    }
}

async function getStoryById(req, res) {
    try {
        const story = await storiesService.getById(req.params.id)
        res.json(story)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

async function addStory(req, res) {
    try {
        const story = await storiesService.add(req.body, req.loggedinUser);
        res.json(story)
    } catch (err) {
        res.status(500).send(err.message);
    }
}

async function deleteStory(req, res) {
    try {
        const message = await storiesService.deleteStory(req.loggedinUser, req.params.id);

        res.json(message);
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports = {
    getStories,
    getStoryById,
    addStory,
    deleteStory
}
