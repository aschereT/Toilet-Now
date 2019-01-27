import React, { Component } from 'react';
import ineed2gologo from './i need 2 go.png';
import './App.css';
import MyMapComponent from './MyMapComponent.js'
import places from "./places.json"

class App extends Component {
  constructor(props){
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
    this.delayedShowMarker()
  }

  delayedShowMarker = (props) => {
    setTimeout(() => {
      this.getGeoLocation()
    }, 1000)
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
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={ineed2gologo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload. 
          </p>
          <button onclick="getLocation()">CLICK ME</button>
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
          currentLocation={this.state.currentLatlng}
          places={places}
        />
      </div>
    );
  }
}

export default App;
