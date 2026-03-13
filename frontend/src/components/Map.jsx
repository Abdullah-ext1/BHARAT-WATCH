import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { useState, useRef, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import './Map.css';

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

  const tileUrl = mapLightMode
    ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

  const popupClass = mapLightMode ? "light-popup" : "dark-popup";
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

        {filtered.map((article, i) => (
          <CircleMarker
            key={i}
            ref={(el) => markerRefs.current[i] = el}
            center={[article.location.lat, article.location.lng]}
            radius={8}
            pathOptions={{
              color: typeColors[article.incidentType] || typeColors.Other,
              fillColor: typeColors[article.incidentType] || typeColors.Other,
              fillOpacity: 0.8,
              weight: 2
            }}
            onMouseOver={() => {
              if (markerRefs.current[i]) {
                markerRefs.current[i].openPopup();
              }
            }}
            onMouseOut={() => {
              if (markerRefs.current[i]) {
                markerRefs.current[i].closePopup();
              }
            }}
          >
            <Popup className={popupClass} closeButton={false}>
              <div className="popup-type" style={{ color: typeColors[article.incidentType] }}>
                {article.incidentType} // {article.location.city}
              </div>
              <div className="popup-title">{article.title}</div>
              <div className="popup-meta">{article.source} // {new Date(article.pubDate).toLocaleDateString()}</div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <div className="corner-tag tl">LAT 20.5937° N</div>
      <div className="corner-tag tr">LON 78.9629° E</div>
      <div className="corner-tag bl">INDIA // THREAT ANALYSIS</div>
    </div>
  );
};

export default Map;