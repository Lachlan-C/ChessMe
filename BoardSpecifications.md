# Requirements for an IoT Chessboard

## Physical Requirements
For a chess game to be played, the following physical hardware requirements must be met. Note: Some of these requirements do have aspects that will be touched on in the Software Requirements stage.

1. The board should be able to move all of the pieces to match a FEN string.  
   - A FEN string is a string representation of the state of a chessboard.
   - It is possible to update the Board using a move, however FEN string should be used for simplicity.

2. If a piece should not be on the board (ie. a piece is taken), then the piece should be moved to a side area so that it can be accessed if needed (ie. a pawn promotion requires the new piece)

3. Pieces should be able to be moved by a player, and when done, it should save its new board state.
   - If a player makes an invalid move, the piece should be returned to its original position.

4. The board requires an active internet connection, in order to send and recieve moves.
<br/><br/>
## Software Requirements
The Board must have the following software aspects, which can be implemented using 
the endpoints that will be defined later in this document.  
  
1. First, a board will need to be assigned a unique ID. This id should be 6 digits.
<br/><br/>
   - The current prototype includes an ID of 4 digits. This is used mainly for testing, and the final product may have an ID of 5 or 6 digits. Additionally, when providing a framework for external developers, a range of ID's should be reserved for non-standard boards.
2. The board will need to communicate with MQTT, and hence have access to the MQTT Broker. 
<br/><br/>
   - Currently the broker is `"mqtt://broker.hivemq.com:1883"`. Before production, this will be changed to a custom ChessMe broker. Whilst the project is using hivemq as a broker service, all topics for messages are pre-pended by `'/AkdsmDm2sn/chessme/'`, as a basic form of security and making sure that the only messages that are recieved are relavent to the system.
<br/><br/>
   - When subscribing to the MQTT broker, the path to subscribe to should be `'/AkdsmDm2sn/chessme/'`. Topics for messages are split into the following two categories
<br/><br/>
     - `'/AkdsmDm2sn/chessme/board/"boardID"'` - This is used to pair the board with a User, and connect to a game. "boardID" is replaced by the ID assigned to the board.  
     These Messages follow the following format:
<br/><br/>
        ### Pair Request
        This request pairs the board with a user, and must be done before a game is created.
        ```
        {
            userID: userID,
            request: 'pair',
            server: true
        }
        ```
        This request should be sent back without `'server: true'`.
<br/><br/>
        ### Connect to Game Request
        This request connects a board to a game. This is done when a new game is created in the frontend.
        ```
        {
            gameID: gameID,
            request: 'connect',
            team: 'black',
            FEN: FEN,
            server: true
        }
        ```
        No response is required for this request.
        `'server: true'` is used to define whether the message is being sent by the api, or by another player. Check `'server:true'` to ensure that all of the messages that the board uses are from the server, and itself/other boards.
<br/><br/>

      - `'/AkdsmDm2sn/chessme/game/"gameID"'` - This is used for all communications regarding the game. `"gameID"` should be replaced with the gameID recieved from a connect request.  
      Note: both connected boards to a game will use this channel, so all requests should check `'server: true'`.
      Transactions on this channel are initiated by the board.  
      Whenever a request with `'server: true'` is sent through this channel, it will be accompanied by `'FEN:'`. This will always be the current FEN string of the game. This should be checked against the current state of the Local board. If different, the board should always prioritise the newer string.
<br/><br/>
   - Boards should only send a message when requesting move Validation:
     - A move validation request should be sent as a string of a JSON object with the following fields:
        ```
        {
            userID: userID,
            move: 'e5e6',
            request: 'validate'
        }
        ```
        userID is the ID of the user connected to the Board in a Pair Request.  
        move should be send as a string of the following:  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Origin position of Piece moved + Final position of Piece moved.  
        request should always be equal to `'validate'`
<br/><br/>   
## Additional Functionality 
The following functions can be implemented on a Physical board, however are not required for the system to function correctly.
<br/><br/>
- Requesting possible moves for a piece
```
Request:
{
  "userID": userid, 
  "piecePos": 'a7',
  "request": "piecemoves"
}
         
Response:
{
  "Users": [userid, null],
  "server": true,
  "moves": [e2, e3], 
  "request": "piecemoves"
}
```
- Requesting hints from the Chess-Engine (**Unfinished)
```      
Request:
{
  "userID": userid, 
  "request": "hint"
}
Response:
{
  "Users": [userid, null],
  "server": true,
  "move": 'e5e6',
  "FEN": FEN,
  "request": "hint" 
}
```
<br/><br/>   
## Conclusion
Boards can be expanded for greater functionality, however this is what is able to be communicated through MQTT using the ChessMe API. Further information on particular methdos can be seen in the documentation for MQTT. Additionally, within the [Board folder](board), a working board system can be found.
