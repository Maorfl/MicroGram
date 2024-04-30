const Reel = require('../../models/Reel');
const validationService = require('../../services/validation.service');
async function query(userId = null) {
    try {
        let reels;
        if (userId) {
            reels = await Reel.find({ "reel.reelInfo.postedBy.id": userId }).sort({ createdAt: -1 });
        }
        else reels = getRandomReels();
        return reels
    } catch (err) {
        throw err
    }
}

async function getRandomReels(numRandomReels = 10) {
    try {
        const randomReels = await Reel.aggregate([
            { $sample: { size: numRandomReels } }
        ]);

        return randomReels;
    } catch (error) {
        throw new Error('Error fetching random reels: ' + error.message);
    }
}

async function add(reel) {
    try {
        const newReel = new Reel({
            ...reel
        })
        return await newReel.save()
    } catch (err) {
        throw err
    }
}

async function update(reel) {
    try {
        await Reel.findOneAndUpdate({ _id: reel._id }, reel)
    } catch (err) {
        throw err
    }
}

async function deleteReel(reelId) {
    try {
        await Reel.findOneAndDelete({ _id: reelId })
    } catch (err) {
        throw err
    }
}

module.exports = {
    query,
    add,
    update,
    deleteReel
}