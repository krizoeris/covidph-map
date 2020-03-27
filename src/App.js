import React, { useState, useEffect } from 'react';
import Card from './components/Card'
import Credits from './components/Credits'
import './App.css'
import L, { layerGroup } from 'leaflet';
import { Map, TileLayer, Circle, Popup, ZoomControl } from 'react-leaflet'

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
    cardShow: true,
    loading: true,
    zoom: 10,
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

    console.log('load')
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
    setInterval(getData(), 3600000);
  }, [])

  const cases = state.cases.data
  const position = [state.location.lat, state.location.lng]
  
  if(state.loading) {
    return(
      <div className="loading text-4xl text-gray-400 font-bold">Loading...</div>
    )
  } else {
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
                    <p className="pop-up-header">{cases.name}</p>
                    <p className="pop-up-body">{cases.cases}</p>
                  </center>
                </Popup>
              </Circle>
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
          />
        }
        {!state.cardShow &&
          <button className="map-menu rounded-full bg-blue-800 hover:bg-blue-700 font-bold text-gray-300 shadow" onClick={handleCardOpen}>
            <i class="fas fa-bars"></i>
          </button>
        }
        <Credits />
      </div>
    );
  }
}

export default App;
