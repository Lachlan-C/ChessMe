import React from 'react';


class Challenger extends React.Component {
    constructor()
    {
        super()
        this.state = {
            isCPU: true
        }

        this.handleChange = this.handleChange.bind(this)
    }


    handleChange() {
        this.setState(prevState => ({
            isCPU: !prevState.isCPU
        }))
    }


    render()
    {
        return (
        <div>
        <div className="input-group" onChange={this.handleChange}>
        <div className="btn-group">
            <label className="btn btn-light" htmlFor="USER">
                <input  type="radio" name="isCPU" id="USER"></input>
            CPU</label>    
            <label className="btn btn-light" htmlFor="CPU">
                <input type="radio" name="isCPU" id="CPU"></input>
            User</label>
        </div>

        </div>
        <input className="form-control" type="text" placeholder={this.state.isCPU ? "difficulty" : "user-id"}></input>

        </div>

        )
    }   
}



export default Challenger;


