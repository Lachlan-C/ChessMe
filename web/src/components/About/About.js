import React from 'react';
import { Link } from 'react-router-dom';
import { handleChange } from '../../Helpers'
import $ from 'jquery';


class About extends React.Component {
    constructor()
    {
        super()
    }

    render()
    {
        return (
        <div className="container">
            <h1>About</h1>

            <p>This Project came from the desire to play against the Stockfish Chess API, however, no online solutions allow for this.<br></br>
            To be able to play against this API, we needed to download a program, that wasn't very lightweight.<br></br>
            We wanted to create a webapp to play against Stockfish, but further, we wanted to be able to play against stockfish with a physical board, using our solution to communicate with Stockfish<br></br>
            Here, ChessMe was born. We are currently in development, developing the Webservice and background systems to be able to create a physical board in the future.<br></br>
            <br></br>
            <u1>
                <li>Shaine Christmas: Software Engineering Student at Deakin</li>
                <li>Riley Dellios: Software Engineering Student at Deakin</li>
                <li>Lachlan Cayzer: Software Engineering Student at Deakin</li>
            </u1>
            </p>
        </div>
        )
    }   
}



export default About;