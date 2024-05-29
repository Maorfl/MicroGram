const User = require('../../models/User');
const jwt = require("jsonwebtoken");

module.exports = {
    query,
    getById,
    getUserByEmail,
    update,
    add,
    getUserPassword,
    updateUserPassword,
    deleteUser
}

async function query(filter) {
    try {
        const users = await User.find({
            $or: [
                { username: { $regex: filter, $options: 'i' } },
                { fullname: { $regex: filter, $options: 'i' } },
            ]
        }).select('-password').sort({ username: -1 });

        return users;
    } catch (error) {
        throw Error('Could not get users');
    }
}

async function getById(userId) {
    try {
        const user = await User.findById(userId);
        return user
    } catch (error) {
        throw Error('Could not get user');
    }
}

async function getUserByEmail(email) {
    try {
        const user = await User.findOne({ email: email });
        return user
    } catch (error) {
        throw Error('Could not get user');
    }
}

async function update(user) {
    
    try {
        const { error } = User.validate(user);
        if (error) throw new Error(error)

        const userToUpdate = await User.findOneAndUpdate(
            {
                _id: user._id
            },
            user,
            { new: true }
        );
        if (!userToUpdate) throw new Error('User not found')

        return userToUpdate;
    } catch (error) {
        throw new Error('Could not get user');
    }
}

async function add(userData) {
    try {
        const user = new User({
            ...userData,
            createdAt: Date.now()
        });

        return await user.save();
    } catch (error) {
        throw new Error('Could not add user');
    }
}

async function updateUserPassword(userData) {
    try {
        const hashedPassword = jwt.sign(userData.password, 'dev');
        const updatedUser = await User.findOneAndUpdate({ _id: userData.userId }, { password: hashedPassword });
        return updatedUser
    } catch (error) {
        throw new Error('Could not update password');
    }
}

async function getUserPassword(userId) {
    try {
        const password = await User.findOne({ _id: userId }).select('password');
        return jwt.decode(password.password);
    } catch (error) {
        throw new Error('Could not get password');
    }
}

async function deleteUser(userId) {
    try {
        await User.findOneAndDelete({ _id: userId });
        return "User deleted successfully";
    } catch (error) {
        throw new Error('Could not delete user');
    }
}
