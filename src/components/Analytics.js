import React, { useContext, useState, useEffect } from 'react'
import AppContext from '../AppContext'
import { Pie, Line, Doughnut, HorizontalBar } from 'react-chartjs-2';

const Analytics = () => {
    const [globalState, setGlobalState] = useContext(AppContext)
    const [stateDailyCases, setStateDailyCases] = useState([])
    const [stateCityCases, setStateCityCases] = useState([])
    const [stateAgeCases, setStateAgeCases] = useState([])
    const [stateGenderCases, setStateGenderCases] = useState([])

    const getDailyCases = async () => {
        let datasets = {
            data: [],
            borderColor: 'rgb(118, 174, 226)',
            pointRadius: 0,
            pointHoverRadius: 0,
            fill: true,
            showLine: true
        }
        
        let options = {
            legend: {
                display: false,
              },
              tooltips: {
                enabled: false,
              },
              scales: {
                yAxes: [
                  {
                    display: true,
                    type: 'linear',
                    gridLines: {
                      display: true,
                    },
                    ticks: {
                        fontColor: "#fff"
                    }
                  },
                ],
                xAxes: [
                  {
                    display: true,
                    gridLines: {
                      display: false,
                    },
                    type: 'time',
                    time: {
                        displayFormats: {
                          'month': 'Mon-DD'
                        }
                    },
                    ticks: {
                        fontColor: "#fff"
                    }
                  },
                ],
              },
              responsive: true,
              maintainAspectRatio: false,
        }

        let response = await fetch(`${process.env.REACT_APP_CASES_URL}/daily`)
        response = await response.json()

        let labels = []
        let total = 0

        response.map(daily => {
            total = total + parseInt(daily.cases)
            labels.push(daily.date)
            datasets.data.push(total)
        })
        

        setStateDailyCases({
            data:{
                datasets: [datasets],
                labels: labels,
            },
            options: options
        })
    }
    
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
            labels.push(city.city)
        })
        
        setStateCityCases({
            data:{
                datasets: [datasets],
                labels: labels,
            },
            options: options
        })
    }

    const getGenderCases = async () => {
        let response = await fetch(`${process.env.REACT_APP_CASES_URL}/gender`)
        response = await response.json()

        let datasets = {
            data: [response.female, response.male],
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

        let response = await fetch(`${process.env.REACT_APP_CASES_URL}/age`)
        response = await response.json()

        response.map(age => {
            labels.push(age.ages)
            datasets.data.push(age.cases)
            datasets.backgroundColor.push('rgb('+Math.floor(Math.random() * 255)+','+Math.floor(Math.random() * 255)+','+Math.floor(Math.random() * 255))
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
        getDailyCases()
        getCityCases()
        getGenderCases()
        getAgeCases()
    }, [])

    // console.log(stateCityCases.data)
    // console.log(stateGenderCases.data)

    return (
        <div className="overflow-y-auto map-card-analytics">
            <div class="p-3 mr-2 mt-0 mb-4 bg-blue-800 text-white rounded-lg">
                <p className="font-semibold text-lg">Total Cases</p>
                <Line data={stateDailyCases.data} options={stateDailyCases.options}/>
            </div>
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
