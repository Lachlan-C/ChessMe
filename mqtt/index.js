const mqtt = require('mqtt');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const fetch = require('node-fetch')

dotenv.config();


const { MONGO_URL, PORT, BROKER, SUBSCRIBE_PATH } = process.env;

const app = express();

mongoose.connect(MONGO_URL, {useNewUrlParser:true, useUnifiedTopology:true});

const user = require(`./models/user`);
const game = require(`./models/game`);
const { json } = require('body-parser');
const { response } = require('express');

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

function send(topic, msg)
{
    client.publish(topic, msg, () => {
        console.log(`Message Sent to ${topic}, Message: ${msg}`);
    });
}

//validates the move
function validate(body)
{
    //atm it needs to, from, FEN,
    fetch('http://localhost:5000/validate/move', { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }} )
    .then(response => response.json())
    .then(json => 
        {
            console.log(json)
            //expected response {move: 'e2e3', status: 'white turn', userID: ['xxx', 'yyy']}
            //publish message to channel /AkdsmDm2sn/chessme/game/:gameid
            send(`${SUBSCRIBE_PATH}/game/${body.gameID}`, json) 
            //get gameID from body.gameID
            //here send message back to game channel w/ both user identifiers if valid move
        })
}

//show possible moves for a piece
function pieceMoves(body)
{
        //atm it needs FEN, piecePos
        fetch('http://localhost:5000/chess/moves', { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }} )
        .then(response => response.json())
        .then(json => 
            {
                console.log(json)
                //expected response {moves: [e2, e3], userID: ['xxx']}
                //publish message to channel /AkdsmDm2sn/chessme/game/:gameid
                send(`${SUBSCRIBE_PATH}/game/${body.gameID}`, json) 
                //get gameID from body.gameID
                //here send message back to game channel w/ user identifier
            })
}

function hint(body)
{
    //atm it needs FEN
    fetch('http://localhost:5000/stockfish/move', { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }} )
    .then(response => response.json())
    .then(json => 
        {
            console.log(json)
            //expected response {move: 'e2e3', userID: ['xxx']}
            //publish message to channel /AkdsmDm2sn/chessme/game/:gameid
            send(`${SUBSCRIBE_PATH}/game/${body.gameID}`, json) 
            //get gameID from body.gameID
            //here send message back to game channel with user identifier
        })
}

//Connection confirmation
client.on('connect', () => {
    client.subscribe(`${SUBSCRIBE_PATH}/#`, err => {
        if (!err) console.log('Subscribed to main branch.');
    });
});

client.on('message', (topic, message) => {
    topic = topic.slice(1).split('/')
    if (topic[2])
    {
        //Topic /AkdsmDm2sn/chessme/game/:gameid
        const messageJSON = JSON.parse(message)
        if (topic[2].match(`game`))
        {
            messageJSON.gameID = topic[3]
            console.log(messageJSON)
            

            if (messageJSON.request === 'validate')
                validate(messageJSON)
            else if(messageJSON.request === 'piecemoves')
                pieceMoves(messageJSON)
            else if (messageJSON.request === 'hint')
                hint(messageJSON)
            else
                console.log('request not implemented')
            /*
            Format: '{"userID": 6401, "request": "validate", "move": "e2e3"}'
            Message: 
            {
                userID: 6969
                request: validate
                move: e2e3
            }
            OR
            {
                userID: 6942
                request: piece-moves
                piece: e2
            }
            OR
            {
                userID: 7321
                request: hint
            }
            */
        }
        else if (topic[2].match('board'))
        {
            messageJSON.boardID = topic[3]
            //Topic /AkdsmDm2sn/chessme/board/:boardid
            /*
            {
                userID: 7321
                request: pair
            }
            */  
        }
    }
    console.log(`Topic: ${topic}, Message: ${message}`);
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});