import React from 'react';
import { Link } from 'react-router-dom';
import { handleChange } from '../../Helpers'


class Login extends React.Component {
    constructor()
    {
        super()
        this.state = {
            username: '',
            password: ''
        }
        
        this.handleChange = handleChange.bind(this)
    }
    render()
    {
        return (
        <div className="container">
            <h1>Login</h1>

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
            
            <div id="login-message" className={this.props.error ? "alert alert-danger" : ""}>{this.props.error}</div>
            <button className="btn btn-success">Login</button>
            
            <p>Don't have an account? Create one <Link to="/registration">here</Link></p>
        </div>
        )
    }   
}



export default Login;