import React from 'react'

const BurgerButton = ({handleCardOpen}) => {
    return (
        <button className="map-menu rounded-full bg-blue-800 hover:bg-blue-700 font-bold text-gray-300 shadow" onClick={handleCardOpen}>
            <i class="fas fa-bars"></i>
          </button>
    )
}

export default BurgerButton
