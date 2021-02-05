import React from "react";
import { MapContainer as LeafletMap, TileLayer } from "react-leaflet";
import "./Map.css";

function Map({ countries, casesType, center, zoom ,showDataOnMap}) {
  console.log("I ma map",center,zoom);
  return (
    <div className="map">
      <LeafletMap center={center} zoom={zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {showDataOnMap()}
      </LeafletMap>
    </div>
  );
}

export default Map;
