import Chessboard from "chessboardjsx";
import React from 'react';
import GameController from './GameController'

class Game extends React.Component {
    constructor()
    {
        super()

        this.state = {
            position: 'start'
        }
        this.stepForward = this.stepForward.bind(this)
        this.stepBack = this.stepBack.bind(this)
    }

    stepForward()
    {
        this.setState({
            position: 'rnbqkbnr/pppppppp/8/8/6P1/8/PPPPPPP1/RNBQKBNR'
        })
    }

    stepBack()
    {
        this.setState({
            position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'
        })
    }

    render()
    {

        return (
            <div>
                <textarea id="moves" name="moves"></textarea>
                <Chessboard position={this.state.position}
                    transitionDuration={20}
                />

                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <button className="btn btn-primary">Recommend Move</button>
                    </div>
                        <input type="text" placeholder="difficulty"></input>
                </div>

                    <GameController stepForward={this.stepForward} stepBack={this.stepBack}/>
                    <button className="btn btn-success">Replay</button>
            </div>  
        )
    }   
}



export default Game;