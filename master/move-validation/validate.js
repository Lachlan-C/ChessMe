const { Chess } = require('chess.js');
var game = new Chess();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

//Cross-Origin Request Headers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const port = process.env.PORT || 5000;

function onDrop (source, target) {
  var move = game.move({
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
    game = new Chess(FEN);
    res.send({valid: onDrop(to,from), FEN: game.fen()});
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});