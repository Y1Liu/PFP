/*global google*/
import React from 'react'
import axios from 'axios'
import { compose, withProps, withHandlers, withState, lifecycle } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, DirectionsRenderer } from "react-google-maps"



var city0;
var city1 ;
var city2 ;
var city3 ;
var city4 ;
var num0;
var num1;
           




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
            city1=res.data[0][0]
            city2=res.data[2][0]
            city4=res.data[3][0]
            city3=res.data[res.data.length-1][0]
            this.setState({city1})
            
        }).catch((err)=>{
            console.log(err.status);
        })
    }





    get2(){
        axios.get('/test2').then((res)=>{            
           num0 = res.data[0]
           num1 = res.data[1] 
           city0 = { lat: num0, lng: num1 }
           this.setState({city0})
         

        }).catch((err)=>{
            console.log(err.status);
        })
    }


    get3(){
        axios.get('/test3').then((res)=>{            
           for (var i = 0; i <=res.data.length; i++) {
              for(var j = 0; j<=res.data[i].length ; j++) {
                console.log(res.data[i])

              }
             
           }
           
         

        }).catch((err)=>{
            console.log(err.status);
        })
    }





  render() {



const MyMapComponent = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyB8pxsl2jFQSwshMT2I5Weue8CKLgxalY8&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `80vh` }} />,
        mapElement: <div style={{ height: `100%` }} />,
  }),
    withScriptjs,
    withGoogleMap,
    withState('places', 'updatePlaces', ''),
    withHandlers(() => {
        const refs = {
            map: undefined,
        }

        return {
            onMapMounted: () => ref => {
                refs.map = ref
            },
            fetchPlaces: ({ updatePlaces }) => {
                const bounds = refs.map.getBounds();
                const service = new google.maps.places.PlacesService(refs.map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED);
                const request = {
                    bounds: bounds,
                    type: ['point of interest']
                };
                service.nearbySearch(request, (results, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        
                        updatePlaces(results);
                    }
                })
            }
        }
    }),
)((props) => {
    return ( 
    <div>

        <GoogleMap
            onTilesLoaded={props.fetchPlaces}
            ref={props.onMapMounted}
            onBoundsChanged={props.fetchPlaces}
            defaultZoom={14}
            defaultCenter={city0}
        >
            {props.places && props.places.map((place, i) =>
                <Marker key={i} position={{ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }} />
            )}
        </GoogleMap>
    </div>
    )
})
  
const MapWithADirectionsRenderer = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyB8pxsl2jFQSwshMT2I5Weue8CKLgxalY8&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `80vh` }} />,
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
)(props =>
  <GoogleMap
    defaultZoom={7}
    defaultCenter={new google.maps.LatLng(47.0824, 2.3985)}
  >
    {props.directions && <DirectionsRenderer directions={props.directions} />}
  </GoogleMap>
);

    return (
<div class="container">
   <br></br>
   <ul class="nav nav-tabs" role="tablist">
    <li class="nav-item">
      <a class="nav-link active" data-toggle="tab" href="#home" onClick={this.get}>Show your trip on the map</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-toggle="tab" href="#menu1" onClick={this.get2}>Discover your destination</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-toggle="tab" href="#menu2" >Your schedule</a>
    </li>
    </ul>
    <br></br>
    <div class="tab-content">
    <div id="home" class="container tab-pane active">

       <MapWithADirectionsRenderer
        isMarkerShown={this.state.isMarkerShown}
        onMarkerClick={this.handleMarkerClick}
      />
    </div>
    <div id="menu1" class="container tab-pane fade">
    <MyMapComponent />
   
      
    
    </div>
    <div id="menu2" class="container tab-pane fade">
     
    </div>
    </div>
  </div>


    
    )
  }
}
export default Map;