import React from 'react'

const Card = ({data, confirmed, recovered, death}) => {
    return (
        <div class="max-w-sm rounded-lg bg-blue-900 overflow-hidden shadow-lg map-card p-5">
            <div className="mb-4 text-center grid grid-cols-3 gap-2">
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
            <div className="overflow-y-auto" style={{height: '100%'}}>
                <div class="p-5 bg-blue-800 text-white rounded-lg">
                    
                </div>
            </div>
        </div>
    )
}

export default Card
