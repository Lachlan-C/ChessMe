import React from 'react';

class Table extends React.Component {

    render()
    {
        const Body = this.props.moves.map((item,index) => (
            
            <tr key={index} className={this.props.index===index ? "table-primary" : ""}><td >{item}</td></tr>
        ))
        return (

            <div style={{maxHeight: "15%", height: "200px", overflowY: "auto", width: "100%"}}>
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
            </div>
        )
    }
}

export default Table;