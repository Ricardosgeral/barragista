"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useEffect } from "react";

interface MapProps {
  posix: LatLngExpression | LatLngTuple;
  zoom: number;
  onMarkerDragEnd?: (newPosition: LatLngTuple) => void; // Optional callback for parent component
}

const Map = ({ posix, zoom, onMarkerDragEnd }: MapProps) => {
  const handleMarkerDragEnd = (event: any) => {
    const { lat, lng } = event.target.getLatLng(); // Get the new latlng after drag
    const newMarkerPosition: LatLngTuple = [lat, lng];

    // Optional callback to parent component
    if (onMarkerDragEnd) {
      onMarkerDragEnd(newMarkerPosition);
    }
  };

  const MapCenterSetter = ({
    posix,
    zoom,
  }: {
    posix: LatLngExpression | LatLngTuple;
    zoom: number;
  }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(posix, zoom, {
        animate: true,
      });
    }, [posix, zoom, map]);

    return null;
  };

  return (
    <MapContainer
      center={posix}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
      doubleClickZoom={false} // Disable default double-click zoom behavior
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Render draggable marker with drag end event handler */}
      <Marker
        position={posix}
        draggable={true}
        eventHandlers={{ dragend: handleMarkerDragEnd }}
      >
        <Popup>Selected Position</Popup>
      </Marker>
      <MapCenterSetter posix={posix} zoom={zoom} />
    </MapContainer>
  );
};

export default Map;
