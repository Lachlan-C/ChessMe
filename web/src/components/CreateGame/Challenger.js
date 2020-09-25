import React from 'react';


class Challenger extends React.Component {
    render()
    {
        return (
        <div>
        <div className="input-group" onChange={this.props.handleRadio}>
        <div className="btn-group">
            <label className="btn btn-light" htmlFor="USER">
                <input  type="radio" name="isCPU" id="USER" checked={this.props.isCPU}></input>
            CPU</label>    
            <label className="btn btn-light" htmlFor="CPU">
                <input type="radio" name="isCPU" id="CPU" checked={!this.props.isCPU}></input>
            User</label>
        </div>

        </div>
        <input name="Challenger" value={this.props.Challenger} className="form-control" type="text" onChange={(e) => this.props.handleChange(e)} placeholder={this.props.isCPU ? "difficulty [0-20]" : "user-id"}></input>

        </div>

        )
    }   
}



export default Challenger;


