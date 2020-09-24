const mqtt = require('mqtt');
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const fetch = require('node-fetch')

dotenv.config();


const { PORT, BROKER, MQTT_PATH, API_URL } = process.env;

const app = express();

const { json } = require('body-parser');
const { response } = require('express');
const { connect } = require('mqtt');

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

//Connection confirmation
client.on('connect', () => {
    client.subscribe(`${MQTT_PATH}/#`,qos = 2, err => {
        if (!err) console.log(`Subscribed to ${MQTT_PATH}/#`);
    });
});



//Sends game topic to board
app.post('/game/connect', (req, res) => {
    //array of userid & boardid
    const { userID, boardID, gameID, FEN } = req.body
    //user0 is white because white goes first
    //user1 is BLACK because black goes second
    if (userID[0])
    {
        send(`/AkdsmDm2sn/chessme/board/${boardID[0]}`, JSON.stringify(
            {
                gameID: gameID,
                request: 'connect',
                team: 'white',
                FEN: FEN,
                server: true
            }
            ))
    }
    if (userID[1])
    {
        send(`/AkdsmDm2sn/chessme/board/${boardID[1]}`, JSON.stringify(
            {
                gameID: gameID,
                request: 'connect',
                team: 'black',
                FEN: FEN,
                server: true
            }
            ))
    }
    res.send('message has been sent!')
})


//Subject to change maybe add a dynamic response?
app.post('/board/pair', (req, res) => {
    const { userID, boardID } = req.body 
    const request = {
        userID: userID,
        request: 'pair',
        server: true
    }
    send(`/AkdsmDm2sn/chessme/board/${boardID}`, JSON.stringify(request))
    res.send('message has been sent!')
})



//Publish message to topic
function send(topic, msg)
{
    client.publish(topic, msg, qos = 2, () => {
        console.log(`Message Sent to ${topic}, Message: ${msg}`);
    });
}

//Validates a move
function validate(body)
{
    //atm it needs to, from
    //Will need userID in future to validate which user the message is coming from
    fetch(`${API_URL}/validate/move`, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }} )
    .then(response => response.json())
    .then(json => 
        {
            console.log("Response:")
            console.log(json)
            //expected response {move: 'e2e3', status: 'white turn', userID: ['xxx', 'yyy']}
            //publish message to channel /AkdsmDm2sn/chessme/game/:gameid
            
            json.server = true
            json.request = 'validate'
            send(`${MQTT_PATH}/game/${body.GameID}`, JSON.stringify(json)) 

            //get gameID from body.gameID
            //here send message back to game channel w/ both user identifiers if valid move
        })
}

//show possible moves for a piece
function pieceMoves(body)
{
        //atm it needs GameID, piecePos
        fetch(`${API_URL}/chess/moves`, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }} )
        .then(response => response.json())
        .then(json => 
            {
                console.log("Response:")
                console.log(json)
                //expected response {moves: [e2, e3], userID: ['xxx']}
                //publish message to channel /AkdsmDm2sn/chessme/game/:gameid

                //send(`${MQTT_PATH}/game/${body.GameID}`, JSON.stringify(json)) 

                //get gameID from body.gameID
                //here send message back to game channel w/ user identifier
            })
}


//Gives the user a move hint with stockfish
function hint(body)
{
    //atm it needs FEN
    fetch(`${API_URL}stockfish/move`, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }} )
    .then(response => response.json())
    .then(json => 
        {
            console.log("Response:")
            console.log(json)
            //expected response {move: 'e2e3', userID: ['xxx']}
            //publish message to channel /AkdsmDm2sn/chessme/game/:gameid

            //send(`${MQTT_PATH}/game/${body.GameID}`, JSON.stringify(json)) 
            
            //get gameID from body.gameID
            //here send message back to game channel with user identifier
        })
}

//Updates the DB with the Board ID
function pair(body)
{
    //takes boardID and userID
    fetch(`${API_URL}/user/board/pair`, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }} )
    .then(response => response.json())
    .then(json => 
    {
        console.log(json)   
    })
}


client.on('message', (topic, message) => {
    topic = topic.slice(1).split('/')

    let messageJSON
    try {
        messageJSON = JSON.parse(message)
    } catch (e) {
        return
    }

    if(messageJSON.server)
    {
        return
    }
    else if (topic[2])
    {
        //Topic /AkdsmDm2sn/chessme/game/:gameid

        if (topic[2].match(`game`))
        {
            messageJSON.GameID = topic[3]
            console.log("Message:")
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
            if (messageJSON.request === 'pair')
                pair(messageJSON)
            //Topic /AkdsmDm2sn/chessme/board/:boardid
            /*
            {
                userID: 7321
                request: pair
            }
            */  
        }
    }
    //Useful for Debugging
    //console.log(`Topic: ${topic}, Message: ${message}`);

});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});