"use client";

import "leaflet/dist/leaflet.css";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const yellowIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Threat = {
  id: number;
  type: string;
  location: string;
  risk: string;
  lat: number;
  lng: number;
};

export default function LeafletMap({
  threats,
}: {
  threats: Threat[];
}) {  
    
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-cyan-500/20">
      <h3 className="text-2xl font-bold text-cyan-400 mb-6">
        Smart City Threat Map
      </h3>

      <div className="h-[500px] rounded-xl overflow-hidden">
        <MapContainer
          center={[12.9716, 77.5946]}
          zoom={11}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {threats
            ?.filter(
              (threat) =>
                !isNaN(Number(threat.lat)) &&
                !isNaN(Number(threat.lng))
            )
            .map((threat) => (
              <Marker
                key={threat.id}
                position={[threat.lat, threat.lng]}
                icon={
                  threat.risk === "High"
                    ? redIcon
                    : yellowIcon
                }
              >
              <Popup>
                <strong>{threat.location}</strong>
                <br />
                {threat.type}
                <br />
                Risk: {threat.risk}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}