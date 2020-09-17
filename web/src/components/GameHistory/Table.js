import React from 'react';

class Table extends React.Component {

    render()
    {
        const Body = this.props.moves.map((item,index) => (
            
            <tr key={index} className={this.props.index===index ? "table-primary" : ""}><td >{item}</td></tr>
        ))
        return (
            <table className="table">
            <thead>
                <tr>
                    <th>Moves</th>
                </tr>
            </thead>
            <tbody>
                {Body}
            </tbody>
            </table>
        )
    }
}

export default Table;