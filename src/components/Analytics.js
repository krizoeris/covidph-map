import React, { useContext, useState, useEffect } from 'react'
import AppContext from '../AppContext'
import { Pie, Line, Doughnut, HorizontalBar } from 'react-chartjs-2';

const pieData = {
	labels: [
		'Red',
		'Blue',
		'Yellow'
	],
	datasets: [{
		data: [300, 50, 100],
		backgroundColor: [
		'#FF6384',
		'#36A2EB',
		'#FFCE56'
		],
		hoverBackgroundColor: [
		'#FF6384',
		'#36A2EB',
		'#FFCE56'
        ],
        borderWidth: 0
	}]
};

const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
        label: 'My First dataset',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [65, 59, 80, 81, 56, 55, 40]
        }
    ]
};

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

const doughnutData = {
	labels: [
		'Red',
		'Green',
		'Yellow'
	],
	datasets: [{
		data: [300, 50, 100],
		backgroundColor: [
		'#FF6384',
		'#36A2EB',
		'#FFCE56'
		],
		hoverBackgroundColor: [
		'#FF6384',
		'#36A2EB',
		'#FFCE56'
        ],
        borderWidth: 0
	}]
};

const options = {
    title: {
        display: false
    },
    legend: {
        display: false
    }
}

const Analytics = () => {
    const [globalState, setGlobalState] = useContext(AppContext)
    const [stateTotalCases, setStateTotalCases] = useState([])
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
        
        setStateTotalCases({
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
    const getTotalCases = async () => {
        let response = await fetch('https://services5.arcgis.com/mnYJ21GiFTR97WFg/arcgis/rest/services/confirmed/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=date%20ASC')
        response = await response.json()

        response.features.map(cases => {
            console.log(cases.attribute.date)
        })
    }
    const getAgeCases = async () => {}

    useEffect(async () => {
        await Promise.all([getCityCases(), getGenderCases(), getTotalCases()])
    }, [])

    // console.log(stateTotalCases.data)
    // console.log(stateGenderCases.data)

    return (
        <div className="overflow-y-auto map-card-analytics">
            <div class="p-3 mr-2 mt-0 mb-4 bg-blue-800 text-white rounded-lg">
                <p className="font-semibold text-lg">Total Cases</p>
                <Line data={lineData} options={options}/>
            </div>
            <div class="p-3 mr-2 mt-0 mb-4 bg-blue-800 text-white rounded-lg">
                <p className="font-semibold text-lg">Total Cases by City</p>
                <Pie data={stateTotalCases.data} options={stateTotalCases.options}/>
            </div>
            <div class="p-3 mr-2 mt-0 mb-4 bg-blue-800 text-white rounded-lg">
                <p className="font-semibold text-lg">Total Cases by Age</p>
                <HorizontalBar data={barData} options={options}/>
            </div>
            <div class="p-3 mr-2 mt-0 mb-4 bg-blue-800 text-white rounded-lg">
                <p className="font-semibold text-lg">Total Cases by Gender</p>
                <Doughnut data={stateGenderCases.data} options={stateGenderCases.options}/>
            </div>
        </div>
    )
}

export default Analytics
