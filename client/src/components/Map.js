/*global google*/
import React, { Component } from 'react'
import ReactDom from 'react-dom';
import axios from 'axios'



    var city=new Array(); 
    var city1 ;
    var city2 ;
    var city3 ;
    var city4 ;
           





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
            


          
           /*for (var i = 0; i <=res.data.length-1; i++) {
                city [i]=res.data[i][0]      

               
            }*/

            city1=res.data[0][0]
            city2=res.data[2][0]
            city3=res.data[4][0]
            city4=res.data[3][0]
            
            this.setState({city1}) 
        }).catch((err)=>{
            console.log(err.status);
        })
    }

  render() {


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
        origin: city1,
    waypoints: [
    {
      location: city2,
      stopover: true
    },
    {
      location: city4,
      stopover: true
    }
    ],
     
        destination: city3,
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

    return (
    <div>
    <div>
            <input type="button" value="Test" onClick={this.get}/>
            <ul>
           
           <li> {this.state.city} </li>
           
           </ul>


       

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