import React, { useState, useEffect } from 'react';
import Card from './components/Card'
import './App.css'
import L from 'leaflet';
import { Map, TileLayer, Circle, Popup, ZoomControl } from 'react-leaflet'

function App() {
  const [state, setState] = useState({
    cases: {
      confirmed: false,
      death: false,
      recovered: false,
      data: []
    },
    location: {
      lat: 14.5,
      lng: 120.8,
    },
    hasLocation: false,
    zoom: 10,
  })

  const getCases = async () => {
    let response = await fetch(process.env.REACT_APP_CASES_URL+'/cases')
    response = await response.json()

    setState({
      ...state,
      cases: {
        confirmed: response.confirmed,
        death: response.death,
        recovered: response.recovered,
        data: response.data
      },
      hasLocation: true
    })
  }

  useEffect(() => {
    getCases()
  }, [])

  const cases = state.cases.data
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
          cases.map(cases => (
            <Circle center={[cases.lat, cases.long]} color="#e53e3e" radius={1000+(cases.cases*10)}>
              <Popup>
                <center>
                  <p className="pop-up-header">{cases.city}</p>
                  <p className="pop-up-body">{cases.cases}</p>
                </center>
              </Popup>
            </Circle>
          ))
        }
      </Map>
      
      <Card 
        cases={state.cases.data} 
        confirmed={state.cases.confirmed} 
        recovered={state.cases.recovered} 
        death={state.cases.death}
      />
    </div>
  );
}

export default App;
