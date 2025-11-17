"use client";

import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

const markerIcon = new L.Icon({
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const MapWithMarker = () => {
  const markers: [number, number, string][] = [
    [59.347358613537246, 18.07072872673351, "Nymble"],
    [59.34951101902282, 18.071636049206543, "KTH Innovation"],
  ];

  return (
    <div className="z-10 md:w-1/2 w-full mx-auto border-4 border-melon-700 rounded-xl shadow-lg">
      <MapContainer center={[59.3485, 18.0715]} zoom={16} className="w-full h-[350px]">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map(([lat, lon, name], idx) => (
          <Marker key={idx} position={[lat, lon]} icon={markerIcon}>
            <Popup>{name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapWithMarker;
