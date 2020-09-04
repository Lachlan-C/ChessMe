const mongoose = require('mongoose');

module.exports = mongoose.model('Game', new mongoose.Schema({
    gameID: Number,
    startDate: Date,
    gameData: String
}));
