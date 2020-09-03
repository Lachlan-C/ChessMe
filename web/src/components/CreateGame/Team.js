import React from 'react';


class Team extends React.Component {
    constructor() 
    {
        super()
        this.state = {
            isBlack: true
        }
    
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() 
    {
        this.setState((prevState) => ({
            isBlack: !prevState.isBlack
        }))
    }

    render()
    {
        return (
            <div className="input-group-text" style={{backgroundColor: this.state.isBlack ? "black" : "white"}}>
                <button className="btn" onClick={this.handleClick}>Team</button> 
            </div>
        )
    }   
}



export default Team;