import React from 'react';
import $ from 'jquery'
import Chessboard from "chessboardjsx";

class WithMoveValidation extends React.Component {
    constructor() 
    {
        super()
        this.state = {
            fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        }
    } 


    onDrop = ({ sourceSquare, targetSquare }) => {
        // see if the move is legal
        $.post(`${process.env.REACT_APP_API_URL}/move`, { FEN: this.state.fen, from: targetSquare, to: sourceSquare }).then(response => {
          console.log(response)  
        //break if nothing needs to be changed eg. illegal move   
        if (response.valid !== 'Legal') {return}
        this.setState(() => ({
          //Update the board!
          fen: response.FEN
        }));
      }
    )};  

    render()
    {
        return (
            <div>
                <Chessboard
                position={this.state.fen}
                onDrop={this.onDrop}
                />
            </div>
        )
    }   
}


export default WithMoveValidation;