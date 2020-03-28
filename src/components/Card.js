import React, {useState, useEffect} from 'react'
import Analytics from '../components/Analytics'

const Card = ({cases, confirmed, recovered, death, handleCardClose, handleOnClickLocation}) => {
    const [state, setState] = useState({
        cases: [],
        cities: [],
        isButton: 'cities'
    })

    const handleSearch = val => {
        let search = cases.filter(cases => (
            cases.name.toLowerCase().includes(val.target.value)
        ))
        
        setState({...state, cases: search})
        console.log(search)
    }

    const handleButton = val => {
        setState({...state, isButton: val})
    }

    useEffect(() => {
       setState({
            ...state,
            cases: cases,
            cities: cases.map(cases => cases.name)
        })
    }, [cases])

    // console.log(state.cases)

    return (
        <div class="w-sm rounded-lg bg-blue-900 shadow-lg map-card p-3">
            <button className="close-card rounded-full bg-blue-800 hover:bg-blue-700 font-bold text-gray-300 shadow-large" onClick={handleCardClose}>
                <i class="fas fa-times"></i>
            </button>
            <div className="mr-6 text-center grid grid-cols-3 gap-2">
                <div class="p-1 bg-orange-700 text-white rounded hidden lg:block md:block">
                    <p className="font-bold">Infected</p>
                    <p className="font-bold">{confirmed}</p>
                </div>
                <div class="p-1 bg-red-700 text-white rounded hidden lg:block md:block">
                    <p className="font-bold">Deaths</p>
                    <p className="font-bold">{death}</p>
                </div>
                <div class="p-1 bg-green-700 text-white rounded hidden lg:block md:block">
                    <p className="font-bold">Recovered</p>
                    <p className="font-bold">{recovered}</p>
                </div>
            </div>

            <div class="mb-3 mt-0 md:mt-3 lg:mt-3 mr-6 md:mr-0 lg:mr-0">
                <button class={`${state.isButton === 'cities' ? 'bg-white hover:bg-white text-blue-900' : 'hover:bg-gray-300 hover:text-blue-900 text-white'} focus:outline-none border-white border font-semibold rounded-l w-1/2`} onClick={() => handleButton('cities')}>
                    Cities
                </button>
                {/* <button class="border-white border hover:bg-white hover:text-blue-900 text-white font-semibold w-1/3">
                    Countries
                </button> */}
                <button class={`${state.isButton === 'analytics' ? 'bg-white hover:bg-white text-blue-900' : 'hover:bg-gray-300 hover:text-blue-900 text-white'} focus:outline-none border-white border font-semibold rounded-r w-1/2`} onClick={() => handleButton('analytics')}>
                    Analitycs
                </button>
            </div>
            
            {state.isButton === 'cities' &&
                <div className="mb-3">
                    <input class="bg-gray-600 rounded-full w-full py-2 px-4 text-white leading-tight focus:outline-none fontAwesome" type="text" placeholder="Search" onChange={handleSearch}></input>
                </div>
            }
            {state.isButton === 'cities' &&
                <div className="overflow-y-auto map-card-content">
                    {state.cases.map((cases) => (
                        <div class="p-3 mr-2 mt-0 mb-4 bg-blue-800 text-white rounded-lg cursor-pointer" onClick={() => handleOnClickLocation(cases.lat, cases.long, state.cities.indexOf(cases.name))}>
                            <span className="">{cases.name}</span>
                            <span className="font-semibold text-gray-500 float-right">{cases.cases}</span>
                        </div>
                    ))}
                </div>
            }

            {state.isButton === 'analytics' &&
                <Analytics />
            }
        </div>
    )
}

export default Card
