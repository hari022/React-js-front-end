import React, { Component } from 'react';
import Nav from './components/Nav';
import AddData from './components/AddData';
import WordDoc from './components/WordDoc';
import Report from './components/Report';
import UpdateData from './components/UpdateData';
import SweetAlert from 'react-bootstrap-sweetalert';
import './App.css';

class App extends Component {
    //let products_state = [];
    constructor(props){
        super(props);
        this.state = {
            products:[],
            details:[],
            isLoading: false,
            renderComponent:'',
            longitude:'',
            latitude:'',
            elevation:'',
            productName:'',
            time:'',
            detailId:'',
            productId:'',
            alert_warning: null,
            alert_success_call:false,
            alert_success:null
        }
        //this.handler = this.handler().bind(this);

    }

    componentDidMount(){
        //let products = [];
        this.setState({
            isLoading: true
        });

        fetch('http://127.0.0.1:8000/api/products',{
            method: 'GET'
        }).then(response => response.json()).then(
            (data) => {
                this.setState({products:data, isLoading: false});
               // console.log('state',this.state.products);
            }
        );

    }
// Get time from the database: Params(Id of the selected product, Name of the selected product)
    getTime(id, name){
        //Set renderComponent state to time, conditional rendering for the section of the App.js file which displays time of the specific product
        this.setState({renderComponent:'time'});
        this.setState({
            isLoading: true, //displays "loading on the page while fetching data"
            productName: name,
            productId:id
        });
        //Fetch Time using Fetch method, Get API call @ "http://127.0.0.1:8000/api/details/{id}" API of the laravel
        fetch('http://127.0.0.1:8000/api/details/'+id,{
            method: 'GET'
        }).then(response => response.json()).then(
            (data) => {
                this.setState({details:data, isLoading: false});
                //console.log('state',this.state.details);
            }
        );


    }
// Get location of the product: Params(detail object)
    getLocation(detail){
        //console.log(detail);
        this.setState({
            longitude: detail.longitude,
            latitude: detail.latitude,
            elevation: detail.elevation,
            renderComponent:'location',
            time: detail.datetime,
            detailId: detail.id

        })

    }
    //Provides conditional rendering for the different sections of the App.js file
    goBack(){
        switch (this.state.renderComponent){
            case 'time':{
                this.setState({
                    renderComponent:''
                })
                break;
            }
            case 'location':{
                this.setState({
                    renderComponent:'time'
                })
                break;
            }
            default:
        }
    }
// Delete detail method: params(detailId, ProductId. ProductName)
    deleteDetail(){
        fetch('http://127.0.0.1:8000/api/details/'+this.state.detailId+'/'+this.state.productId+'/'+this.state.productName,{
            method: 'DELETE'
        }).then(response => response.json()).then(
            (data) => {
                console.log('state',data);
                this.deleteAlertSuccess(); //displays delete confirmation  on the screen
            }

        );
    }
    //displays delete confirmation  on the screen
    deleteAlertSuccess(){
        const getAlertSuccess = () => (
            <SweetAlert
                warning
                confirmBtnText="Cool"
               // confirmBtnBsStyle="Success"
                title="Data Deleted"
                onConfirm={() => this.hideAlertSuccess()}
            >
            </SweetAlert>
        );

        this.setState({
            alert_success: getAlertSuccess()
        });
    }
//displays alert on the screen
    deleteAlert() {
        const getAlert = () => (
            <SweetAlert
                warning
                showCancel
                confirmBtnText="Yes, delete it!"
                confirmBtnBsStyle="danger"
                cancelBtnBsStyle="default"
                title="Are you sure?"
                onConfirm={() => this.deleteDetail()}
                onCancel={() => this.hideAlert()}
            >
            </SweetAlert>
        );

        this.setState({
            alert_warning: getAlert()
        });
    }
// Method will hide the alert when called
    hideAlert() {
        console.log('Hiding alert...');
        this.setState({
            alert_warning: null,
            alert_success:null
        });
    }
// Method will hide the success alert when called
    hideAlertSuccess() {
        console.log('Hiding alert...');
        this.setState({
            alert_success:null
        });
        this.getTime(this.state.productId, this.state.productName);
    }
    //Main render method
  render() {
      const { products, isLoading, renderComponent, details, latitude, longitude, elevation, productName, time } = this.state;
      if (isLoading) {

          return (
              <div>
                  <div className="container-fluid">
                      <Nav/>
                  </div>
                  <h2 className="container">Loading ...</h2>
              </div>
              );
      }else if(isLoading == false && renderComponent == '') {
          return (
              <div>
                  {/*Navigation bar on top of the page*/}
                  <div className="container-fluid">
                      <Nav/>
                  </div>
                  {/*Displays products on the page as buttons*/}
                  <div className="container">
                      <h2>Please Select the Product:</h2>
                      {products.map(product=>
                          <span key={product.id}>
                            <button onClick={()=>this.getTime(product.id, product.productdescription)} className="btn btn-info"><h3>{product.productdescription}</h3></button>
                        </span>
                      )}<br></br><hr></hr>

                      {/*Action buttons for the AddData, Generate Report and Generate Word Doc Actions*/}
                      <button onClick={()=>this.setState({renderComponent:'addData'})} className="btn btn-danger action">Add Data</button>
                      <button onClick={()=>this.setState({renderComponent:'report'})} className="btn btn-danger action">Generate Report</button>
                      <button onClick={()=>this.setState({renderComponent:'wordDoc'})} className="btn btn-danger action">Generate Word Doc</button>
                  </div>
              </div>
          );
      }else if(isLoading == false && renderComponent == 'time'){
          return(
              <div>
                  <div className="container-fluid">
                      <Nav/>
                  </div>
                  <div className="container">
                      <h2>Product Name: {productName}</h2>
                      <h3>Please select time:</h3>
                      {/*Displays Time of the specific product from the database*/}
                      {details.map(detail=>
                          <span key={detail.id}>
                            <button onClick={()=> this.getLocation(detail)}  className="btn btn-info"><h3>{detail.datetime}</h3></button>
                        </span>
                      )}
                      <br></br>
                      {/*Back button for the conditional rending*/}
                      <button onClick={()=>this.goBack()} className="btn btn-danger">Back</button>
                  </div>
              </div>
          );

      }else if(isLoading == false && renderComponent == 'location'){
          return(
              <div>
                  <div className="container-fluid">
                      <Nav/>
                  </div>
                  <div className="container">
                      <div className="row">
                          {/*Displays location of the specific product at specific time*/}
                          <h2>Product Name: {productName}</h2>
                          <h3>Current Location for time: {time} :</h3>
                          <div className="col-md-4">
                              <h2>Longitude: {longitude}</h2>
                              <h2>Latitude: {latitude}</h2>
                              <h2>Elevation: {elevation}</h2>
                              {/*Action buttons for Back, Delete and Update actions*/}
                              <button onClick={()=>this.goBack()} className="btn btn-danger">Back</button>
                              <button onClick={() => this.deleteAlert()}  className="btn btn-danger">Delete</button>
                              <button onClick={()=>this.setState({renderComponent:'update'})}  className="btn btn-warning">Update</button>
                              {this.state.alert_warning}
                              {this.state.alert_success}
                          </div>
                          <div className="col-md-8">

                          </div>

                      </div>

                  </div>

              </div>
          );

      }else if(isLoading == false && renderComponent == 'addData'){
          return(
              <div>
                  <div className="container-fluid">
                      <Nav/>
                  </div>
                  {/*Renders Add data component*/}
                  <AddData products={this.state.products} action={this.handler}/>
              </div>

          );

      }
      else if(isLoading == false && renderComponent == 'update'){
          return(
              <div>
                  <div className="container-fluid">
                      <Nav/>
                  </div>
                  {/*Renders update data component*/}
                  <UpdateData longitude={this.state.longitude} latitude = {this.state.latitude} elevation = {this.state.elevation} dateTime = {this.state.time} detailId = {this.state.detailId} productId = {this.state.productId} productName = {this.state.productName}/>
              </div>

          );

      } else if(isLoading == false && renderComponent == 'report'){
          return(
              <div>
                  <div className="container-fluid">
                      <Nav/>
                  </div>
                  {/*Renders generate report component*/}
                  <Report products = {this.state.products}/>
              </div>

          );

      }else if(isLoading == false && renderComponent == 'wordDoc'){
          return(
              <div>
                  <div className="container-fluid">
                      <Nav/>
                  </div>
                  {/*Renders generate worddoc component*/}
                  <WordDoc/>
              </div>

          );

      }


  }
}

export default App;
