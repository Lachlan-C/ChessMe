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


//Conection confirmation

client.on('connect', () => {
    client.subscribe(SUBSCRIBE_PATH, err => {
        if (!err) console.log('Subscirbed to main branch.');
    });
});

client.on('message', (topic, message) => {
    console.log("received request");

    //placeholder until we work out where we are sending data.
    console.log("topic: ",topic);
    console.log("message: ",message);
});

//More commands to come, depends on the requirements of the mqtt channel.


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});