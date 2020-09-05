import React from 'react';


class Team extends React.Component {
    render()
    {
        return (
            <div name="Team" className="input" onClick={(e) => (this.props.handleClick(e))} style={{backgroundColor: this.props.Team, border:"1px solid black"}}>
                <h4 style={{color: 'grey'}}className="text-center">Select Team</h4>
            </div>
        )
    }   
}



export default Team;