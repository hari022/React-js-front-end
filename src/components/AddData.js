import React, { Component } from 'react';
import axios from  'axios';
import './adddata.css';
class AddData extends Component {
    //let products_state = [];
    constructor(props){
        super(props);
       // console.log(this.props.products);
        this.state ={
            displayForm:false,
            productId:null,
            newRecord:{},
            date:'',
            longitude:'',
            latitude:'',
            elevation:'',
            time:'',
            message:false,
            newProduct:false,
            newProductName:''
        }

        this.handleChange = this.handleChange.bind(this);


    }


// onChange method on each form input will call this handleChange method: Params(event object)
    handleChange(event) {
        let date;
        let time;
        let longitude;
        let latitude;
        let elevation;
       let newState = [];

        if (event.target.name == 'date'){

            this.setState({
                date:event.target.value
            })

        }else if(event.target.name == 'time'){

            this.setState({
                time: "T"+event.target.value + "-05:00" //Append T and -5:00 to the collected time data
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

        }else if(event.target.name == 'newProduct'){

            this.setState({
                newProductName:event.target.value // If new product is generated then add its name to state of the application
            })

        }
    }
// If new product is generated then add it to products table, here I have used axios for the post operation
    addNewProduct(){
        axios.post('http://127.0.0.1:8000/api/newProduct', {
            "productName":this.state.newProductName

        }).then( (response)=> {
            console.log(response.data);
            this.setState({
                message:false,
                displayForm:true,
                newProduct:false,
                productId:response.data //Grab the Id of newly generated product
            })
        })
            .catch(function (error) {
                console.log(error);
            });
    }
// Method will save new detail to the details table
    submit(){
        axios.post('http://127.0.0.1:8000/api/newRecord', {
            "date":this.state.date + this.state.time,
            "elevation":this.state.elevation,
            "latitude":this.state.latitude,
            "longitude":this.state.longitude,
            "productId":this.state.productId

        }).then( (response)=> {
                console.log(response);
                this.setState({
                    message:true,
                    displayForm:false
                })
            })
            .catch(function (error) {
                console.log(error);
            });

        // event.preventDefault();
    }

    //Main render method
    render() {
        const {displayForm, message, newProduct} = this.state;
        //console.log(displayForm)
        // Conditional rendering for the list of products
        if (!displayForm && !message && !newProduct){
            return (
                <div className="container">
                    <h1>Please select a product to Add new record or <button  onClick={()=>this.setState({newProduct:true})} className="btn btn-success">Creat new Product</button></h1>
                    {this.props.products.map(product=>
                        <span key={product.id}>
                            <button onClick={()=>this.setState({displayForm:true, productId:product.id})}  className="btn btn-info"><h3>{product.productdescription}</h3></button>
                        </span>
                    )}

                    <button className="btn btn-danger" type="button" onClick={()=>window.location.reload()}>Close</button>
                </div>

            );
        //Conditional rendering for the form
        }else if (displayForm && !message && !newProduct){
            return (
                <div className="container">
                    <h1>Please enter the required details</h1>
                    <form>

                        <label>
                            Date:
                            <input className="form-control" type="date" name="date" value={this.state.newRecord.date} onChange={this.handleChange} />
                        </label>
                        <label>
                            Time:
                            <input className="form-control" type="time" step="2" name="time" value={this.state.newRecord.time} onChange={this.handleChange} />
                        </label>
                        <label>
                            Longitude:
                            <input className="form-control" type="text" name="longitude" value={this.state.newRecord.longitude} onChange={this.handleChange} />
                        </label>
                        <label>
                            latitude:
                            <input className="form-control" type="text" name="latitude" value={this.state.newRecord.latitude} onChange={this.handleChange} />
                        </label>
                        <label>
                            Elevation:
                            <input className="form-control" type="text" name="elevation" value={this.state.newRecord.elevation} onChange={this.handleChange} />
                        </label>

                    </form>
                    <button className="btn btn-success" onClick={()=>this.submit()}>Submit</button>
                </div>

            );
            //Conditional rendering for the message
        }else if(!displayForm && message && !newProduct){
            return (
                <div className="container">
                   <h1>Data Submitted</h1>
                    <button className="btn btn-danger" onClick={()=>window.location.reload()}>Ok</button>
                </div>

            );
            //Conditional rendering for the form to add new product
        }else if(!displayForm && !message && newProduct){
            return (
                <div className="container">
                    <h1>Create</h1>
                    <form>

                        <label>
                            Name:
                            <input className="form-control" type="text" name="newProduct"  onChange={this.handleChange} />
                        </label>

                    </form>
                    <button className="btn btn-Success" onClick={()=>this.addNewProduct()}>Add Product</button>
                </div>

            );
        }

    }
}

export default AddData;