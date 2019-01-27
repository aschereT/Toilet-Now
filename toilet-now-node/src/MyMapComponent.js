import React, { Component } from 'react'
import { compose, withProps, withStateHandlers, mapPropsStream } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps'

const MyMapComponent = compose(
    withProps({
      googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyAeDHMR-tD21TLn7jwgxndy3sSdgICW48g&libraries=geometry,drawing,places",
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `400px` }} />,
      mapElement: <div style={{ height: `100%` }} />,
    }),
    withStateHandlers(
      props => ({
        infoWindows: props.places.map(p => {
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
      defaultZoom={14}
      defaultCenter={ubc_pos}
    >
    {props.isMarkerShown && 
      <Marker 
          position = {{ lat: props.currentLocation.lat, lng: props.currentLocation.lng }}
      >
      </Marker>
      && props.sqlplaces &&
        props.sqlplaces.map((toilet, i) => {
          console.log(toilet.name);
          let toiletlat = parseFloat(toilet.latitude, 10);
          let toiletlng = parseFloat(toilet.longitude, 10);
          return (
            <Marker
              position = {{lat: toiletlat, lng: toiletlng}}
              onClick = {props.onToggleOpen.bind(this, i)}
            >
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