import React from 'react';


class Challenger extends React.Component {
    constructor()
    {
        super()
        this.state = {
            isCPU: true
        }

        this.handleChange = this.handleChange.bind(this)
    }


    handleChange() {
        this.setState(prevState => ({
            isCPU: !prevState.isCPU
        }))
    }


    render()
    {
        return (
        <div>
        <div onChange={this.handleChange}>
            <input type="radio" name="isCPU" value="true" id="CPU"></input>

            <input type="radio" name="isCPU" id="USER" value="false"></input>
            
        </div>

        {this.state.isCPU ? <input type="range"></input> : <input type="text"></input>}
        </div>

        )
    }   
}



export default Challenger;


