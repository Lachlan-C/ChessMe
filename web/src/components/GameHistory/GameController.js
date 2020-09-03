import React from 'react';

class GameController extends React.Component {
    constructor()
    {
        super()

        this.state = {
            isOpen: false
        }
    }

    render()
    {
        return (
            <div className="btn-group">
                <button className="btn btn-light" onClick={this.props.stepForward}>+Step</button>
                <button className="btn btn-light">Play</button>
                <button className="btn btn-light">Pause</button>
                <button className="btn btn-light" onClick={this.props.stepBack}>-Step</button>
            </div>
        )
    }   
}



export default GameController;