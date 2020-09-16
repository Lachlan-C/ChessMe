import React from 'react';
import CreateGame from './components/CreateGame/CreateGame'
import GameHistory from './components/GameHistory/GameHistory'
import Login from './components/Login/Login'
import Header from './components/Header/Header'
import Game from './components/Game/Game'
import Registration from './components/Registration/Registration'
import About from './components/About/About'
import $ from 'jquery';
import { handleChange } from './Helpers'


import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

class App extends React.Component {
    constructor () {
        super()
        this.state = {
          username: "",
          password: "",
          loggedIn: localStorage.getItem('user') ? true : false,
        }
        this.handleClick = this.handleClick.bind(this)
        this.onLogin = this.onLogin.bind(this)
        this.handleChange = handleChange.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
    }
    
    onLogin(){
      $.post(`${process.env.REACT_APP_API_URL}/user/login`,{'username': this.state.username, 'password': this.state.password}).then(response => {
          console.log(response)
          if (response === 'userError') this.setState({response: "username does not exist", error: true});
          else if(response === 'passError') this.setState({response: "password is incorrect", error: true});
          else 
          {
              this.setState({loggedIn: true, error: false, response: ''});
              localStorage.setItem('user', this.state.username)
          }
      });
    }

    //Handles logout
    handleLogout() { 
    this.setState({loggedIn: false})
    localStorage.removeItem('user')
    }

    
    handleClick() {
      this.setState((prevState => ({
        total: prevState.total + + prevState.add
      })))
    }
      
    render()
    {
        return (
            <Router>
              <Header loggedIn={this.state.loggedIn} handleClick={this.handleLogout}/>
              <Switch>
                <Route path="/game-history">
                  <GameHistory/>
                </Route>
                <Route path="/registration">
                  <Registration/>
                </Route>
                <Route path="/login">
                  <Login 
                  handleClick={this.onLogin} 
                  message={this.state.response} 
                  error={this.state.error} 
                  handleChange={this.handleChange} 
                  username={this.state.username} 
                  password={this.state.password}
                  />
                </Route>
                <Route path="/create-game">
                  <CreateGame/>
                </Route>
                <Route path="/About">
                  <About/>
                </Route>
                <Route path="/">
                  <Game />
                </Route>
              </Switch>
          </Router>
        )
    }
}

export default App;