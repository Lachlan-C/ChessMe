var math = require('math');
var stockfish = require('stockfish');


const swaggerOptions = require('./swagger-options');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const fetch = require('node-fetch')

const { Chess } = require('chess.js');
var chessGame = new Chess();

const express = require('express');
//Mongo
const mongoose = require('mongoose');
mongoose.set('debug', true);


const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const { MONGO_URL, PORT, MQTT_URL, API_URL} = process.env;
const app = express();

mongoose.connect(MONGO_URL, {useNewUrlParser:true, useUnifiedTopology:true});

const User = require(`./models/user`);
const Game = require(`./models/game`);
const { json } = require('express');
const user = require('./models/user');

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



/**
 * @swagger
 * /game/{gameid}/fen:
 *   get: 
 *       description: Get all the fens for the game
 *       tags:
 *           - Game
 *       parameters:
 *       - in: path
 *         name: gameid
 *         schema:
 *          type: string
 *         required: true
 *         description: ID of the game
 *       responses:
 *           '200':
 *               description: {object}
 *           '400':
 *               description: error         
 */
app.get('/game/:gameid/fen', (req, res) => {
    const { gameid } = req.params;
    Game.find({ "GameID": gameid }, (err, data) => {
        let FENarray = []
        let FEN = ""
        if (err)
            res.send(err)
        else{
            console.log(data[0].Moves)
            data[0].Moves.map((item) => {
                FEN = toFEN([item], FEN)
                FENarray.push(FEN)
            })
            res.send({FENs:FENarray, Moves: data[0].Moves})
        }
    })
})


/**
 * @swagger
 * /user/board/pair:
 *   post: 
 *       description: Update board ID on DB
 *       tags:
 *           - User
 *       parameters:
 *       - name: boardID
 *         description: ID of the board
 *         in: formData
 *         required: true
 *         type: string
 *       - name: userID
 *         description: ID of the user
 *         in: formData
 *         required: true
 *         type: string
 *       responses:
 *           '200':
 *               description: {object}
 */
app.post('/user/board/pair', (req,res) => {     
    const {boardID, userID} = req.body
    User.find({userID: userID}, (err, data) => {
        data[0].boardID = boardID
        
        data[0].save((err => {
            err ? res.send(err) : res.send(data)
        }))            
    })
})

/**
 * @swagger
 * /stockfish/move:
 *   post: 
 *       description: Chess engine generate moves
 *       tags:
 *           - StockFish
 *       parameters:
 *       - name: FEN
 *         description: FEN string showing current board state    
 *         in: formData
 *         required: true
 *         type: string
 *       - name: difficulty
 *         description: StockFish Difficulty
 *         in: formData
 *         required: false
 *         type: int
 *       responses:
 *           '200':
 *               description: 'e2e3'
 */
//StockFISH ---------------------------------------
var engine = stockfish();
function send(str)
{
    console.log(`Sending: ${str}`)
    engine.postMessage(str);
}


