const mqtt = require('mqtt');
const express = require('express');
const bodyParser = require('body-parser');
const jquery = require('jquery');
const { basename } = require('path');
const dotenv = require('dotenv');

dotenv.config();

const {BOARD_ID} = process.env;

var gameID, team, sendMessage, FEN;
const boardID = BOARD_ID

const app = express();

var userID = app.locals.USER_ID;

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
    console.log('Connected'); //Can access the mqtt broker.
    client.subscribe(`${mqtt_base_path}/#`, qos = 2, err => {
        if (!err) console.log(`Subscribed to ${mqtt_base_path}/#`);
    });
    //client.publish(`${mqtt_base_path}/board/${boardID}`, JSON.stringify({"userID":"00000001","request":"pair","server":"true"}));
    //client.publish(`${mqtt_base_path}/board/${boardID}`, JSON.stringify({"gameID":"16236484","request":"connect","team":"white","FEN":"rnbqkbnr/pppp1ppp/4p3/8/8/4PN2/PPPP1PPP/RNBQKB1R b KQkq - 1 2"}));
});

client.on('message', (topic, message) => {
    //prints initial message.
    console.log(`topic: ${topic}`);
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
                    if (mes.server) {
                        userID = mes.userID;
                        app.locals.USER_ID = userID
                        client.publish(`${mqtt_base_path}/board/${boardID}`, JSON.stringify({"userID":`${userID}`,"request":"pair"}),qos=2);
                        console.log('Paired');
                    }
                }else if(mes.request === 'connect') {
                    gameID = mes.gameID;
                    team = mes.team;
                    FEN = mes.FEN;
                    connected = true;
                    console.log('Connected to game');
                }
            }
        }else if (topic[2].match('game')) {
            if (topic[3] === gameID){
                if(mes.request === 'validate'){
                    FEN = mes.FEN
                    console.log(FEN);
                }
            }
        }else if (topic[2].match('test')) {
            //This tests the connection with the board.
            console.log("attempting Get");
            sendMessage = mes;
        }
    }
});

app.get('/loadGame', (req,res)=>{
    res.send(FEN);
    app.locals.USER_ID = userID;
});

app.post('/newMove', (req,res)=> {
    if(gameID === undefined) {
        res.send("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
        return;
    }
    const moveSend = {
        userID: `${userID}`,
        move: `${req.body.Move}`,
        request: 'validate'
    }
    client.publish(`${mqtt_base_path}/game/${gameID}`, JSON.stringify(moveSend), qos = 2);
    setTimeout(()=>{res.send(FEN)},1000);
});

//Testing connection with test button
app.post('/testSend', (req,res)=>{
    console.log("request: ",req.body);
    client.publish(`${mqtt_base_path}/test`, JSON.stringify(`{Name: ${req.body.Name}}`),qos=2);
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
