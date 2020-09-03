import WithMoveValidation from './WithMoveValidation'
import React from 'react';



class Game extends React.Component {
    render()
    {

        return (
            <div className="container">
                <h1>Game</h1>
                    <WithMoveValidation/>
                </div>
        )
    }   
}


export default Game;