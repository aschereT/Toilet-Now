import React, { Component } from 'react'
import './App.css';
import { compose, withProps, withStateHandlers, mapPropsStream } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps'

var distance = require('google-distance-matrix');

distance.key('AIzaSyAeDHMR-tD21TLn7jwgxndy3sSdgICW48g');
distance.units('imperial');
var originstr = ["49.262259,-123.245229"];
var originnum = [49.262259, -123.245229];

//function to convert from degrees to radians
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function GetDirections(toilat, toilng, curlat, curlng){
  
}

const MyMapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyAeDHMR-tD21TLn7jwgxndy3sSdgICW48g&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `600px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withStateHandlers(
    props => ({
      infoWindows: props.sqlplaces.map(p => {
        return { isOpen: false };
      })
    }),
    {
      onToggleOpen: ({ infoWindows }) => selectedIndex => ({
        infoWindows: infoWindows.map((iw, i) => {
          iw.isOpen = selectedIndex === i;
          return iw;
        })
      })
    }
  ),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap
    defaultZoom={15}
    defaultCenter={ubc_pos}
  >
    {props.isMarkerShown &&
      props.sqlplaces &&
      props.sqlplaces.map((toilet, i) => {
        //toiletlat stores latitude of the toilet
        //toiletlng stores longitude of the toilet
        //toilettotvote stores total vote score of the toilet
        //toiletnumvote stores number of votes of the toilet
        let toiletlat = parseFloat(toilet.latitude, 10);
        let toiletlng = parseFloat(toilet.longitude, 10);
        let toilettotvote = parseFloat(toilet.rating_s, 5);
        let toiletnumvote = parseFloat(toilet.rating_v, 5);

        //toiletrating calculates the average score of the toilet
        //toiletdistance calculates the distance of the toilet from the user's current location
        let toiletrating = (toilettotvote / toiletnumvote).toFixed(2);
        let toiletloc = [toiletlat.toString() + "," + toiletlng.toString()]
        var R = 6371e3;
        var dLat = deg2rad(toiletlat - originnum[0]);
        var dLon = deg2rad(toiletlng - originnum[1]);
        var a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(originnum[0])) * Math.cos(deg2rad(toiletlat)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2)
          ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var toiletdistance = (R * c).toFixed(2);

        //print markers on map, positining the marker using lat and lng
        //onClick shows details of the marker
        //name, toilet gender(s), average rating, and distance
        return (
          <Marker
            key={i}
            position={{ lat: toiletlat, lng: toiletlng }}
            onClick={props.onToggleOpen.bind(this, i)}
            title={toilet.name}
          >
            {props.infoWindows[i].isOpen && (
              <InfoWindow closeclick={props.onToggleOpen.bind(i)}>
                <div>
                  <div>Location: {toilet.name}</div>
                  <div className="notcurrloc">Genders: {toilet.extra}</div>
                  <div className="notcurrloc">Rating: {toiletrating}</div>
                  <div className="notcurrloc">Distance: {toiletdistance} Meters</div>
                  <button onClick={GetDirections(toiletlat, toiletlng, props.currentLocation.lat, props.currentLocation.lng)}>Get Directions</button>
                </div>
              </InfoWindow>
            )}
          </Marker>
        );
      })
    }
  </GoogleMap>
)

const ubc_pos = { lat: 49.2606, lng: -123.2460 };

export default MyMapComponent;

/*
            {props.infoWindows[i].isOpen && (
              <infoWindow onCloseClick={props.onToggleOpen.bind(i)}>
                <div>Location: {toilet.name}</div>
                <div>Genders: {toilet.extra}</div>
              </infoWindow>
            )}

Called backend API, got
{"success":true,"data":
  [{"ToiletID":"1","latitude":49.263471,"longitude":-123.255556,"rating_s":"4","rating_v":"1","extra":"UNISEX","name":"Ponderosa Residences"},
  {"ToiletID":"2","latitude":49.260403,"longitude":-123.248695,"rating_s":"6","rating_v":"2","extra":"UNISEX","name":"Forestry Sciences Centre"},
  {"ToiletID":"3","latitude":49.262341,"longitude":-123.250146,"rating_s":"10","rating_v":"3","extra":"MALE, FEMALE","name":"Fred Kaiser (Floor 1)"},
  {"ToiletID":"4","latitude":49.262259,"longitude":-123.245229,"rating_s":"20","rating_v":"5","extra":"MALE,FEMALE","name":"Life Sciences Building"},
  {"ToiletID":"5","latitude":49.266518,"longitude":-123.249671,"rating_s":"15","rating_v":"3","extra":"MALE,FEMALE","name":"AMS Nest (Floor 4)"},
  {"ToiletID":"6","latitude":49.267435,"longitude":-123.250065,"rating_s":"10","rating_v":"2","extra":"UNISEX","name":"Life Building (Floor 1)"},
  {"ToiletID":"7","latitude":49.265254,"longitude":-123.253896,"rating_s":"4","rating_v":"1","extra":"MALE,FEMALE","name":"Henry Angus (Floor 1)"},
  {"ToiletID":"8","latitude":49.266518,"longitude":-123.249671,"rating_s":"8","rating_v":"2","extra":"MALE,FEMALE","name":"AMS Nest (Floor 2)"},
  {"ToiletID":"9","latitude":49.262248,"longitude":-123.243651,"rating_s":"4","rating_v":"1","extra":"MALE,FEMALE","name":"Pharmaceutical Sciences Building"},
  {"ToiletID":"10","latitude":49.268439,"longitude":-123.254857,"rating_s":"3","rating_v":"1","extra":"MALE,FEMALE","name":"Buchanan A"}]}
*/

/*
  && props.places &&
    props.places.map((place, i) => {
        let lat = parseFloat(place.latitude, 10);
        let lng = parseFloat(place.longitude, 10);

        return (
            <Marker
                position = {{lat:lat, lng: lng}}
                onClick={props.onToggleOpen.bind(this, i)}
            >
              {props.infoWindows[i].isOpen && (
              <InfoWindow onCloseClick={props.onToggleOpen.bind(i)}>
                <div>{place.name}</div>
              </InfoWindow>
              )}
            </Marker>
        );
    })
*/