import React from 'react';
import Team from './Team';
import Challenger from './Challenger';
import { handleChange } from '../../Helpers'

class CreateGame extends React.Component {
    constructor()
    {
        super()
        this.state = {
            isCPU: true,
            Team: 'white',
            Challenger: ''

        }
        this.handleChallenger = handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleTeam = this.handleTeam.bind(this)
        this.handleChallengerRadio = this.handleChallengerRadio.bind(this)
    }

    //handle form submission
    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
    }

    //handle the team
    handleTeam(e) {
        this.setState((prevState) => ({
            Team: prevState.Team === 'black' ? 'white' : 'black'
        }))
    }

    //Handler for the 'Challenger Radio Button'
    handleChallengerRadio() {
        this.setState(prevState => ({
            isCPU: !prevState.isCPU
        }))
    }


    render()
    {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="container">
                <h1>Create Game</h1>
                    
                    <Challenger 
                        handleRadio={this.handleChallengerRadio} 
                        isCPU={this.state.isCPU}
                        handleChange={this.handleChallenger} 
                        Challenger={this.state.Challenger} 
                    /> 
                    <br></br>
                    <Team 
                        handleClick={this.handleTeam} 
                        Team={this.state.Team}
                    />
                    <br></br>
                    <button className="btn btn-success">Create Game</button> 
                </div>
            </form>
        )
    }   
}



export default CreateGame;