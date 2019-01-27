import React, { Component } from 'react';
import logo from './logo.svg';
import ineed2gologo from './i need 2 go.png';
import './App.css';
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import MyMapComponent from './MyMapComponent.js'

class App extends Component {  constructor(props){
  super(props)
  
}
state = {
  currentLatLng: {
    lat: 0,
    lng: 0
  },
  isMarkerShown: false
}
componentWillUpdate(props){
  this.getGeoLocation()
}

componentDidMount(props) {
  this.delayedShowMarker();
  this.getToilets(0,0,0).then(body => {
    console.log("Called backend API, got ", JSON.stringify(body));
  })
}

delayedShowMarker = (props) => {
  setTimeout(() => {
    this.getGeoLocation()
    //this.setState({ isMarkerShown: true })
  }, 1000)
}

handleMarkerClick = (props) => {
  this.setState({ isMarkerShown: false })
  this.delayedShowMarker()
}

getGeoLocation = (props) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        this.setState({
            currentLatlng: {lat: latitude, lng: longitude},
            isMarkerShown: true
          }
        )
      }
    )
  } else {
    //error => console.log(error)
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
    },
    body: JSON.stringify({ lat: lat, lon: lon, range: range }),
  });
  const body = await response.json();
  if (response.status !== 200) throw Error(body.message);
  return body;
};

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={ineed2gologo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
            <p>Click the button to get your location, and we'll do the rest!.</p>
            <button onclick="getLocation()">CLICK ME</button>
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
        <MyMapComponent 
          isMarkerShown={this.state.isMarkerShown}
          onMarkerClick={this.handleMarkerClick}
          currentLocation={this.state.currentLatlng}
        />
      </div>
    );
  }
}

export default App;
