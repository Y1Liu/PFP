/*global google*/
import React from 'react'
import axios from 'axios'
import { compose, withProps, withHandlers, withState, lifecycle } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, DirectionsRenderer } from "react-google-maps"



var city0 ;
var city1 ;
var city = new Array();
var budget = new Array(); 
var time = new Array(); 
var num0;
var num1;
           




class Map extends React.PureComponent {
  

  state = {
     show: false,
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
       axios.get('/test3').then((res)=>{            
           for (var i = 0; i <=res.data[0].length-1; i++) {
              city[i] = res.data[0][i]
              budget[i] = res.data[1][i]
              time[i] = res.data[2][i]
              
              }
          city1=res.data[0][res.data[0].length-1]
          num0=res.data[3][0]
          num1=res.data[3][1]    
          city0 = { lat: num0, lng: num1 }


          
          console.log(res.data)
          this.setState({city})
           
           
         

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
        origin: city[0],
    waypoints: [
    {
      location: city[1],
      stopover: true
    },
    {
      location: city[2],
      stopover: true
    },
    {
      location: city[3],
      stopover: true
    }
    ],
     
        destination: city1,
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
<div class="container" >
   <br></br>
   <ul class="nav nav-tabs" role="tablist">
    <li class="nav-item">
      <a class="nav-link active" data-toggle="tab" href="#home" onClick={this.get}>Votre trajet</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-toggle="tab" href="#menu1" onClick={this.get}>Vos escales</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-toggle="tab" href="#menu2" onClick={this.get}>Informations</a>
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
    <table class="table table-hover">
    <thead>
      <tr>
        <th>Ville</th>
        <th>Heure d'arrivée</th>
        <th>Budget</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{city[0]}</td>
        <td>{time[0]}</td>
        <td>{budget[0]}</td>
      </tr>
      <tr>
        <td>{city[1]}</td>
        <td>{time[1]}</td>
        <td>{budget[1]}</td>
      </tr>
      <tr>
        <td>{city[2]}</td>
        <td>{time[2]}</td>
        <td>{budget[2]}</td>
      </tr>
       <tr>
        <td>{city[3]}</td>
        <td>{time[3]}</td>
        <td>{budget[3]}</td>
      </tr>
       <tr>
        <td>{city[4]}</td>
        <td>{time[4]}</td>
        <td>{budget[4]}</td>
      </tr>
    </tbody>
  </table>
    </div>
    </div>
  </div>


    
    )
  }
}
export default Map;