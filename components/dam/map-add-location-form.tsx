import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  useMap,
} from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";
import { layersData } from "@/data/map-tiles-providers";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

const { BaseLayer } = LayersControl;

interface MapProps {
  posix: LatLngExpression | LatLngTuple;
  zoom: number;
  onMarkerDragEnd?: (newPosition: LatLngTuple) => void;
}

const Map = ({ posix, zoom, onMarkerDragEnd }: MapProps) => {
  const handleMarkerDragEnd = (event: any) => {
    const { lat, lng } = event.target.getLatLng();
    const newMarkerPosition: LatLngTuple = [lat, lng];

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
    React.useEffect(() => {
      map.setView(posix, zoom, { animate: true });
    }, [posix, zoom, map]);

    return null;
  };

  return (
    <MapContainer
      center={posix}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
      doubleClickZoom={false}
    >
      <LayersControl position="topright">
        {layersData.map((provider, index) => (
          <React.Fragment key={provider.name}>
            {provider.datasets.map((dataset) => (
              <BaseLayer
                key={dataset.name}
                name={dataset.name}
                checked={index === 0}
              >
                <TileLayer
                  url={dataset.endpoint}
                  attribution={dataset.attribution}
                />
              </BaseLayer>
            ))}
          </React.Fragment>
        ))}
      </LayersControl>

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
