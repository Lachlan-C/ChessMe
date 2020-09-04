import React from 'react';
import Team from './Team';
import Challenger from './Challenger';
import Chessboard from "chessboardjsx";


class CreateGame extends React.Component {
    constructor()
    {
        super()
        this.state = {
            isCPU: true
        }
    }

    render()
    {
        return (
            <div>

                <Challenger/> 
                <Team/>

                <button >Create Game</button> 
            </div>
        )
    }   
}



export default CreateGame;