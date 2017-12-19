import React, { Component } from 'react';

class Nav extends Component {
    //let products_state = [];
    constructor(props){
        super(props);
    }


    render() {

        return (
            <div>
                <nav className="navbar navbar-inverse">
                    <div className="container">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="#">Texada Software - Task</a>
                        </div>
                    </div>
                </nav>
            </div>

        );
    }
}

export default Nav;