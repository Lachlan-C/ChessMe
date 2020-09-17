const mqtt = require('mqtt');
const express = require('express');
const bodyParser = require('body-parser');
const jquery = require('jquery');
const { basename } = require('path');

var connected = false;
var GameID, userID, team, sendMessage;
const boardID = 1234;

const app = express();

const mqtt_base_path= '/AkdsmDm2sn/chessme'

app.use(express.static('public'));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

client.on('connect', () => {
    connected = true;
    console.log('Connected'); //Can access the mqtt broker.
    client.subscribe(`${mqtt_base_path}/#`, err => {
        if (!err) console.log(`Subscribed to ${mqtt_base_path}/#`);
    });
    client.publish(`${mqtt_base_path}/board/${boardID}`, JSON.stringify({"userID":"12345678","request":"pair"}));
});

client.on('message', (topic, message) => {
    //prints initial message.
    console.log(`message: ${message}`);
    //splits topic by / character.
    topic = topic.slice(1).split('/');
    //checks topic[2] exists.
    if(topic[2]){
        //parses message to a JSON object
        const mes = JSON.parse(message);
        //Checks topic = 'board'
        if (topic[2].match(`board`)){
            //Checks boardID is valid.
            if(topic[3] == boardID) {
                if(mes.request === 'pair') {
                    userID = mes.userID;
                    console.log('Paired');
                }else if(mes.request === 'connect') {
                    GameID = mes.GameID;
                    team = mes.team;
                    connected = true;
                }
            }
        }else if (topic[2].match('test')) {
            console.log("attempting Get");
            sendMessage = mes;
        }
    }
});

app.post('/newMove', (req,res)=> {
    client.publish(`${mqtt_base_path}/game/${gameid}`, JSON.stringify(/* body of request here.*/))
});

app.post('/testSend', (req,res)=>{
    console.log("request: ",req.body);
    client.publish(`${mqtt_base_path}/test`, JSON.stringify(`{Name: ${req.body.Name}}`));
    setTimeout(()=>{res.send(sendMessage)},1000);
});


//display chessboard.html
app.get('/', (req,res)=>{
    res.sendFile(`${__dirname}/public/Chessboard.html`);
})

//Listening on port 3000
app.listen(3001, () => {
    console.log('listening on port 3001');
});
