import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

const MyMapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyAeDHMR-tD21TLn7jwgxndy3sSdgICW48g&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap
    defaultZoom={14}
    defaultCenter={ubc_pos}
  >
    {props.isMarkerShown && <Marker position={ubc_pos} />}
  </GoogleMap>
)

const ubc_pos = { lat: 49.2606, lng: -123.2460 };

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
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
        <MyMapComponent isMarkerShown />
      </div>
    );
  }
}

export default App;