app.post('/stockfish/move', (req,res) => {
const { FEN, difficulty } = req.body 
if (difficulty)
    send(`setoption name Skill Level value ${difficulty}`)
send(`position fen ${FEN}`)
send('go')

engine.onmessage = (data) => {
        //Uses regex to find the best move
        const move = data.match(/bestmove\s+(\S+)/)

        //Finds the FEN string
        if (move)
        {
            //res.send(toFEN([move[1]], FEN))
            res.send(move[1])
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
function onDrop (move) {
    var move = chessGame.move(
        move, 
        { sloppy: true, promotion:'q' } 
    )
    if (move === null) {
        //Invalid Move
        return false
    } else {
        //Valid Move
        return true
    }
}


/**
 * @swagger
 * /validate/move:
 *   post: 
 *       description: Move and validate a piece
 *       tags:
 *           - Logic
 *       parameters:
 *       - name: GameID
 *         description: ID of your game
 *         in: formData
 *         required: true
 *         type: string
 *       - name: move
 *         description: Start and Dest Coordinate of the piece you are moving 
 *         in: formData
 *         required: true
 *         type: string
 *       - name: userID
 *         description: ID of the user sending the move
 *         in: formData
 *         required: true
 *         type: string
 *       responses:
 *           '200':
 *               description: {e2, e3}
 */
app.post('/validate/move', (req, res) => {

    const {
        userID,
        move,
        GameID
    } = req.body;

    //Need to check if the user is sending a move for the right team!
    //Likely need an additional field in the database games model!

    //Searches for game with supplied GameID 
    //@@@@@NOTE: ERROR HANDLING ???? PROBABLY A GOOD IDEA!
    Game.findOne({GameID: GameID}, (err, data) => {
        
         //Creates new Game
         chessGame = new Chess(data.CurrentFen);
        
         //check to see if Correct user is making the move
         var valid = false; 
         
         if (chessGame.turn() === 'b')
         { 
             if (data.Users[1] === userID)
             {
                 //Updates the Game with the Move/Validates
                 valid = onDrop(move)
             }
         }
         if (chessGame.turn() === 'w')
         {   
             if (data.Users[0] === userID)
             {
                 //Updates the Game with the Move/Validates
                 valid = onDrop(move);
             }
         }
         //Status Check (has someone won?)
         const status = updateStatus()
         res.send({
             valid: valid, 
             FEN: chessGame.fen(), 
             status: status,
             move: move,
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
                data.Moves.push(move)
                
                //Save the Updates to the DB
                data.save(err => {
                    if (err) {
                        console.log(err)
                    }
                })
                //game stockfish player responds
                if (data.Users[1] === "" )
                {
                    if (chessGame.turn() === 'b') {
                        
                        const body = {
                            FEN: chessGame.fen(),
                            difficulty: "20"
                        }
            
                        fetch(`${API_URL}/stockfish/move`, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }} )
                        .then(response => response.text())
                        .then(response => 
                            {
                                console.log(response)
                                const body2 = {
                                    userID: "",
                                    move: response,
                                    GameID: data.GameID
                                }
                                fetch(`${API_URL}/validate/move`, { method: 'POST', body: JSON.stringify(body2), headers: { 'Content-Type': 'application/json' }} )
                                .then(()=> {
                                    fetch(`${MQTT_URL}/game/update`,{method: 'POST',body: JSON.stringify({userID:"",FEN: chessGame.fen(),GameID: data.GameID}), headers:{ 'Content-Type': 'application/json' }})
                                })
                            })
                    }
                }
            }
        })
});
        
        /**
         * @swagger
         * /chess/moves:
 *   post: 
 *       description: Show possible moves for a piece
 *       tags:
 *           - Logic
 *       parameters:
 *       - name: GameID
 *         description: ID of your game
 *         in: formData
 *         required: true
 *         type: string
 *       - name: piecePos
 *         description: Coordinate of piece you want moves for    
 *         in: formData
 *         required: true
 *         type: string
 *       responses:
 *           '200':
 *               description: {e2, e3}
 */
app.post('/chess/moves', (req, res) => {
    const {
        GameID,
        piecePos,
        userID
    } = req.body;
    Game.findOne({GameID: GameID}, (err, data) => {
        let Users = [userID, null];
        if (userID == data.Users[1])
            Users = [null, userID]

        chessGame = new Chess(data.CurrentFen)
        res.send({moves: chessGame.moves({ square: piecePos }), Users: Users })
    })
});


/**
 * @swagger
 * /chess/NewGame:
 *   post: 
 *       description: Create a new chess game
 *       tags:
 *           - Chess
 *       parameters:
 *       - name: PlayerID
 *         description: ID of the user creating the game
 *         in: formData
 *         required: true
 *         type: string
 *       - name: EnemyID
 *         description: ID of the player you intend to vs, leave blank if CPU 
 *         in: formData
 *         required: false
 *         type: string
 *       responses:
 *           '200':
 *               description: GameID {12482373}
 */
app.post('/chess/NewGame', (req, res) => {
    const {
        PlayerID,
        EnemyID
    } = req.body;
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
            const newGameID = (math.floor((math.random() * math.floor(99999999)))).toString();  
            const FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
            const Users = [PlayerID, EnemyID]
            const CurrentDate = new Date();

            User.find({'userID': Users}, (err, user) => {
                var EnemyBoardID = null;
                if (EnemyID != "") {
                    EnemyBoardID = user[1].boardID;
                }
                const boardID = [user[0].boardID, EnemyBoardID]
                
                const body = {
                    gameID: newGameID,
                    boardID: boardID,
                    userID: Users,
                    FEN: FEN
                }

                fetch(`${MQTT_URL}/game/connect`, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }} )
                .then(response => response.text())
                .then(response => 
                    {
                        console.log(response)
                    })

            new Game({
                GameID: newGameID,
                DateTimeStart: CurrentDate,
                Users: Users,
                CurrentFen: FEN
            }).save();
            
            res.send(newGameID);
        })
        }
    })
});

/**
 * @swagger
 * /chess/replay:
 *   post: 
 *       description: Create a new chess game from point specified in another game
 *       tags:
 *           - Chess
 *       parameters:
 *       - name: GameID
 *         description: ID of the game
 *         in: formData
 *         required: true
 *         type: string
 *       - name: Index
 *         description: Move index at which to start from
 *         in: formData
 *         required: true
 *         type: string
 *       responses:
 *           '200':
 *               description: GameID {12482373}
 */
