import React, { useEffect, useState } from 'react'
import './Map.css'
import { MapContainer as LeafletMap, TileLayer } from "react-leaflet";
import { showDataOnMap } from './util';

function Map({countries,casesType, center, zoom }) {
    // console.log(center.lat)
    return (
        <div className='map'>
            <LeafletMap center={center} zoom={zoom}>
                <TileLayer
                    url="https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=RJaCHoawvS2rrHIaYRO7"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {showDataOnMap(countries, casesType)}
            </LeafletMap>
        </div>
    );
}

export default Map
