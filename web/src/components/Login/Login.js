import React from 'react';
import { Link } from 'react-router-dom';
import { handleChange } from '../../Helpers'
import $ from 'jquery';


class Login extends React.Component {
    constructor()
    {
        super()
        this.state = {
            username: '',
            password: '',
            loggedIn: false,
            response: ''
        }
        
        this.handleChange = handleChange.bind(this);
        this.onLogin = this.onLogin.bind(this);
    }

    onLogin(){
        this.setState({response: ""})
        $.post(`${process.env.REACT_APP_API_URL}/user/login`,{'username': this.state.username, 'password': this.state.password}).then(response => {
            if (response === 'userError') this.setState({response: "username does not exist"});
            else if(response === 'passError') this.setState({response: "password is incorrect"});
            else this.setState({loggedIn: true});
        });
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
            <button className="btn btn-success" onClick={this.onLogin}>Login</button>
            <div id='Reponse'>{this.state.response}</div>
            
            <p>Don't have an account? Create one <Link to="/registration">here</Link></p>
        </div>
        )
    }   
}



export default Login;