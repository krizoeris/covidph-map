import React, {useState} from 'react'

const Card = ({cases, confirmed, recovered, death, handleCardClose, handleOnClickLocation}) => {
    const [state, setState] = useState({
        cases: []
    })

    const handleSearch = val => {
        let search = cases.filter(cases => (
            cases.name.toLowerCase().includes(val.target.value)
        ))
        
        setState({...state, cases: search})
    }

    if(state.cases.length === 0) {
        setState({...state, cases: cases})
    }

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
                <button class="bg-white border-white border hover:bg-white text-blue-900 font-semibold rounded-l w-1/3">
                    Cities
                </button>
                <button class="border-white border hover:bg-white hover:text-blue-900 text-white font-semibold w-1/3">
                    Countries
                </button>
                <button class="border-white border hover:bg-white hover:text-blue-900 text-white font-semibold rounded-r w-1/3">
                    Analitycs
                </button>
            </div>

            <div className="mb-3">
                <input class="bg-gray-600 rounded-full w-full py-2 px-4 text-white leading-tight focus:outline-none fontAwesome" type="text" placeholder="Search" onChange={handleSearch}></input>
            </div>
            <div className="overflow-y-auto map-card-content">
                {state.cases.map((cases, index) => (
                    <div class="p-3 mr-2 mt-0 mb-4 bg-blue-800 text-white rounded-lg" onClick={() => handleOnClickLocation(cases.lat, cases.long, index)}>
                        <span className="">{cases.name}</span>
                        <span className="font-semibold text-gray-500 float-right">{cases.cases}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Card
