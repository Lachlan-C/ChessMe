import React from 'react';
import Game from './Game'

class GameCard extends React.Component {
    constructor()
    {
        super()

        this.state = {
            isOpen: false
        }
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() 
    {
        this.setState(prevState => ({isOpen: !prevState.isOpen}))
    }

    render()
    {
        return (
            <div className="card">
                <div className="card-body">
                    <button onClick={this.handleClick} className="btn btn-outline-dark">{this.props.status} {this.props.date}</button>
                    {this.state.isOpen ? <Game gameID={this.props.gameID} status={this.props.status}/> : ''}
                </div>
            </div>
        )
    }   
}



export default GameCard;