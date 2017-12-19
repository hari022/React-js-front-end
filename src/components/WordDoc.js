import React, { Component } from 'react';
import axios from  'axios';

class WordDoc extends Component {
    //let products_state = [];
    constructor(props){
        super(props);
        // console.log(this.props.products);
        this.state ={
            data:[]

        }


    }
//Gets all the data from the database
    componentWillMount(){
        fetch('http://127.0.0.1:8000/api/details',{
            method: 'GET'
        }).then(response => response.json()).then(
            (data) => {
                console.log('state',data);
                // if (this.state.alert_success_call){
                //     this.deleteAlertSuccess();
                // }
                this.setState({
                    data:data
                })
            }
        );


    }

    render() {
            return(
                <div className="container">
                    <table>
                        <tbody>


                        <tr>
                            <th>id</th>
                            <th>ProductId</th>
                            <th>DateTIme</th>
                            <th>Longitude</th>
                            <th>Latitude</th>
                            <th>Elevation</th>

                        </tr>
                        {this.state.data.map(product=>
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.productid}</td>
                                <td>{product.datetime}</td>
                                <td>{product.longitude}</td>
                                <td>{product.latitude}</td>
                                <td>{product.elevation}</td>
                            </tr>

                        )}
                        </tbody>
                    </table>
                </div>
            );
        }



}

export default WordDoc;