const Story = require('../../models/Story');
const usersService = require('../users/users.service');

async function getStories(userId, is24) {
    try {
        let stories;
        if (!is24) stories = await Story.find({ "by.id": userId }).sort({ createdAt: -1 });
        else {
            const twentyFourHoursAgo = new Date();
            twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

            stories = await Story.find({
                "by.id": userId,
                createdAt: { $gte: twentyFourHoursAgo }
            }).sort({ createdAt: -1 });
        }

        return stories
    } catch (err) {
        throw err;
    }
}

async function getById(storyId) {
    try {
        const story = await Story.findById(storyId);
        return story
    } catch (err) {
        throw err
    }
}

async function add(storyData, user) {
    try {
        const createdAt = Date.now();
        const by = {
            id: user._id.$oid,
            fullname: user.fullname,
            imgUrl: user.imgUrl,
            username: user.username
        }

        let newStory = new Story({ ...storyData, createdAt, by });
        newStory = await newStory.save();

        user.stories.push(newStory._id)
        await usersService.update(user)

        return newStory;
    } catch (error) {
        throw error
    }
}

async function deleteStory(loggedinUser, storyId) {
    try {
        const story = await Story.findById(storyId);
        if (loggedinUser._id === story.by.id || loggedinUser.isAdmin) {
            await Story.deleteOne(({ _id: storyId }));
            return `Story - ${storyId} has been deleted!`;
        }
        else throw new Error("Not authorized to delete story");
    } catch (error) {
        throw error
    }
}

module.exports = {
    getStories,
    getById,
    add,
    deleteStory
}