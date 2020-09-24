# ChessMe
## Trello Access
https://trello.com/b/YcHyE4Pq/chessme
<br/><br/>
## How to Connect a board
1. Find the board ID for the board (present with the [.env](board/.env))
2. Navigate to the [FrontEnd](http://chessme.freemyip.com/register) of the system, and login/register.
3. Launch the board (with our current testing board, this can be done by launching the [Launch.bat](board/launch.bat) on windows.
4. While the board is running, go to the [Config](http://chessme.freemyip.com/configuration) page on the FrontEnd, enter the BoardID, and press `'Pair'`
5. This should pair the board with the user. Now, the board will be connected to any new games created. However, this process must be repeated everytime the board is turned off.
