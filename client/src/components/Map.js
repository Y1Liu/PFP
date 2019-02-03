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
<div class="container">

  <ul class="nav nav-tabs" role="tablist">
    <li class="nav-item">
      <a class="nav-link active" data-toggle="tab" href="#home" onClick={this.get}>Home</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-toggle="tab" href="#menu1">Menu 1</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-toggle="tab" href="#menu2">Menu 2</a>
    </li>
  </ul>

  <div class="tab-content">
    <div id="home" class="container tab-pane active">
       <MapWithADirectionsRenderer
        isMarkerShown={this.state.isMarkerShown}
        onMarkerClick={this.handleMarkerClick}
      />
    </div>
    <div id="menu1" class="container tab-pane fade">
      <h3>Menu 1</h3>
      <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    </div>
    <div id="menu2" class="container tab-pane fade">
      <h3>Menu 2</h3>
      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.</p>
    </div>
  </div>
</div>


    
    )
  }
}
export default Map;