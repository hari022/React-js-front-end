import React, { Component } from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
import axios from  'axios';
class UpdateData extends Component {
    //let products_state = [];
    constructor(props){
        super(props);
        // console.log(this.props.products);
        this.state ={
            dateTime:'',
            longitude:'',
            latitude:'',
            elevation:'',
            productId:null,
            detailId:null,
            message:false

        }

        this.handleChange = this.handleChange.bind(this);

    }
// onChange method on each form input will call this handleChange method: Params(event object)
    handleChange(event) {
        // let date;
        // let time;
        // let longitude;
        // let latitude;
        // let elevation;
        // let newState = [];

        if (event.target.name == 'date'){
            this.setState({
                dateTime:event.target.value
            })

        }else if(event.target.name == 'longitude'){
            //this.longitude = event.target.value;
            this.setState({
                longitude:event.target.value
            })

        }else if(event.target.name == 'latitude'){
            //this.latitude = event.target.value;
            this.setState({
                latitude:event.target.value
            })

        }else if(event.target.name == 'elevation'){

            this.setState({
                elevation:event.target.value
            })

        }


        }
// Sets the state of the application using life cycle method
        componentWillMount(){
        this.setState({
            productId:this.props.productId,
            detailId:this.props.detailId,
            longitude:this.props.longitude,
            latitude:this.props.latitude,
            elevation:this.props.elevation,
            dateTime:this.props.dateTime
        })
        }
// update detail in the database
        update(){
            axios.post('http://127.0.0.1:8000/api/updateDetail', {
                "date":this.state.dateTime,
                "elevation":this.state.elevation,
                "latitude":this.state.latitude,
                "longitude":this.state.longitude,
                "productId":this.state.productId,
                "detailId":this.state.detailId

            }).then( (response)=> {
                console.log(response);
                this.setState({
                    message:true
                })
                console.log(this.state.message)
            })
                .catch(function (error) {
                    console.log(error);
                });

        }
//main render method
    render() {
            const {message} = this.state
            if (!message){
                return(
                    <div className="container">
                        <h2>Product Name: {this.props.productName}</h2>
                        {/*Form to update the data*/}
                        <form>

                            <label>
                                Date:
                                <input className="form-control" type="text" name="dateTIme" onFocus={()=>this.value=''}  value={this.props.dateTime} onChange={this.handleChange} />
                            </label>
                            <label>
                                Longitude:
                                <input className="form-control" type="text" name="longitude" onFocus={()=>this.value=''} value={this.state.longitude} onChange={this.handleChange} />
                            </label>
                            <label>
                                latitude:
                                <input className="form-control" type="text" name="latitude" onFocus={()=>this.value=''} value={this.props.latitude} onChange={this.handleChange} />
                            </label>
                            <label>
                                Elevation:
                                <input className="form-control" type="text" name="elevation" onFocus={()=>this.value=''} value={this.props.elevation} onChange={this.handleChange} />
                            </label>

                        </form>

                        <button onClick={()=>this.update()} className="btn btn-success">Update</button>
                    </div>
                );
            //    Message on success
            }else if (message){
                return (
                    <div className="container">
                        <h1>Data Submitted</h1>
                        <button className="btn btn-danger" onClick={()=>window.location.reload()}>Ok</button>
                    </div>

                );
            }


    }
}

export default UpdateData;