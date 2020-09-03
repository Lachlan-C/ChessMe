import Chessboard from "chessboardjsx";
import React from 'react';
import GameController from './GameController'



class Game extends React.Component {
    constructor()
    {
        super()

        this.state = {
            position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
            undo: true
        }
        this.stepForward = this.stepForward.bind(this)
        this.stepBack = this.stepBack.bind(this)
    }
    

    
    stepForward()
    {
        this.setState({
        
            position: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'
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
                    id="random"
                    undo={this.state.undo}
                    onPieceClick={this.onDragStart}
                    onDrop={this.onDrop}/>

                {/* <WithMoveValidation/> */}

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