app.post('/chess/replay', (req, res) => {
    const {
        GameID,
        Index
    } = req.body;
    Game.findOne({
        "GameID": GameID
    }, (err, data) => {
            const newGameID = (math.floor((math.random() * math.floor(99999999)))).toString();  
            movesArray = data.Moves.slice(0, Index)
            const FEN = toFEN(movesArray);
            const Users = data.Users
            const CurrentDate = new Date();
            const Moves = movesArray


            User.find({'userID': Users}, (err, user) => {
                let boardID = []
                if (user[1])
                    boardID = [user[0].boardID, user[1].boardID]
                else
                    boardID = [user[0].boardID, null]

                const body = {
                    gameID: newGameID,
                    boardID: boardID,
                    userID: Users,
                    FEN: FEN
                }

                fetch(`${MQTT_URL}/game/connect`, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }} )
                .then(response => response.text())
                .then(response => 
                    {
                        console.log(response)
                    })

            new Game({
                GameID: newGameID,
                DateTimeStart: CurrentDate,
                Users: Users,
                CurrentFen: FEN,
                Moves
            }).save();
            
            res.send(newGameID);
        })
    })
})




/**
 * @swagger
 * /chess/reconnect:
 *   post: 
 *       description: Reconnect to existing game
 *       tags:
 *           - Chess
 *       parameters:
 *       - name: username
 *         description: Name of the user rejoining the game
 *         in: formData
 *         required: true
 *         type: string
 *       - name: gameID
 *         description: ID of the game you wish to rejoin
 *         in: formData
 *         required: true
 *         type: string
 *       responses:
 *           '200':
 *               description: {}
 */
app.post('/chess/reconnect', (req, res) => {
    const {username, gameID } = req.body
    let team
    let Users = []
    let BoardID = []
    User.find({'username': username}, (err, user) => {
        //console.log(user)
        console.log(user[0].userID)
        if (!user[0].boardID)
        {
            res.send('Fatal ERROR, Please Pair with a board')
            return
        }
        
        Game.find({ "GameID": gameID }, (err, data) => {
            console.log(data)
            const userID = user[0].userID
            const boardID = user[0].boardID

            if (data[0].Users[0].userID === user[0].userID)
            {
                Users[0] = user[0].userID
                Users[1] = undefined
                BoardID[0] = user[0].boardID
                BoardID[0] = null
            }
            else
            {
                Users[0] = null
                Users[1] = user[0].userID
                BoardID[0] = null
                BoardID[1] = user[0].boardID
                
            }
                 
            const body = {
                boardID: boardID,
                userID: userID,
            }
            fetch(`${MQTT_URL}/board/pair`, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }} )
            .then(response => response.text())
            .then(response => 
                {
                    console.log(response)
                            const body = {
                                gameID: data[0].GameID,
                                boardID: BoardID,
                                userID: Users,
                                FEN: data[0].CurrentFen,
                                moves: data[0].Moves
                            }
                           
                            fetch(`${MQTT_URL}/game/connect`, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }} )
                            .then(response => response.text())
                            .then(response => 
                                {
                                    console.log(response)
                                })
                        })
                        res.send('success')
            })
        })
})

/**
 * @swagger
 * /user/login:
 *   post: 
 *       description: Login authentication
 *       tags:
 *           - User
 *       parameters:
 *       - name: username
 *         description: Your login username
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: Your login password
 *         in: formData
 *         required: true
 *         type: string
 *       responses:
 *           '200':
 *               description: loggedIn
 *           '400':
 *               description: passError         
 */
app.post('/user/login', (req, res)=> {
    const {username} = req.body;
    const {password} = req.body;

    User.findOne({'username': username},(err,loggedUser)=>{
        if (!loggedUser) res.send({success: false ,message: "username was not found"});
        else if (loggedUser.password == password) {
            return res.send({success: true ,message: "successfully logged in!"});
        }else{
            return res.send({success: false ,message: "password does not match"});
        }
    });
});

/**
 * @swagger
 * /user/{userid}/games:
 *   get: 
 *       description: Login authentication
 *       tags:
 *           - User
 *       parameters:
 *       - in: path
 *         name: userid
 *         schema:
 *          type: string
 *         required: true
 *         description: ID of the user
 *       responses:
 *           '200':
 *               description: {object}
 *           '400':
 *               description: error         
 */
app.get('/user/:userid/games', (req, res) => {
    const { userid } = req.params;
    Game.find({ "Users": userid }, (err, data) => {
        err
        ? res.send(err)
        : res.send(data)
    })
})

/**
 * @swagger
 * /user/{username}:
 *   get: 
 *       description: Find user w/ username
 *       tags:
 *           - User
 *       parameters:
 *       - in: path
 *         name: username
 *         schema:
 *          type: string
 *         required: true
 *         description: username
 *       responses:
 *           '200':
 *               description: {object}
 *           '400':
 *               description: error         
 */
app.get('/user/:username', (req, res) => {
    const { username } = req.params;
    User.find({ "username": username }, (err, data) => {
        err
        ? res.send(err)
        : res.send(data)
    })
})



//Requests a new user. This checks the username against existing users
/**
 * @swagger
 * /user/register:
 *   post: 
 *       description: Login authentication
 *       tags:
 *           - User
 *       parameters:
 *       - name: username
 *         description: Your desired username
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: Your desired password
 *         in: formData
 *         required: true
 *         type: string
 *       responses:
 *           '200':
 *               description: 
 *           '400':
 *               description: existUser        
 */
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



