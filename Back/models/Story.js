const mongoose = require('mongoose');

const minUserSchema = new mongoose.Schema({
    _id: false,
    id: String,
    username: { type: String, required: true, minLength: 3 },
    imgUrl: { type: String, required: false },
    fullname: { type: String, required: true, minLength: 3 }
});

const locationSchema = new mongoose.Schema({
    _id: false,
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    name: { type: String, required: true }
});


const storySchema = new mongoose.Schema({
    imgUrl: { type: [String], required: true },
    by: minUserSchema,
    loc: locationSchema,
    tags: [{ type: String }],
    createdAt: { type: Number, required: true }
});

const Story = mongoose.model('stories', storySchema);

module.exports = Story;
