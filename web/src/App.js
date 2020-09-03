import React from 'react';
import CreateGame from './components/CreateGame/CreateGame'
import GameHistory from './components/GameHistory/GameHistory'
import Login from './components/Login/Login'

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
          <div>
            <GameHistory/>
            {/* <Login/> */}
          </div>
        )
    }
}

export default App;