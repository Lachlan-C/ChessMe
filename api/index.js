
var stockfish = require('stockfish');

const { Chess } = require('chess.js');
var chessGame = new Chess();

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const { MONGO_URL, PORT } = process.env;
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


//movesArray Example:
// = [e2e3, a2b2, a1c3]
//FEN is optional if not provided then the game starting pos is assumed
function toFEN(movesArray, FEN)
{
    let chess
    if(FEN)
        chess = new Chess(FEN)
    else
        chess = new Chess()

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

//Returns Game status
function updateStatus () {
    var status = ''
  
    var moveColor = 'White'
    if (chessGame.turn() === 'b') {
      moveColor = 'Black'
    }
  
    // checkmate?
    if (chessGame.in_checkmate()) {
      status = 'Game over, ' + moveColor + ' is in checkmate.'
    }
  
    // draw?
    else if (chessGame.in_draw()) {
      status = 'Game over, drawn position'
    }
  
    // game still on
    else {
      status = moveColor + ' to move'
  
      // check?
      if (chessGame.in_check()) {
        status += ', ' + moveColor + ' is in check'
      }
    }
    return status
}
//--------------------------------------------------

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
        //playerID needs to be implemented 
        //playerid,
        to,
        from,
        //update fen to read from database
        FEN
    } = req.body;
    chessGame = new Chess(FEN);
    //returns to/from fen and status
    res.send({valid: onDrop(to,from), FEN: chessGame.fen(), status: updateStatus(),To: to, From: from});
});

app.post('/chess/moves', (req, res) => {
    const {
        FEN,
        piecePos
    } = req.body;
    chessGame = new Chess(FEN)
    res.send(chessGame.moves({ square: piecePos }))
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});



