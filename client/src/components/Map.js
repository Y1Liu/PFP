/*global google*/
import React, { Component } from 'react'
import ReactDom from 'react-dom';
import axios from 'axios'


const { compose, withProps, lifecycle } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer,
} = require("react-google-maps");



  
const MapWithADirectionsRenderer = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyB8pxsl2jFQSwshMT2I5Weue8CKLgxalY8&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100vh` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidMount() {
    const DirectionsService = new google.maps.DirectionsService();
    
      DirectionsService.route({
        origin: 'Lille',
    waypoints: [
    {
      location: 'Amiens',
      stopover: true
    }],
        destination: 'Djion',
        travelMode: google.maps.TravelMode.DRIVING,
      }, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result,
          });
        } else {
          console.error(`error fetching directions ${result}`);
        }
      });
    }
  })
)

(props =>
  <GoogleMap
    defaultZoom={7}
    defaultCenter={new google.maps.LatLng(47.0824, 2.3985)}
  >
    {props.directions && <DirectionsRenderer directions={props.directions} />}
  </GoogleMap>
);



class Map extends React.PureComponent {
  

  state = {
    isMarkerShown: false,
  }

  componentDidMount() {
    this.delayedShowMarker()
  }

  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: true })
    }, 3000)
  }

  handleMarkerClick = () => {
    this.setState({ isMarkerShown: false })
    this.delayedShowMarker()
  }

  constructor(){
        super();
        this.state = {
            arr: {}
        };
        this.get = this.get.bind(this);
    }
    get(){
        axios.get('/test').then((res)=>{
            
            for (var i = 0; i <=res.data.length-1; i++) {
                console.log(res.data[i][0])            

            }
            
            
        }).catch((err)=>{
            console.log(err.status);
        })
    }

  render() {
    return (
    <div>
    <div>
            <input type="button" value="Test" onClick={this.get}/>
       

        </div>


    <MapWithADirectionsRenderer
        isMarkerShown={this.state.isMarkerShown}
        onMarkerClick={this.handleMarkerClick}
      />

    </div>
    )
  }
}
export default Map;