import Chessboard from "chessboardjsx";
import React from 'react';
import GameController from './GameController'
import $ from 'jquery'
import Table from './Table'
import { handleChange20 } from '../../Helpers'



class Game extends React.Component {
    constructor()
    {
        super()

        this.state = {
            FENs: [],
            Moves: [],
            index: 0,
            position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
            undo: true,
            difficulty: undefined
        }
        this.stepForward = this.stepForward.bind(this)
        this.stepBack = this.stepBack.bind(this)
        this.handleRecommend = this.handleRecommend.bind(this)
        this.handleChange = handleChange20.bind(this)
        this.handleReConPlay = this.handleReConPlay.bind(this)
    }
    

    
    stepForward()
    {
        console.log(this.state.index)
        //console.log(this.state.index)
        console.log(this.state.FENs[this.state.index])
        if (this.state.index < this.state.FENs.length - 1)
        {
            this.setState(prevState => ({
                position: this.state.FENs[this.state.index + 1],
                index: prevState.index + 1
            })
            )
        }
    }

    stepBack()
    {
        console.log(this.state.index)
        if (this.state.index > 0)
        {
            this.setState(prevState => ({
                position: this.state.FENs[this.state.index - 1],
                index: prevState.index - 1
            })
            )
        }
    }

    componentDidMount() {  
        $.get(`${process.env.REACT_APP_API_URL}/game/${this.props.gameID}/fen`).then(game => {
            console.log(game)
            this.setState({
                FENs: game.FENs,
                Moves: game.Moves
            })
        })
    }
    
    handleRecommend() {
        console.log(this.state.FENs[this.state.index])
        console.log(this.state.difficulty)

        $.post(`${process.env.REACT_APP_API_URL}/stockfish/move`,{'difficulty': this.state.difficulty, 'FEN': this.state.FENs[this.state.index]}).then(response => {
            console.log(response)
        });
    }

    handleReConPlay()
    {
        if (!this.props.status)
        {

            //sends the reconnect request
            $.post(`${process.env.REACT_APP_API_URL}/chess/reconnect`, {"gameID": this.props.gameID, "username": localStorage.getItem('user')}).then(response => {
                window.alert(response);
            })
        }
        else
            return
    }

    render()
    {

        return (
            <div>
                <Table moves={this.state.Moves} index={this.state.index}/>
                <Chessboard position={this.state.position}
                    id="random"
                    undo={this.state.undo}
                    onPieceClick={this.onDragStart}
                    onDrop={this.onDrop}/>

                {/* <WithMoveValidation/> */}

                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <button className="btn btn-primary" onClick={this.handleRecommend}>Recommend Move</button>
                    </div>
                        <input value={this.state.difficulty} type="text" placeholder="difficulty" name="difficulty" onChange={this.handleChange}></input>
                </div>
                    <GameController stepForward={this.stepForward} stepBack={this.stepBack}/>
                    <button className="btn btn-success" onClick={this.handleReConPlay}>{this.props.status ? "Replay" : "Reconnect"}</button>
            </div>  
        )
    }   
}



export default Game;