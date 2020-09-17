import React from 'react';
import Games from './Games'

class App extends React.Component {

    render()
    {
        return (
            <div className="container">
                <h1>Game History</h1>
                <Games/>
            </div>
        )
    }
}

export default App;