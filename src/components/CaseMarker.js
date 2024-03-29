import React, { useRef, useEffect } from 'react'
import {Circle, Popup} from 'react-leaflet'

const CaseMarker = ({lat, long, name, cases, openPopup}) => {
    const markerRef = useRef(null);
  
    useEffect(() => {
      if (openPopup) markerRef.current.leafletElement.openPopup();
    }, [openPopup]);

    return (
        <Circle ref={markerRef} center={[lat, long]} color="#e53e3e" radius={500+(cases*5)}>
            <Popup>
                <center>
                <p className="pop-up-header">{name}</p>
                <p className="pop-up-body">{cases.toLocaleString()}</p>
                </center>
            </Popup>
        </Circle>
    )
}

export default CaseMarker
