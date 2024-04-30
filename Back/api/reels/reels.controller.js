const reelsService = require('./reels.service');

async function getReels(req, res) {
    try {
        let reels;
        const { userId } = req.query;
        if (userId) reels = await reelsService.query(userId)
        else reels = await reelsService.query()

        res.json(reels)
    } catch (err) {
        res.status(500).send(err.message)
    }
}
async function getReelById(req, res) {
    try {
        const reel = await reelsService.getById(req.params.id)
        res.json(reel)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

async function addReel(req, res) {
    try {
        const updatedReel = await reelsService.add(req.body)
        res.json(updatedReel)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

async function updateReel(req, res) {
    try {
        await reelsService.update(req.body)
    } catch (err) {
        res.status(500).send(err.message);
    }
}

async function deleteReel(req, res) {
    try {
        await reelsService.deleteReel(req.params.id)
    } catch (error) {
        res.status(500).send(err.message)
    }
}

module.exports = {
    getReels,
    getReelById,
    deleteReel,
    updateReel,
    addReel
}