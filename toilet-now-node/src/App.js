import React, { Component } from 'react';
import ineed2gologo from './i need 2 go.png';
import './App.css';
import MyMapComponent from './MyMapComponent.js'
import places from "./places.json"
import { SSL_OP_EPHEMERAL_RSA } from 'constants';

class App extends Component {
  constructor(props){
  super(props)
  
}
//
//lat: 49.262259,
//lng: -123.245229

state = {
  currentLatLng: {
    lat: 49.262259,
    lng: -123.245229
  },
  isMarkerShown: false,
  sqlbody: null,
  sqldata: null,
  loading: true,
  currentloading: true
}

componentWillUpdate(props){
  this.getGeoLocation()
}


async componentDidMount(props) {
  // this.getToilets(0,0,0).then(body => {
  //   console.log("Called backend API, got ", body);
  //   //console.log("Called backend API, got ", JSON.stringify(body));

  //   this.state.sqlbody = body.data;
  //   console.log("sqlbody has", this.state.sqlbody);
  // })
  this.state.sqlbody = await this.getToilets(0,0,0);
  this.delayedShowMarker(this, this.finishload);
  console.log(this.state.currentLatLng.lat);
  console.log(this.state.currentLatLng.lng);
}

finishload = (props, callback) => {
  console.log("finishload");
  console.log(this.state.sqldata);
    this.setState({
      isMarkerShown: true,
      loading: false
    })
    if(callback)
    callback();
}

delayedShowMarker = (props, callback) => {
  this.getGeoLocation(this, this.makenewlist);
  console.log("delaymarker");
  if(callback)
    callback();
}

makenewlist = (props, callback) => {
  console.log("here");
  console.log(this.state.sqlbody);
  var item = {"ToiletID":"0","latitude":this.state.currentLatLng.lat,"longitude":this.state.currentLatLng.lng,"rating_s":"0","rating_v":"1","extra":"","name":"CURRENT LOCATION"};
  this.setState({
    sqldata: [
      ...this.state.sqlbody.data,
      item
    ]
  });
  
  if(callback)
    callback();
}

handleMarkerClick = (props) => {
  this.setState({ isMarkerShown: false })
  this.delayedShowMarker()
}

getGeoLocation = (props, callback) => {
  if (navigator.geolocation) {
    console.log("got location");
    navigator.geolocation.getCurrentPosition( position => {
        const latitudess = position.coords.latitude;
        const longitudess = position.coords.longitude;
        this.setState({
            currentLatLng: {
              lat: latitudess, 
              lng: longitudess
            }
          })
      }
    )
  }
  else {
    console.log("error no location");
  }

  if(callback){
    console.log("callback")
    callback();
  }
}

//Calls the backend API
//Given a latlon position and range, returns all toilets
//that are within range metres of the latlon
getToilets = async (lat, lon, range) => {
  const response = await fetch('/api/getToilets', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  const body = await response.json();
  if (response.status !== 200) throw Error(body.message);
  return body;
};

  render() {
    if(!this.state.loading)
    {
      return (
        <div className="App">
          <header className="App-header">
            <img src={ineed2gologo} className="App-logo" alt="logo" />
            <p>
              Your #1 app for your #2 needs
            </p>
          </header>
          <MyMapComponent 
            isMarkerShown={this.state.isMarkerShown}
            onMarkerClick={this.handleMarkerClick}
            currentLocation={this.state.currentLatlng}
            places = {places}
            sqlplaces = {this.state.sqldata}
          />
        </div>
      );
    }
    else {
      return (
        <div className="App">
          <header className="App-header">
            <img src={ineed2gologo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
              <p>Click the button to get your location, and we'll do the rest!.</p>
              <button onClick="getLocation()">CLICK ME</button>
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Toilet Now!
            </a>
          </header>
        </div>
      )
    }
  }
}
export default App;

/*

*/