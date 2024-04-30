const express = require('express');
const { getReels, getReelById, addReel,deleteReel, updateReel } = require('./reels.controller');
const { requireAuth } = require('../../middlewares/requireAuth.middleware')

const router = express.Router();

router.get('/', getReels)
router.get('/:id', getReelById)
router.post('/:id', requireAuth, addReel)
router.put('/:id', requireAuth, updateReel)
router.delete('/:id', requireAuth, deleteReel)


module.exports = router