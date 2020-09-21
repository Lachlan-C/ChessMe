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

test('/game/:gameid/fen /GET', () => {
    expect.assertions(1);
    return fetch(`${API_URL}/game/12345678/fen`, {method: 'GET'})
    .then(res => res.json())
    .then(res => 
        expect(res.FENs[0]).toEqual("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
    )
})

test('/user/board/pair /POST', () => {
    let body = {
        userID: "00000001",
        boardID: "1111"
    }
    expect.assertions(1);
    return fetch(`${API_URL}/user/board/pair`, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }} )
    .then(res => res.json())
    .then(res => 
        expect(res[0].boardID).toEqual('1111')
        )
})

test('/user/login /POST', () => {
    let body = {
        username: "Riley",
        password: "testing"
    }
    expect.assertions(1);
    return fetch(`${API_URL}/user/login`, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }} )
    .then(res => res.text())
    .then(res => 
        expect(res).toEqual("loggedIn")
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


/*************************
I DONT SEND ANY RESPONSE YET AFAIK
***************************/
// test('/user/register /POST', () => {
//     let body = {
//         username: "Magical",
//         password: "jest"
//     }
//     expect.assertions(1);
//     return fetch(`${API_URL}/user/register`, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }} )
//     .then(res => res.text())
//     .then(res => 
//         expect(res).toEqual("00000001")
//         )
// })

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

test('/validate/move /POST', () => {
    let body = {
        GameID: "12345678",
        move: "f7f6",
        UserID: "00000001"
    }
    expect.assertions(1);
    return fetch(`${API_URL}/validate/move`, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }} )
    .then(res => res.json())
    .then(res => 
        expect(res.Users[0]).toEqual("00000001")
        )
})

test('/chess/moves /POST', () => {
    let body = {
        GameID: "12345678",
        piecePos: "g7"
    }
    expect.assertions(1);
    return fetch(`${API_URL}/chess/moves`, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }} )
    .then(res => res.json())
    .then(res => 
        expect(res[0]).toEqual('g6')
        )
    })
    
// test('/chess/NewGame /POST', () => {
//     let body = {
//         PlayerID: "00000001",
//         EnemyID: "00000003"
//     }
//     expect.assertions(1);
//     return fetch(`${API_URL}/chess/NewGame`, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }} )
//     .then(res => res.text())
//     .then(res => 
//         expect(res).toHaveLength(8)
//         )
// })

test('/chess/reconnect /POST', () => {
    let body = {
        username: "Riley",
        gameID: "12345678"
    }
    expect.assertions(1);
    return fetch(`${API_URL}/chess/reconnect`, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }} )
    .then(res => res.text())
    .then(res => 
        expect(res).toEqual("success")
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






