import React, { useState, useEffect } from 'react';
import Card from './components/Card'
import Credits from './components/Credits'
import BurgerButton from './components/BurgerButton'
import CardBottomStatus from './components/CardBottomStatus'
import CaseMarker from './components/CaseMarker'
import './App.css'
//import L, { layerGroup } from 'leaflet';
import { Map, TileLayer, ZoomControl, AttributionControl } from 'react-leaflet'

const GetSortOrder = prop => {  
  return function(a, b) {  
      if (a[prop] > b[prop]) {  
          return 1;  
      } else if (a[prop] < b[prop]) {  
          return -1;  
      }  
      return 0;  
  }  
}  

function App() {
  const [state, setState] = useState({
    cases: {
      confirmed: false,
      death: false,
      recovered: false,
      data: [],
    },
    location: {
      lat: 14.5,
      lng: 120.8,
    },
    hasLocation: false,
    loading: true,
    cardShow: (window.screen.width > 640) ? true : false, // for responsive layout
    zoom: (window.screen.width > 640) ? 10 : 8, // for responsive layout
    selectedCase: false
  })

  const getData = async () => {
    let cities = []
    let citiesValue = []

    let location = await fetch('http://localhost:3010/cases')
    let residences = await fetch('https://services5.arcgis.com/mnYJ21GiFTR97WFg/ArcGIS/rest/services/PH_masterlist/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=FID%20ASC')
    let summary = await fetch('https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/slide_fig/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*')
    
    residences = await residences.json()
    location = await location.json()
    summary = await summary.json()
    summary = summary.features[0].attributes

    residences.features.map(response => {
      let attr = response.attributes
      let city = cities.indexOf(attr.residence)

      if(citiesValue[city]) {
        citiesValue[city] = {...citiesValue[city], cases: citiesValue[city].cases + 1}
      } else {
        let newCity = {name: attr.residence, cases: 1}

        cities.push(attr.residence)
        
        location.data.map(loc => {
          if(loc.city === attr.residence) {
            newCity = {...newCity, lat: loc.lat, long: loc.long}
          }
          // else for no location
        })
        citiesValue.push(newCity)
      }
    })

    citiesValue = citiesValue.sort(GetSortOrder("cases")).reverse()

    setState({
      ...state,
      cases: {
        confirmed: summary.confirmed,
        death: summary.recovered,
        recovered: summary.deaths,
        data: citiesValue
      },
      hasLocation: true,
      loading: false
    })

    console.log(citiesValue)
  }

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

  useEffect(() => {
    if(state.cases.data.length === 0) {
      getData()
    }
  }, [])

  const cases = state.cases.data
  const position = [state.location.lat, state.location.lng]

  console.log(window.screen.width)
  
  if(state.loading) {
    return(
      <div className="loading text-4xl text-gray-400 font-bold">Loading...</div>
    )
  } else {
    return (
      <div className="App">
        <Map className="map" center={position} zoom={state.zoom} zoomControl={false}  attributionControl={false}>
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
                name={cases.name}
                openPopup={state.selectedCase === index}
              />
            ))
          }
        </Map>
        {state.cardShow &&
          <Card 
            cases={state.cases.data} 
            confirmed={state.cases.confirmed} 
            recovered={state.cases.recovered} 
            death={state.cases.death}
            handleCardClose={handleCardClose}
            handleOnClickLocation={handleOnClickLocation}
          />
        }
        {!state.cardShow &&
          <BurgerButton handleCardOpen={handleCardOpen} />
        }
        <Credits />
        <CardBottomStatus
          confirmed={state.cases.confirmed} 
          recovered={state.cases.recovered} 
          death={state.cases.death}
        />
      </div>
    );
  }
}

export default App;
