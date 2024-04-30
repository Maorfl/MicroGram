const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');


const app = express();
// const http = require('http').createServer(app) ---- socket


mongoose
  .connect("mongodb+srv://maorfl:M0301f1644@maor-cluster.yi54khe.mongodb.net/MicroGram")
  .then((res) => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'public')))
} else {
  app.use(function (req, res, next) {
    const origin = req.get('Origin') || 'http://localhost:3000';
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });
}

const usersRoutes = require('./api/users/users.routes');
const authsRoutes = require('./api/auths/auths.routes');
const postsRoutes = require('./api/posts/posts.routes');
const storiesRoutes = require('./api/stories/stories.routes');
const chatsRoutes = require('./api/chats/chats.routes');
const reelsRoutes = require('./api/reels/reels.routes');


app.use('/api/users', usersRoutes)
app.use('/api/auths', authsRoutes)
app.use('/api/posts', postsRoutes)
app.use('/api/stories', storiesRoutes)
app.use('/api/chats', chatsRoutes);
app.use('/api/reels', reelsRoutes);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server started on port", port));
