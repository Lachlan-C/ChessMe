const mqtt = require('mqtt');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();


const { MONGO_URL, PORT, BROKER, SUBSCRIBE_PATH } = process.env;

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

const port = PORT || 5001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const client = mqtt.connect(BROKER)

//Sends a request to pair the board the user
app.put('/board/pair', (req, res) => {

})

//Sends game topic to board
app.put('/game/connect', (req, res) => {

})

//Connection confirmation
client.on('connect', () => {
    client.subscribe(SUBSCRIBE_PATH, err => {
        if (!err) console.log('Subscribed to main branch.');
    });
});

client.on('message', (topic, message) => {
    console.log(`Topic: ${topic}, Message: ${message}`);
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});