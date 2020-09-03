import React from 'react';
import Team from './Team';
import Challenger from './Challenger';


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
            <div className="container">
            <h1>Create Game</h1>
                
                <Challenger/> 
                <br></br>
                <Team/>
                <br></br>
                <button className="btn btn-success">Create Game</button> 
            </div>
        )
    }   
}



export default CreateGame;