"use client";

import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

const markerIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const MapWithMarker = () => {
  const markers: [number, number, string][] = [
    [59.347358613537246, 18.07072872673351, "Nymble"],
    [59.34951101902282, 18.071636049206543, "KTH Innovation"],
  ];

  return (
    <div className="md:w-1/2 w-full mx-auto border-4 border-melon-700 rounded-xl shadow-lg">
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
