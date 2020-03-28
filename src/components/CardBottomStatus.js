import React from 'react'

const CardBottomStatus = ({confirmed, death, recovered}) => {
    return (
        <div className="w-full bg-blue-900 text-center grid grid-cols-3 card-bottom">
            <div class="p-1 m-2 bg-orange-700 text-white rounded block lg:hidden md:hidden">
                <p className="font-bold">Infected</p>
                <p className="font-bold">{confirmed}</p>
            </div>
            <div class="p-1 m-2 bg-red-700 text-white rounded block lg:hidden md:hidden">
                <p className="font-bold">Deaths</p>
                <p className="font-bold">{death}</p>
            </div>
            <div class="p-1 m-2 bg-green-700 text-white rounded block lg:hidden md:hidden">
                <p className="font-bold">Recovered</p>
                <p className="font-bold">{recovered}</p>
            </div>
        </div>
    )
}

export default CardBottomStatus
