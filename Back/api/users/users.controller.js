const userService = require('./users.service')
const authsService = require('../auths/auths.service')
const _ = require("lodash");


async function getUsers(req, res) {
    try {
        const filterBy = req.body.filter || '';
        const users = await userService.query(filterBy)
        if (!users.length) return res.status(404).send("No users available!");
        res.send(users)
    } catch (err) {
        res.status(400).send(err.message)
    }
}

async function getUser(req, res) {
    try {
        const user = await userService.getById(req.params.id)
        if (!user) return res.status(404).send("User does not exist!");
        
        res.status(200).send(user)
    } catch (err) {
        res.status(400).send(err.message)
    }
}

async function getUserByEmail(req,res) {
    try {
        const user = await userService.getUserByEmail(req.params.email)
        if (!user) return res.status(404).send("User does not exist!");
        
        res.status(200).send(user)
    } catch (err) {
        res.status(400).send(err.message)
    }
}

async function updateUser(req, res) {
    try {
        const savedUser = await userService.update(req.body)
        if (req.loggedinUser._id === savedUser._id.toString()) authsService.setUserToken(res, savedUser);
        res.status(200).send(savedUser)
    } catch (err) {
        res.status(400).send(err.message)
    }
}

async function getUserPassword(req, res) {
    try {
        const password = await userService.getUserPassword(req.params.id)
        res.status(200).send(password)
    } catch (err) {
        res.status(400).send(err.message)
    }
}

async function updateUserPassword(req, res) {
    try {
        const loggedinUserId = req.loggedinUser._id;
        await userService.updateUserPassword(req.body, loggedinUserId);
        res.status(200).send('Password updated successfully');
    } catch (err) {
        res.status(400).send(err.message)
    }
}

async function deleteUser(req, res) {
    try {
        await userService.deleteUser(req.params.id)
        res.status(200).send('User deleted successfully');
    } catch (err) {
        res.status(400).send(err.message)
    }
}

module.exports = {
    getUsers,
    getUser,
    getUserByEmail,
    updateUser,
    getUserPassword,
    updateUserPassword,
    deleteUser
}