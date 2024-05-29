const express = require('express');
const { getUsers, getUser, updateUser,getUserPassword, deleteUser,updateUserPassword, getUserByEmail } = require('./users.controller');
const { requireAuth } = require('../../middlewares/requireAuth.middleware');

const router = express.Router();


router.get('/', getUsers);
router.get('/:id', getUser);
router.get('/forgot/:email', getUserByEmail)
router.get('/:id/password', getUserPassword);
router.put('/:id/password', updateUserPassword);
router.put('/:id', requireAuth, updateUser);
router.delete('/:id', requireAuth, deleteUser);


module.exports = router;