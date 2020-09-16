const mqtt = require('mqtt');
const express = require('express');
const bodyParser = require('body-parser');
const jquery = require('jquery');

var connected = false;
var GameID, userID;
const boardID = 1234;

const app = express();

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
    connected = true;
    console.log('Connected'); //Can access the mqtt broker.
    client.subscribe(`${mqtt_base_path}/#`, err => {
        if (!err) console.log(`Subscribed to ${mqtt_base_path}/#`);
    });
    client.publish(`${mqtt_base_path}/board/1234`, JSON.stringify({"userID":"12345678","request":"pair"}));
});

client.on('message', (topic, message) => {
    console.log(`message: ${message}`);
    topic = topic.slice(1).split('/');
    if(topic[2]){
        const mes = JSON.parse(message);
        if (topic[2].match(`board`)){
            if((topic[3] == boardID)&&(mes.request == 'pair')) {
                userID = mes.userID;
                console.log('Paired');
            }
        }else if(connected == false) {
            return;
        }else if(mes.request === 'newGame') {
            //newGame code
        }else if(mes.request === 'hint') {
            //hint code
        }else if(mes.request === 'validate') {
            //validate moves code
        }else if(mes.request=== 'piecemoves') {
            //piecemoves code
        }
    }
});






//display chessboard.html
app.get('/', (req,res)=>{
    res.sendFile(`${__dirname}/public/Chessboard.html`);
})






//Listening on port 3000
app.listen(3000, () => {
    console.log('listening on port 3000');
});
