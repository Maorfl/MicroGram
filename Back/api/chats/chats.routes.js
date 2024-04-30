const express = require('express');
const { getUserChats, addChat, message, deleteMessage } = require('./chats.controller');
const { requireAuth } = require('../../middlewares/requireAuth.middleware');

const router = express.Router();

router.get('/', requireAuth, getUserChats);
router.post('/', requireAuth, addChat);
router.put('/:id', requireAuth, message);
router.delete('/:id', requireAuth, deleteMessage);



module.exports = router;