import React, { Component } from 'react'
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
 

class MapContainer extends Component {
  render() {
 
    return (


       <div className="container">

       <Map
        item
        xs = { 12 }
 
        google = { this.props.google }
        onClick = { this.onMapClick }
        zoom = { 14 }
        initialCenter = {{ lat: 48.856667, lng: 2.351944 }}
      >
 
        <Marker
          onClick = { this.onMarkerClick }
          title = { 'Changing Colors Garage' }
          position = {{ lat: 48.856667, lng: 2.351944 }}
          name = { 'Changing Colors Garage' }
        />
 
        
      </Map>
      
      </div>
      
    );
  }
}
 
export default GoogleApiWrapper({
  apiKey: ("AIzaSyB8pxsl2jFQSwshMT2I5Weue8CKLgxalY8")
})(MapContainer)