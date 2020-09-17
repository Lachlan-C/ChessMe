import React from 'react';
import { handleChange } from '../../Helpers'
import $ from 'jquery'

class Configuration extends React.Component {
    constructor()
    {
        super()
        this.state = {
            userID: '',
            boardID: ''
        }

        this.handleChange = handleChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    componentDidMount() {  
        //maybe check if the user is logged in first?
        $.get(`${process.env.REACT_APP_API_URL}/user/${localStorage.getItem('user')}`).then(user => {
            this.setState({userID: user[0].userID})
        })
    }

    handleClick()
    {
        $.post(`${process.env.REACT_APP_MQTT_URL}/board/pair`,{'boardID': this.state.boardID, 'userID': this.state.userID}).then(response => {
            console.log(`Pairing response: ${response}`)
        });
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