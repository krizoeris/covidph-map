import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import { Map, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet'
import './App.css'

let myIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -41]
});


function App() {
  const [state, setState] = useState({
    cases: {
      confirmed: false,
      death: false,
      recovered: false,
      data: []
    },
    location: {
      lat: 20,
      lng: 60,
    },
    hasLocation: false,
    zoom: 3,
  })

  const position = [state.location.lat, state.location.lng]
  return (
    
    <div className="App">
      <Map className="map" center={position} zoom={state.zoom} zoomControl={false}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="topright"/>
        {state.hasLocation &&
          <Marker position={position} icon={myIcon}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        }
      </Map>
    </div>
  );
}

export default App;
