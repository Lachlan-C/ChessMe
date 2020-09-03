import Chessboard from "chessboardjsx";
import React from 'react';
import GameController from './GameController'

class Game extends React.Component {
    render()
    {
        return (
            <div>
                <textarea id="moves" name="moves"></textarea>
                <Chessboard position="start"/>

                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <button className="btn btn-primary">Recommend Move</button>
                    </div>
                        <input type="text" placeholder="difficulty"></input>
                </div>

                    <GameController />
                    <button className="btn btn-success">Replay</button>
            </div>  
        )
    }   
}



export default Game;