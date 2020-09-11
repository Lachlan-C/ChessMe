var math = require('math');
var stockfish = require('stockfish');


const swaggerOptions = require('./swagger-options');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const { Chess } = require('chess.js');
var chessGame = new Chess();

const express = require('express');
//Mongo
const mongoose = require('mongoose');
mongoose.set('debug', true);


const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const { MONGO_URL, PORT } = process.env;
const app = express();

mongoose.connect(MONGO_URL, {useNewUrlParser:true, useUnifiedTopology:true});

const User = require(`./models/user`);
const Game = require(`./models/game`);
const { json } = require('express');

app.use(express.static('public'));
app.use((req,res,next)=> {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers","Origin, X-RequestedWith, Content-Type, Accept");
    next();
});

const swaggerDocs = swaggerJsDoc(swaggerOptions); 
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));


const port = PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


/**
* @swagger
* /test:
*   get: 
*       description: Testing API
*       tags:
*           - Testing
*       responses:
*           '200':
*               description: I am the tester!.
*/
app.get('/test', (req,res) => {
    res.send('I am the tester!')
})


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
            res.send({ FEN: toFEN([move[1]], FEN)})
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
        //Invalid Move
        return false
    } else {
        //Valid Move
        return true
    }
}

app.post('/validate/move', (req, res) => {

    const {
        UserID,
        to,
        from,
        GameID
    } = req.body;

    //Need to check if the user is sending a move for the right team!
    //Likely need an additional field in the database games model!

    //Searches for game with supplied GameID 
    //@@@@@NOTE: ERROR HANDLING ???? PROBABLY A GOOD IDEA!
    Game.findOne({GameID: GameID}, (err, data) => {

        //Creates new Game
        chessGame = new Chess(data.CurrentFen);

        //Updates the Game with the Move/Validates
        const valid = onDrop(to, from)
        //Status Check (has someone won?)
        const status = updateStatus()
        res.send({
            valid: valid, 
            FEN: chessGame.fen(), 
            status: status,
            To: to, 
            From: from,
            Users: data.Users
        });

        //Update DB if valid move
        if (valid)
        {
            //Update current board state
            data.CurrentFen = chessGame.fen()
            //GameOver Update Winner
            if (chessGame.game_over())
                data.Winner = status
            //Add the move to the moves array
            data.Moves.push(to+from)
            
            //Save the Updates to the DB
            data.save(err => {
                if (err) {
                    console.log(err)
                }
            })}
    })
});

app.post('/chess/moves', (req, res) => {
    const {
        FEN,
        piecePos
    } = req.body;
    chessGame = new Chess(FEN)
    res.send(chessGame.moves({ square: piecePos }))
});

app.post('/chess/NewGame', (req, res) => {
    const {
        PlayerID,
        EnemyID
    } = req.body;
    var newGameID;
    Game.findOne({
        "Users": PlayerID,
        "Winner": ""
    }, (err, data) => {
        console.log(data);
        if (data) 
        {
            return res.send("ERROR GAME ALREADY RUNNING");
        } 
        else 
        {
            newGameID = (math.floor((math.random() * math.floor(99999999)))).toString();
            var CurrentDate = new Date();
            new Game({
                GameID: newGameID,
                DateTimeStart: CurrentDate,
                Users: [PlayerID, EnemyID],
                CurrentFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
            }).save();
            res.send(newGameID);
        }
    })
});


app.post('/user/login', (req, res)=> {
    const {username} = req.body;
    const {password} = req.body;

    User.findOne({'username': username},(err,loggedUser)=>{
        if (!loggedUser) res.send('userError');
        else if (loggedUser.password == password) {
            return res.send('loggedIn');
        }else{
            return res.send('passError');
        }
    });
});

//Find users games
app.get('/user/:userid/games', (req, res) => {
    const { user } = req.params;
    Game.find({ "Users": user }, (err, data) => {
        err
        ? res.send(err)
        : res.send(data)
    })
})


//Requests a new user. This checks the username against existing users
app.post('/user/register', (req,res)=> {

    const {username} = req.body;
    const {password} = req.body;
    const newID = math.floor(math.random()*math.floor(99999999));
    User.findOne({'userID':newID}, (err, foundID)=>{
        if(foundID) res.send('idInvalid');
        else{
            User.findOne({'username':username}, (err,foundUser)=>{
                if (foundUser) res.send('existUser');
                else {
                    new User({
                        username: username,
                        password: password,
                        userID: newID
                    }).save();
                }
            });
        }
    });
});



app.listen(port, () => {
    console.log(`listening on port ${port}`);
});



