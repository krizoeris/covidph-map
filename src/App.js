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
    location: {
      lat: 14.5,
      lng: 120.8,
    },
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
    let cities = []
    let citiesValue = []
    let genderValue = {female: 0, male: 0}

    let location = await fetch('https://covidph-api.herokuapp.com/cases')
    let res = await fetch('https://services5.arcgis.com/mnYJ21GiFTR97WFg/ArcGIS/rest/services/PH_masterlist/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=FID%20ASC')
    
    location = await location.json()
    res = await res.json()

    res.features.map(response => {
      let attr = response.attributes
      let city = cities.indexOf(attr.residence)

      //City
      if(citiesValue[city]) {
        citiesValue[city] = {...citiesValue[city], cases: citiesValue[city].cases + 1}
      } else {
        let newCity = {name: attr.residence, cases: 1}

        cities.push(attr.residence)
      
        location.data.map(loc => {
          if(loc.city === attr.residence) {
            newCity = {...newCity, lat: loc.lat, long: loc.long}
          } 
        })

        //if new location
        if(!newCity.lat) {
          newCity = {...newCity, lat: 10, long: 10}
        }

        citiesValue.push(newCity)
      }

      //Gender
      genderValue.female = (attr.kasarian === 'Female') ? genderValue.female+1 : genderValue.female
      genderValue.male = (attr.kasarian === 'Male') ? genderValue.male+1 : genderValue.male
    })

    citiesValue = citiesValue.sort(GetSortOrder("cases")).reverse()

    setStateCases(citiesValue)

    setGlobalState({
      cities: citiesValue,
      gender: genderValue
    })

    setState({
        ...state,
        hasLocation: true,
        loading: false
    })
  }
  // getCases() end

  const getSummaryCases = async () => {
    let res = await fetch('https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/slide_fig/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*')
    res = await res.json()

    setStateSummary(res.features[0].attributes)
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

  useEffect(async () => {
    await Promise.all([getCases(), getSummaryCases()])
  }, [])

  const cases = stateCases
  const position = [state.location.lat, state.location.lng]
  
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
                  name={cases.name}
                  openPopup={state.selectedCase === index}
                />
              ))
            }
          </Map>

          {state.cardShow &&
            <Card 
              cases={cases} 
              confirmed={stateSummary.confirmed} 
              recovered={stateSummary.recovered} 
              death={stateSummary.deaths}
              handleCardClose={handleCardClose}
              handleOnClickLocation={handleOnClickLocation}
            />
          }
          {!state.cardShow &&
            <BurgerButton handleCardOpen={handleCardOpen} />
          }
          <Credits />
          <CardBottomStatus
            confirmed={stateSummary.confirmed} 
            recovered={stateSummary.recovered} 
            death={stateSummary.deaths}
          />
        </div>
      </AppContext.Provider>
    );
  }
}

export default App;
