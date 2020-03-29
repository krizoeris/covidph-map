import React, { useContext, useState, useEffect } from 'react'
import AppContext from '../AppContext'
import { Pie, Line, Doughnut, HorizontalBar } from 'react-chartjs-2';

const barData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'My First dataset',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: [65, 59, 80, 81, 56, 55, 40]
        }
    ]
};

const Analytics = () => {
    const [globalState, setGlobalState] = useContext(AppContext)
    // const [stateTotalCases, setStateTotalCases] = useState([])
    const [stateCityCases, setStateCityCases] = useState([])
    const [stateAgeCases, setStateAgeCases] = useState([])
    const [stateGenderCases, setStateGenderCases] = useState([])
    
    const getCityCases = () => {
        let datasets = {
            data: [],
            backgroundColor: [],
            borderWidth: 0
        }
        let labels = []
        let options = {
            title: {
                display: false
            },
            legend: {
                display: false
            }
        }

        globalState.cities.map(city => {
            datasets.data.push(city.cases)
            datasets.backgroundColor.push('rgb('+Math.floor(Math.random() * 255)+','+Math.floor(Math.random() * 255)+','+Math.floor(Math.random() * 255))
            labels.push(city.name)
        })
        
        setStateCityCases({
            data:{
                datasets: [datasets],
                labels: labels,
            },
            options: options
        })
    }

    const getGenderCases = () => {
        let datasets = {
            data: [globalState.gender.female, globalState.gender.male],
            backgroundColor: ['#36A2EB', '#FFCE56'],
            borderWidth: 0
        }
        let labels = ['Female', 'Male']
        let options = {
            title: {
                display: false
            },
            legend: {
                display: true,
                labels: {
                    fontColor: '#fff'
                }
            }
        }
        
        setStateGenderCases({
            data:{
                datasets: [datasets],
                labels: labels,
            },
            options: options
        })
    }

    const getAgeCases = async () => {
        let datasets = {
            data: [],
            backgroundColor: [],
            borderWidth: 0
        }
        let labels = []
        let options = {
            title: {
                display: false
            },
            legend: {
                display: false
            },
            scales: {
                xAxes: [{ 
                    ticks: {
                        fontColor: "#fff"
                    }
                }],
                yAxes: [{
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        fontColor: "#fff"
                    }
                }],
            }
        }

        let response = await fetch('https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/age_group/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&groupByFieldsForStatistics=age_categ%2Csex&outStatistics=%5B%7B%22statisticType%22%3A%22count%22%2C%22onStatisticField%22%3A%22FID%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&cacheHint=true')
        response = await response.json()

        response.features.map(age => {
            if(labels.includes(age.attributes.age_categ)) {
                datasets.data[labels.indexOf(age.attributes.age_categ)] = datasets.data[labels.indexOf(age.attributes.age_categ)]+age.attributes.value
            } else {
                labels.push(age.attributes.age_categ)
                datasets.data.push(age.attributes.value)
                datasets.backgroundColor.push('rgb('+Math.floor(Math.random() * 255)+','+Math.floor(Math.random() * 255)+','+Math.floor(Math.random() * 255))
            }
        })
        

        setStateAgeCases({
            data:{
                datasets: [datasets],
                labels: labels,
            },
            options: options
        })
    }

    useEffect(() => {
        getCityCases()
        getGenderCases()
        getAgeCases()
    }, [])

    // console.log(stateCityCases.data)
    // console.log(stateGenderCases.data)

    return (
        <div className="overflow-y-auto map-card-analytics">
            {/* <div class="p-3 mr-2 mt-0 mb-4 bg-blue-800 text-white rounded-lg">
                <p className="font-semibold text-lg">Total Cases</p>
                <Line data={lineData} options={options}/>
            </div> */}
            <div class="p-3 mr-2 mt-0 mb-4 bg-blue-800 text-white rounded-lg">
                <p className="font-semibold text-lg">Total Cases by City</p>
                <Pie data={stateCityCases.data} options={stateCityCases.options}/>
            </div>
            <div class="p-3 mr-2 mt-0 mb-4 bg-blue-800 text-white rounded-lg">
                <p className="font-semibold text-lg">Total Cases by Age</p>
                <HorizontalBar data={stateAgeCases.data} options={stateAgeCases.options}/>
            </div>
            <div class="p-3 mr-2 mt-0 mb-4 bg-blue-800 text-white rounded-lg">
                <p className="font-semibold text-lg">Total Cases by Gender</p>
                <Doughnut data={stateGenderCases.data} options={stateGenderCases.options}/>
            </div>
        </div>
    )
}

export default Analytics
