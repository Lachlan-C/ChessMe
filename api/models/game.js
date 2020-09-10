const mongoose = require('mongoose');

module.exports = mongoose.model('Game', new mongoose.Schema({
    GameID: String,
    DateTimeStart: String,
    DateTimeEnd: String, 
    Users: Array,
    Moves: Array,
    CurrentFen: String,
    Winner: String
}, {collection: 'games'}));
