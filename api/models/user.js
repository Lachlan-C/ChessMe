const mongoose = require('mongoose');

module.exports = mongoose.model('User', new mongoose.Schema({
    googleId: String,
    username: String,
    password: String,
    userID: String,
    boardID: String,
    Games: Array
}, {collection: 'users'}));
