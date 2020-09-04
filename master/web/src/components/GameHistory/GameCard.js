import React from 'react';
import Game from './Game'

class GameCard extends React.Component {
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
            <div className="card">
                <div className="card-body">
                    <button onClick={() => this.setState(prevState => ({isOpen: !prevState.isOpen}))} className="btn btn-outline-dark">{this.props.status} {this.props.date}</button>
                    {this.state.isOpen ? <Game gameID={this.props.gameID}/> : ''}
                </div>
            </div>
        )
    }   
}



export default GameCard;