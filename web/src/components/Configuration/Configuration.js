import React from 'react';
import { Link } from 'react-router-dom';

class Configuration extends React.Component {
    constructor()
    {
        super()
        this.state = {
            userID: '124949129'
        }
        
    }
    render()
    {
        return (
        <div className="container">
            <h1>Configuration</h1>

            <label htmlFor="userID">User ID</label>
            <input 
                type="text" 
                className="form-control" 
                id="userID" 
                name="userID" 
                disabled={true}
                value={this.state.userID}
            ></input>

            <label htmlFor="boardID">Board ID</label>
            <div className="input-group mb-3">
                <input 
                    type="text" 
                    className="form-control" 
                    id="boardID" 
                    name="boardID" 
                    onChange={this.handleChange}
                ></input>
            
                <button className="btn btn-success" onClick={this.handleClick}>Pair</button>
            </div>
            <div id="pair-message" className={this.props.error ? "alert alert-danger" : ""}>{this.props.message}</div>
        </div>
        )
    }   
}



export default Configuration;