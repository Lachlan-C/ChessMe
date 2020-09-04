import React from 'react';


class Login extends React.Component {
    render()
    {
        return (
        <div className="container">
            <h1>Login</h1>

            <label htmlFor="login-user">username</label>
            <input type="text" className="form-control" id="login-user" name="username"></input>
            
            <label htmlFor="login-pass">password</label>
            <input type="text" className="form-control" id="login-pass" name="password"></input>
            
            <div id="login-message" className={this.props.error ? "alert alert-danger" : ""}>{this.props.error}</div>
            <button className="btn btn-success">Login</button>
            
            <p>Don't have an account? Create one Here</p>
        </div>
        )
    }   
}



export default Login;