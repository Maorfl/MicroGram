const authsService = require("./auths.service");

async function login(req, res) {
    try {
        const { username, password } = req.body;
        const user = await authsService.login(username, password);
        const loginToken = authsService.getLoginToken(user);
        res.cookie("loginToken", loginToken, { maxAge: 86400000, HttpOnly: true });

        res.json(user);
    } catch (err) {
        res.status(400).send(err.message);
    }
}

async function signup(req, res) {
    try {
        const { username, password, email, fullname, gender } = req.body;
        await authsService.signup(username, password, email, fullname, gender);

        const user = await authsService.login(username, password);

        const loginToken = authsService.getLoginToken(user);
        res.cookie("loginToken", loginToken, { maxAge: 86400000, HttpOnly: true });
        res.json(user);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

async function logout(req, res) {
    try {
        res.clearCookie("loginToken");
        res.send({ msg: "Logged out successfully" });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

module.exports = {
    login,
    signup,
    logout,
};
