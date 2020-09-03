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
            <div className="input" style={{backgroundColor: this.state.isBlack ? "black" : "white", border:"1px solid black"}}>
                <button className="btn btn-primary" onClick={this.handleClick}>Team</button> 
            </div>
        )
    }   
}



export default Team;