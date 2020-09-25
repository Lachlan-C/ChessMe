# ChessMe
## Trello Roadmap
https://trello.com/b/YcHyE4Pq/chessme
<br/><br/>
## How to Connect a board
1. Find the board ID for the board (present with the [.env](board/.env)) (note: this should be changed once downloaded).
2. Navigate to the [FrontEnd](http://chessme.freemyip.com/register) of the system, and login/register.
3. Launch the board (with our current testing board, this can be done by launching the [Launch.bat](board/launch.bat) on windows, and on mac and Linux, the following command can be run inside the board folder:
  ```  
  sh Launch.sh
  ```
4. While the board is running, go to the [Config](http://chessme.freemyip.com/configuration) page on the FrontEnd, enter the BoardID, and press `'Pair'`
5. This should pair the board with the user. Now, the board will be connected to any new games created. However, this process must be repeated everytime the board is turned off.

## Self hosted
If you would like to run this yourself please use our docker install scripts to get it running.  
1. First thing that you will need to do is make sure that you run have all of the parts of the project which you will need to host. These are the MQTT, API and WEB. All of these need to be run in order to get a fully functional system.
   
2. The next step that you need to do is add your own environment file in order to make sure that each of these sections can communicate with the other. This means that you will have to change up the URLs from being local host to the actual destination in which you will be using.
   
3. After this has been completed next your will have to go into the api, mqtt and web and build the docker image for each of them. This will be simple as within each of these sections there is a docker file that will build it for you. You will need to run the command ``` docker build -t chessmeweb . ``` within each of these sections in order to build the image. This command will need to be changed a bit depending on which part of the project you are trying to build.
   
4. After you have built you will need to run the image. This can easily be done with commands like ``` docker run -it -p 3000:3000 chessmeweb ```. Make sure when you are trying to run each section of the project to replace the port number within this command to what ever port is required by that part of the project. This will allow the project to run on any server with simple docker containers. While calling the command to run the docker container you can also add the argument ```-d``` to run your docker images in the background allowing you to start up multiple containers from the same terminal instance. 