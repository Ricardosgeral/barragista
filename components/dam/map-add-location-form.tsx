"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useEffect } from "react";

interface MapProps {
  posix: LatLngExpression | LatLngTuple;
  zoom?: number;
}

const defaults = {
  zoom_1: 5,
  zomm_2: 8,
  zomm_3: 12,
};

const Map = ({ posix, zoom = defaults.zoom_1 }: MapProps) => {
  const MapCenterSetter = ({
    posix,
  }: {
    posix: LatLngExpression | LatLngTuple;
  }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(posix, map.getZoom(), {
        animate: true,
      });
    }, [posix, map]);

    return null;
  };

  return (
    <MapContainer
      center={posix}
      zoom={zoom}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={posix} draggable={true}>
        <Popup>Dam Location</Popup>
      </Marker>
      <MapCenterSetter posix={posix} />
    </MapContainer>
  );
};

export default Map;
