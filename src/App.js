import React, { useState, useEffect } from 'react';
import AppContext from './AppContext'
import Card from './components/Card'
import Credits from './components/Credits'
import BurgerButton from './components/BurgerButton'
import CardBottomStatus from './components/CardBottomStatus'
import CaseMarker from './components/CaseMarker'
import './App.css'
//import L, { layerGroup } from 'leaflet';
import { Map, TileLayer, ZoomControl, AttributionControl } from 'react-leaflet'

function App() {
  const [state, setState] = useState({
    location: {
      lat: 14.5,
      lng: 120.8,
    },
    cases: [],
    loading: true,
    selectedCase: false,
    hasLocation: false,
    cardShow: (window.screen.width > 640) ? true : false, // for responsive layout
    zoom: (window.screen.width > 640) ? 10 : 8, // for responsive layout
  })

  const [stateSummary, setStateSummary] = useState([])
  const [stateCases, setStateCases] = useState([])
  const [globalState, setGlobalState] = useState([])

  const getCases = async () => {
    let res = await fetch(`${process.env.REACT_APP_CASES_URL}/cases`)
    res = await res.json()

    setGlobalState({
      cities: res.data,
    })

    setState({
      ...state,
      hasLocation: true,
      loading: false,
      cases: {
        confirmed: res.confirmed,
        recovered: res.recovered,
        deaths: res.death,
        data: res.data
      }
    })
  }
  // getCases() end

  const handleOnClickLocation = (lat, long, index) => {
    setState({
      ...state,
      location: {
        lat: lat,
        lng: (window.screen.width > 640) ? long-0.05 : long,
      },
      zoom: 10,
      cardShow: (window.screen.width > 640) ? true : false,
      selectedCase: index
    })
  }

  const handleCardClose = () => {
    setState({
      ...state,
      cardShow: false
    })
  }

  const handleCardOpen = () => {
    setState({
      ...state,
      cardShow: true
    })
  }

  if(state.cases.length === 0) {
    getCases()
  } 

  const cases = state.cases.data
  const position = [state.location.lat, state.location.lng]

  //console.log(cases)
  
  if(state.loading) {
    return(
      <div className="loading text-4xl text-gray-400 font-bold">Loading...</div>
    )
  } else {
    return (
      <AppContext.Provider value={[globalState, setGlobalState]}>
        <div className="App">
          
          <Map 
            className="map" 
            center={position} 
            zoom={state.zoom} 
            zoomControl={false}  
            attributionControl={false}
          >
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <AttributionControl position='topright' />
            <ZoomControl position="topright"/>
            {state.hasLocation &&
              cases.map((cases, index) => (
                <CaseMarker 
                  lat={cases.lat}
                  long={cases.long}
                  cases={cases.cases}
                  name={cases.city}
                  openPopup={state.selectedCase === index}
                />
              ))
            }
          </Map>

          {state.cardShow &&
            <Card 
              cases={cases} 
              confirmed={parseInt(state.cases.confirmed).toLocaleString()} 
              recovered={parseInt(state.cases.recovered).toLocaleString()} 
              death={parseInt(state.cases.deaths).toLocaleString()}
              handleCardClose={handleCardClose}
              handleOnClickLocation={handleOnClickLocation}
            />
          }
          {!state.cardShow &&
            <BurgerButton handleCardOpen={handleCardOpen} />
          }
          <Credits />
          <CardBottomStatus
            confirmed={parseInt(state.cases.confirmed).toLocaleString()} 
            recovered={parseInt(state.cases.recovered).toLocaleString()} 
            death={parseInt(state.cases.deaths).toLocaleString()}
          />
        </div>
      </AppContext.Provider>
    );
  }
}

export default App;
