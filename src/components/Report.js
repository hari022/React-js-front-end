import React, { Component } from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
import axios from  'axios';
class Report extends Component {
    //let products_state = [];
    constructor(props){
        super(props);
        // console.log(this.props.products);
        this.state ={
            products:[],
            productId:null,
            date:'',
            time:'',
            displayForm:false,
            dateTime:'',
            dateTo:'',
            timeTo:'',
            pointA:null,
            pointB:null,
            displayResult:false,
            result:[],
            productName:[],
            confirmation:false,
            reportId:[],
            selectedProducts:false,
            queryParam:''

        }

        this.handleChange = this.handleChange.bind(this);



    }
// onChange method on each form input will call this handleChange method: Params(event object)
    handleChange(event) {
        //this.setState({value: event.target.value});
        // console.log(event.target.value)
        let date;
        let time;
        let longitude;
        let latitude;
        let elevation;
        let newState = [];

        if (event.target.name == 'date'){
            //   console.log(event.target.value)
            // this.date = event.target.value;
            this.setState({
                date:event.target.value
            })

        }else if(event.target.name == 'time'){

            this.setState({
                time: "T"+event.target.value + "-05:00"
            })
        }else if(event.target.name == 'timeTo'){

            this.setState({
                timeTo: "T"+event.target.value + "-05:00"
            })
        }else  if(event.target.name == 'dateTo'){
            this.setState({
                dateTo:event.target.value
            })
        }
    }


    componentWillMount(){

        this.setState({
            products:this.props.products
        })

    }
    //Sets the time range
    submit(){
        const parameterizeArray = (key, arr) => {
            arr = arr.map(encodeURIComponent)
            return 'http://127.0.0.1:8000/api/listings/?'+key+'[]=' + arr.join('&'+key+'[]=')
        }
        let param = parameterizeArray('id', this.state.reportId);
        console.log('param', param)
        // console.log(Date.parse(this.state.date+this.state.time))
        // console.log(Date.parse(this.state.dateTo+this.state.timeTo))

        this.setState({
            pointA:Date.parse(this.state.date+this.state.time),
            pointB:Date.parse(this.state.dateTo+this.state.timeTo)
        })
        fetch(param,{
            method: 'GET'
        }).then(response => response.json()).then(
            (data) => {
                console.log('state',data);
                this.setState({
                    allData:data
                })
                this.getListings();

            }

        );
    }
// gets List of locations in specific time frame using Date.parse() method
    getListings(){
        let listings = []
        for (let data of this.state.allData){
            console.log(Date.parse(data.datetime));
            if(Date.parse(data.datetime)>this.state.pointA && Date.parse(data.datetime)< this.state.pointB ){
                listings.push({
                    longitude: data.longitude,
                    latitude:data.latitude,
                    elevation: data.elevation
                })
            }
        }
        this.setState({
            result:listings,
            displayForm:false,
            displayResult:true
        })
        console.log(listings);

    }

    getLocation(){

        this.setState({
            displayForm:true,
        })

    }
    selectProducts(id,name){
       let reportId = this.state.reportId;
       let reportName = this.state.productName;
        reportName.push(name);
        reportId.push(id)
        this.setState({
            reportId:reportId,
            productName:reportName
        })
        console.log('id',this.state.reportId);
        console.log('name',this.state.productName);
    }
    //Main render method
    render() {
        const {products, displayForm, displayResult, confirmation} = this.state;
        if(!displayForm && !displayResult){
            return(
                <div className="container">
                    <h2>Please Select the Product to generate a report:</h2>
                    {products.map(product=>
                        <span key={product.id}>
                            {/*<button onClick={()=>this.getLocation(product.id, product.productdescription)} className="btn btn-info"><h3>{product.productdescription}</h3></button>*/}
                            <button onClick={()=>this.selectProducts(product.id, product.productdescription)} className="btn btn-info"><h3>{product.productdescription}</h3></button>
                        </span>
                    )}<br></br>
                    <button onClick={()=>this.getLocation()} className="btn btn-danger"><h3>Submit</h3></button>
                    {/*Displays products*/}
                    <h1>Selected Products are:</h1>
                    {this.state.productName.map(product=>
                        <span className="lead" key={product}>{product},</span>
                    )}
                </div>
            );
        //    Displays form
        }else if(displayForm && !displayResult){
            return(
                <div className="container">
                    <h1>Please enter the  required details</h1>
                    <form>

                        <label>
                            Date:
                            <input className="form-control" type="date" name="date"  onChange={this.handleChange} />
                        </label>
                        <label>
                            Time:
                            <input className="form-control" type="time" step="2" name="time"  onChange={this.handleChange} />
                        </label>
                        <label>
                            Date To:
                            <input className="form-control" type="date" name="dateTo"  onChange={this.handleChange} />
                        </label>
                        <label>
                            Time To:
                            <input className="form-control" type="time" step="2" name="timeTo"  onChange={this.handleChange} />
                        </label>

                    </form>
                    <button className="btn btn-success" onClick={()=>this.submit()}>Submit</button>
                </div>

            );
        //    Displays result
        }else if(!displayForm && displayResult){
            return(
                <div className="container">
                    <h1>All Available Listings for {this.state.productName},:</h1>
                    {this.state.result.map(product=>
                        <span key={product.id}>
                            <h3>longitude: {product.longitude}</h3>
                            <h3>latitude: {product.latitude}</h3>
                            <h3>elevation: {product.elevation}</h3>
                            <br></br>
                        </span>
                    )}
                    <button className="btn btn-success" onClick={()=>window.location.reload()}>Cool</button>
                </div>

            );
        }

    }
}

export default Report;