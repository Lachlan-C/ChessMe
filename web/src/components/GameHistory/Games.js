import React from 'react';
import GameCard from './GameCard'
import $ from 'jquery'


class Games extends React.Component {
    constructor()
    {
        super()
        this.state = { 
            gamesArray: []
        }
    }


    componentDidMount() {  
        //console.log(localStorage.getItem('user'))
        $.get(`${process.env.REACT_APP_API_URL}/user/${localStorage.getItem('user')}`).then(user => {
            //console.log(JSON.stringify(user))
            //console.log(user[0].userID)
            
            
            $.get(`${process.env.REACT_APP_API_URL}/user/${user[0].userID}/games`).then(response => {
                    //console.log(response)
                    this.setState({gamesArray: response})
                })
            })
    }
    
    
    render()
    {
        console.log("this" + this.state.gamesArray)
        const Games = this.state.gamesArray.map((item) => (
            <GameCard key={item.GameID} status={item.Winner} date={`${item.DateTimeStart.split("T")[0]} ${item.DateTimeStart.split("T")[1].split(".")[0]}`} gameID={item.GameID} onClick="ShowCardFunctionHere"/>
        ))
            
            return (
            <div>
                {Games}
            </div>
        )
    }   
}



export default Games;

// const Games = this.gamesArray.map((item) => (
//     <GameCard key={item.gameID} status={item.status} date={item.DateTime} gameID={item.gameID} onClick="ShowCardFunctionHere"/>
//     ))
    