const mongoose = require('mongoose');

module.exports = mongoose.model('User', new mongoose.Schema({
    googleId: String,
    username: String,
    pass: String,
    Games: Array
}, {collection: 'users'}));
