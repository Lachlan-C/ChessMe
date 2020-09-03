
// DISCUSS WHETHER TO MERGE WITH MOVE_VALIDATION: CHANGES DATA STRUCTURE/COMPLEXITY.


const mqtt = require('mqtt');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const {MONGO_URL} = process.env;
const {PORT} = process.env;
const {BROKER} = process.env;
const {SUBSCRIBE_PATH} = process.env;
const {MOVE_VALID_URL} = process.env;

const app = express();

mongoose.connect(MONGO_URL, {useNewUrlParser:true, useUnifiedTopology:true});

const user = require(`./models/user`);
const game = require(`./models/game`);

app.use(express.static('public'));
app.use((req,res,next)=> {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers","Origin, X-RequestedWith, Content-Type, Accept");
    next();
});

const port = PORT || 5002;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const client = mqtt.connect(BROKER);

app.post('/validate/move', (req,res)=> {

    //Posts to External Device

    const gameId = req.gameId;
    const legality = req.move;

    client.publish(`/${gameId}`, {move: legality}, () => {
        res.send('Published move legality.'); //This can be taken out and is used for testing.
    });
});

client.on('message', (topic, message) => {
    console.log('received data!');
    if (topic == SUBSCRIBE_PATH) {
        gameId = message.gameId;
        move = message.move;

        app.put(`${MOVE_VALID_URL}/validate/move`, (req) => {

        });
    }
})



