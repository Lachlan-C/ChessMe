const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config();

const { API_URL, MQTT_URL } = process.env;

test('/test /GET', () => {
    expect.assertions(1);
    return fetch(`${API_URL}/test`, {method: 'GET'})
    .then(res => res.text())
    .then(res => 
        expect(res).toEqual('I am the tester!')
    )
})

test('/user/:userid/games /GET', () => {
    expect.assertions(1);
    return fetch(`${API_URL}/user/00000001/games`, {method: 'GET'})
    .then(res => res.json())
    .then(res => 
        expect(res[0].GameID).toEqual("12345678")
    )
})

test('/user/:username /GET', () => {
    expect.assertions(1);
    return fetch(`${API_URL}/user/Riley`, {method: 'GET'})
    .then(res => res.json())
    .then(res => 
        expect(res[0].userID).toEqual("00000001")
    )
})

test('/game/:gameid/fen /GET', () => {
    expect.assertions(1);
    return fetch(`${API_URL}/game/12345678/fen`, {method: 'GET'})
    .then(res => res.json())
    .then(res => 
        expect(res.FENs[0]).toEqual("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
    )
})

test('/board/pair /POST', () => {
    let body = {
        userID: "12345",
        boardID: "7888888"
    }
    expect.assertions(1);
    return fetch(`${MQTT_URL}/board/pair`, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }} )
    .then(res => res.text())
    .then(res => 
        expect(res).toEqual('message has been sent!')
        )
})

test('/game/connect /POST', () => {
    let body = {
        gameID: "1234",
        userID: ["00000001", "00000002"],
        boardID: ["1234", "6666"]
    }
    expect.assertions(1);
    return fetch(`${MQTT_URL}/game/connect`, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }} )
    .then(res => res.text())
    .then(res => 
        expect(res).toEqual('message has been sent!')
        )
})

test('/stockfish/move /POST', () => {
    let body = {
        GameID: "12345678",
        FEN: "rnbqkbnr/pp1ppppp/8/2p5/5PK1/8/PPPPP1PP/RNBQ1BNR b kq - 0 1",
        difficulty: 20
    }
    expect.assertions(1);
    return fetch(`${API_URL}/stockfish/move`, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }} )
    .then(res => res.text())
    .then(res => 
        expect(res).toEqual('e7e5')
        )
})


test('/chess/moves /POST', () => {
    let body = {
        GameID: "12345678",
        piecePos: "f2"
    }
    expect.assertions(1);
    return fetch(`${API_URL}/chess/moves`, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }} )
    .then(res => res.json())
    .then(res => 
        expect(res[0]).toEqual('f3')
        )
})


//newgame 

//validate move
