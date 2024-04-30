const validationService = require('../services/validation.service')
const chatService = require('../api/chats/chats.service')

async function requireAuth(req, res, next) {
    if (!req.cookies.loginToken) return res.status(401).send('Not Authenticated!')
    const loggedinUser = validationService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Not Authenticated')
    req.loggedinUser = loggedinUser
    next()
}

async function authenticateChatParticipant(req, res, next) {
    try {
        const userId = req.loggedinUser._id;
        const chat = await chatService.getById(req.params.id);

        if (!chat.participators.includes(userId)) {
            return res.status(403).send("You are not in this chat")
        }

        next()
    } catch (error) {
        throw error
    }
}

async function requireAdmin(req, res, next) {
    if (!req.cookies.loginToken) return res.status(401).send('Not Authenticated')
    const loggedinUser = validationService.validateToken(req.cookies.loginToken)
    if (!loggedinUser.isAdmin) {
        res.status(403).send('Not Authorized')
        return
    }
    next()
}


module.exports = {
    requireAuth,
    requireAdmin,
    authenticateChatParticipant
}