
var stockfish = require('stockfish');

const { Chess } = require('chess.js');
var chessGame = new Chess();

const mqtt = require('mqtt');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const { MONGO_URL, PORT, BROKER, SUBSCRIBE_PATH, MOVE_VALID_URL } = process.env;
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

const port = PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


//MovesArray Example:
// = [e2e3, a2b2, a1c3]
//FEN is optional if not provided then the game starting pos is assumed
function toFEN(movesArray, FEN)
{
    if(FEN)
        let chess = new Chess(FEN)
    else
        let chess = new Chess()

    movesArray.map((movement) => 
        chess.move(movement, {sloppy: true})
    )
    return chess.fen();
}


//StockFISH ---------------------------------------
var engine = stockfish();
function send(str)
{
    console.log(`Sending: ${str}`)
    engine.postMessage(str);
}


app.post('/stockfish/move', (req,res) => {
const { FEN } = req.body 
send(`position fen ${FEN}`)
send('go')

engine.onmessage = (data) => {
        //Uses regex to find the best move
        const move = data.match(/bestmove\s+(\S+)/)

        //Finds the FEN string
        if (move)
        {
            res.send(toFEN([move[1]], FEN))
        }
}
})
//--------------------------------------------------

const client = mqtt.connect(BROKER);



//Move Validation Relocated
function onDrop (source, target) {
    var move = chessGame.move({
      from: source,
      to: target,
      promotion: 'q' 
    })
  
    if (move === null) {
    return 'Illegal'
    } else {
    return 'Legal'
    }
  }
  
  app.post('/validate/move', (req, res) => {
      const {
          to,
          from,
          FEN
      } = req.body;
      chessGame = new Chess(FEN);
      res.send({valid: onDrop(to,from), FEN: chessGame.fen()});
  });


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

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});



