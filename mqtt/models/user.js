const mongoose = require('mongoose');

module.exports = mongoose.model('User', new mongoose.Schema({
    googleId: String,
    username: String,
    pass: String,
    Games: String, //edit this so that it takes an array of game data -> make a Games Model.
    

}));
