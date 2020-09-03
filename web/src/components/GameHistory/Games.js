import React from 'react';
import GameCard from './GameCard'


class Games extends React.Component {
    gamesArray = [
        {
            gameID: "43",
            status: "Lose",
            DateTime: "26/04/20"
        },
        {
            gameID: "666",
            status: "Win",
            DateTime: "16/06/2019"
        }
    ]
    

    render()
    {
        const Games = this.gamesArray.map((item) => (
        <GameCard status={item.status} date={item.DateTime} gameID={item.gameID} onClick="ShowCardFunctionHere"/>
        ))

        return (
            <div>
                {Games}
            </div>
        )
    }   
}



export default Games;