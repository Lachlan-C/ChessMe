const mongoose = require('mongoose');

module.exports = mongoose.model('Game', new mongoose.Schema({
    GameID: String,
    DateTimeStart: Date,
    DateTimeEnd: Date, 
    Users: Array,
    Moves: Array,
    CurrentFen: String,
    Winner: String,
    Difficulty: String
}, {collection: 'games'}));
