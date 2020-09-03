import React from 'react';
import CreateGame from './components/CreateGame/CreateGame'
import GameHistory from './components/GameHistory/GameHistory'
import Login from './components/Login/Login'
import Header from './components/Header/Header'
import Game from './components/Game/Game'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";



class App extends React.Component {
    constructor () {
        super()
        this.state = {
          total: 0,
          add: 0
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this)
    }
    
    
    handleClick() {
      this.setState((prevState => ({
        total: prevState.total + + prevState.add
      })))
    }
  
    handleChange(event) {
      const { name, value } = event.target;
      if (value.match("^[0-9]+$|$^"))
      {
        this.setState({ 
          [name]: value
        })
      }
    }
      
    render()
    {
        return (
            <Router>
              <Header />
              <Switch>
                <Route path="/game-history">
                  <GameHistory/>
                </Route>
                <Route path="/login">
                  <Login/>
                </Route>
                <Route path="/create-game">
                  <CreateGame/>
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