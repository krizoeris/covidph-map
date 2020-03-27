import React from 'react'

const Card = ({cases, confirmed, recovered, death, handleCardClose}) => {
    return (
        <div class="max-w-sm rounded-lg bg-blue-900 shadow-lg map-card p-5">
            <button className="close-card rounded-full bg-blue-800 hover:bg-blue-700 font-bold text-gray-300 shadow-large" onClick={handleCardClose}>
                <i class="fas fa-times"></i>
            </button>
            <div className="mb-4 mr-6 text-center grid grid-cols-3 gap-2">
                <div class="p-2 bg-orange-700 text-white rounded">
                    <p className="font-bold">Infected</p>
                    <p className="font-bold">{confirmed}</p>
                </div>
                <div class="p-2 bg-red-700 text-white rounded">
                    <p className="font-bold">Deaths</p>
                    <p className="font-bold">{death}</p>
                </div>
                <div class="p-2 bg-green-700 text-white rounded">
                    <p className="font-bold">Recovered</p>
                    <p className="font-bold">{recovered}</p>
                </div>
            </div>
            <div className="overflow-y-auto" style={{height: '85%'}}>
                {cases.map(cases => (
                    <div class="p-3 m-2 bg-blue-800 text-white rounded-lg">
                        <span className="">{cases.name}</span>
                        <span className="font-semibold text-gray-500 float-right">{cases.cases}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Card
