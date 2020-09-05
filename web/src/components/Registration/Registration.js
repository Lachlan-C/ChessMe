import React from 'react';
import { Link } from 'react-router-dom';
import { handleChange } from '../../Helpers'


class Registration extends React.Component {
    constructor()
    {
        super()
        this.state = {
            username: '',
            password: '',
            confirm: ''
        }
        
        this.handleChange = handleChange.bind(this)
    }
    render()
    {
        return (
        <div className="container">
            <h1>Register</h1>

            <label htmlFor="login-user">username</label>
            <input 
                type="text" 
                className="form-control" 
                id="login-user" 
                name="username" 
                onChange={this.handleChange}
                value={this.state.username}
            ></input>
            
            <label htmlFor="login-pass">password</label>
            <input 
                type="text" 
                className="form-control" 
                id="login-pass" 
                name="password" 
                onChange={this.handleChange}
                value={this.state.password}
            ></input>
            
            <label htmlFor="login-confirm">confirm password</label>
            <input 
                type="text" 
                className="form-control" 
                id="login-confirm" 
                name="confirm" 
                onChange={this.handleChange}
                value={this.state.confirm}
            ></input>
            
            <div id="login-message" className={this.props.error ? "alert alert-danger" : ""}>{this.props.error}</div>
            <button className="btn btn-success">Register</button>
            
            <p>Already have an account? Login <Link to="/login">here</Link></p>
        </div>
        )
    }   
}



export default Registration;