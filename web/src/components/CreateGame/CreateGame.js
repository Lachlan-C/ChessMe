import React from 'react';
import Team from './Team';
import Challenger from './Challenger';
import { handleChange, handleChange20 } from '../../Helpers'
import $ from 'jquery'


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
        this.handleClick = this.handleClick.bind(this)
        this.handleTeam = this.handleTeam.bind(this)
        this.handleChallengerRadio = this.handleChallengerRadio.bind(this)
        this.handleDifficulty = handleChange20.bind(this)
    }

    //handle form submission
    handleClick() {
        let PlayerID
        let EnemyID
        let Difficulty
        $.get(`${process.env.REACT_APP_API_URL}/user/${localStorage.getItem('user')}`).then(user => {      
                if (!this.state.isCPU)
                {
                    if (this.state.Team == 'white')
                    {
                        PlayerID  = user[0].userID
                    EnemyID = this.state.Challenger
                    }
                    else if (this.state.Team == 'black')
                    {
                        EnemyID = this.state.Challenger
                        PlayerID = user[0].userID
                    }
                }
                else
                {
                    PlayerID = user[0].userID;
                    EnemyID = ""
                    Difficulty = this.state.Challenger
                }
                $.post(`${process.env.REACT_APP_API_URL}/chess/NewGame`,{PlayerID:PlayerID, EnemyID:EnemyID, Difficulty}).then(response => {
                    console.log(response)
                });
        })
    }

    //handle the team
    handleTeam(e) {
        if (!this.state.isCPU)
        {
            this.setState((prevState) => ({
                Team: prevState.Team === 'black' ? 'white' : 'black'
            }))
        }
    }

    //Handler for the 'Challenger Radio Button'
    handleChallengerRadio() {
        this.setState(prevState => ({
            isCPU: !prevState.isCPU,
            Team: 'white',
            Challenger: ""
        }))
    }


    render()
    {
        return (
            <div className="container">
                <h1>Create Game</h1>
                    
                    <Challenger 
                        handleRadio={this.handleChallengerRadio} 
                        isCPU={this.state.isCPU}
                        handleChange={this.state.isCPU ? this.handleDifficulty : this.handleChallenger} 
                        Challenger={this.state.Challenger} 
                    /> 
                    <br></br>
                    <Team 
                        handleClick={this.handleTeam} 
                        Team={this.state.Team}
                    />
                    <br></br>
                    <button onClick={this.handleClick} className="btn btn-success">Create Game</button> 
            </div>
        )
    }   
}



export default CreateGame;