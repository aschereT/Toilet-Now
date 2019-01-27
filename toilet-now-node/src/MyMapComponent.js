import React, { Component } from 'react'
import { compose, withProps, withStateHandlers } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps'

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
      {props.isMarkerShown && 
        <Marker position={{ lat: props.currentLocation.lat, lng: props.currentLocation.lng }}/>
        && props.places &&
        props.places.map((place, i) => {
            let lat = parseFloat(place.latitude, 10);
            let lng = parseFloat(place.longitude, 10);

            return (
                <Marker
                    position = {{lat:lat, lng: lng}}
                >
                </Marker>
            );
        })
        }
    </GoogleMap>
  )
  
  const ubc_pos = { lat: 49.2606, lng: -123.2460 };

  export default MyMapComponent;