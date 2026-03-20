import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import { useState, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import IncidentCard from './IncidentCard';

const typeColors = {
  Rape: '#ff3d57',
  Murder: '#ff6b35',
  Riot: '#ffc107',
  Protest: '#a78bfa',
  Rally: '#00ff88',
  Other: '#8ab8c2'
};

const Map = ({ activeFilter, articles = [] }) => {
  const [mapLightMode, setMapLightMode] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [cardIndex, setCardIndex] = useState(0);
  const markerRefs = useRef({});
  
  // Detect mobile
  const isMobile = window.innerWidth <= 768;
  const initialZoom = isMobile ? 3.5 : 4;
  
  // India bounds to lock the map (desktop only)
  const indiaBounds = isMobile ? [9.0, 72.0] : [
    [7.0, 68.0],  // Southwest corner
    [33.5, 95.5]  // Northeast corner
  ];

  const filtered = activeFilter === 'all' 
    ? articles.filter(a => a.location?.lat)
    : articles.filter(a => a.incidentType === activeFilter && a.location?.lat);

  // Group incidents by location (lat, lng)
  const groupedByLocation = {};
  filtered.forEach(article => {
    const key = `${article.location.lat.toFixed(4)},${article.location.lng.toFixed(4)}`;
    if (!groupedByLocation[key]) {
      groupedByLocation[key] = {
        lat: article.location.lat,
        lng: article.location.lng,
        incidents: []
      };
    }
    groupedByLocation[key].incidents.push(article);
  });

  const locationMarkers = Object.values(groupedByLocation);

  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
    setCardIndex(0);
  };

  const handleCloseCard = () => {
    setSelectedLocation(null);
  };

  const tileUrl = mapLightMode
    ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

  const mapWrapperClass = mapLightMode ? "map-wrapper light" : "map-wrapper dark";
  const buttonText = mapLightMode ? "MAP DARK" : "MAP LIGHT";

  return (
    <div className={mapWrapperClass}>
      <button className="map-light-toggle" onClick={() => setMapLightMode(!mapLightMode)}>
        {buttonText}
      </button>
      <MapContainer
        center={[22.5, 82.0]}
        zoom={initialZoom}
        zoomControl={false}
        maxBounds={indiaBounds}
        maxBoundsViscosity={1.0}
        minZoom={isMobile ? 3.5 : 4}
        maxZoom={12}
        className="map"
      >
        <TileLayer
          url={tileUrl}
          attribution="©OpenStreetMap ©CARTO"
        />

        {locationMarkers.map((location, i) => {
          const primaryIncident = location.incidents[0];
          const incidentCount = location.incidents.length;
          
          return (
            <CircleMarker
              key={i}
              center={[location.lat, location.lng]}
              radius={incidentCount > 1 ? 12 : 8}
              pathOptions={{
                color: typeColors[primaryIncident.incidentType] || typeColors.Other,
                fillColor: typeColors[primaryIncident.incidentType] || typeColors.Other,
                fillOpacity: 0.8,
                weight: incidentCount > 1 ? 3 : 2
              }}
              eventHandlers={{
                click: () => handleMarkerClick(location)
              }}
            />
          );
        })}
      </MapContainer>

      <div className="corner-tag tl">LAT 20.5937° N</div>
      <div className="corner-tag tr">LON 78.9629° E</div>
      <div className="corner-tag bl">INDIA // THREAT ANALYSIS</div>

      {/* Incident Card Modal */}
      <IncidentCard
        incidents={selectedLocation?.incidents || []}
        isOpen={selectedLocation !== null}
        onClose={handleCloseCard}
        initialIndex={cardIndex}
      />
    </div>
  );
};

export default Map;