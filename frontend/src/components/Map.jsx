import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { useState } from 'react';
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

const mockArticles = [
  { title: "Delhi riots: Violence erupts leaving 3 dead", incidentType: "Riot", location: { city: "Delhi", lat: 28.6139, lng: 77.2090 }, source: "BBC", pubDate: new Date() },
  { title: "Mumbai: Sexual assault case reported in Dharavi", incidentType: "Rape", location: { city: "Mumbai", lat: 19.0760, lng: 72.8777 }, source: "NDTV", pubDate: new Date() },
  { title: "Farmers protest in Delhi near Red Fort", incidentType: "Protest", location: { city: "Delhi", lat: 28.6562, lng: 77.2410 }, source: "The Hindu", pubDate: new Date() },
  { title: "Bengaluru murder case: Body found near Koramangala", incidentType: "Murder", location: { city: "Bengaluru", lat: 12.9716, lng: 77.5946 }, source: "TOI", pubDate: new Date() },
  { title: "BJP rally in Chennai draws massive crowd", incidentType: "Rally", location: { city: "Chennai", lat: 13.0827, lng: 80.2707 }, source: "IE", pubDate: new Date() },
  { title: "Kolkata: Anti-CAA protest turns violent", incidentType: "Protest", location: { city: "Kolkata", lat: 22.5726, lng: 88.3639 }, source: "Telegraph", pubDate: new Date() },
  { title: "Hyderabad gang rape: Police arrest 4 suspects", incidentType: "Rape", location: { city: "Hyderabad", lat: 17.3850, lng: 78.4867 }, source: "Hindu", pubDate: new Date() },
  { title: "Communal riots in Nagpur after Friday prayers", incidentType: "Riot", location: { city: "Nagpur", lat: 21.1458, lng: 79.0882 }, source: "IE", pubDate: new Date() },
];

const Map = ({ activeFilter }) => {
  const [mapLightMode, setMapLightMode] = useState(false);

  // India bounds to lock the map
  const indiaBounds = [
    [7.0, 68.0],  // Southwest corner
    [33.5, 95.5]  // Northeast corner
    // [5.0, 65.0],  // Southwest corner
    // [38.0, 100.0]  // Northeast corner
  ];

  let filtered;
  if (activeFilter === 'all') {
    filtered = mockArticles.filter(a => a.location?.lat);
  } else {
    filtered = mockArticles.filter(a => a.incidentType === activeFilter && a.location?.lat);
  }

  let tileUrl;
  if (mapLightMode) {
    tileUrl = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
  } else {
    tileUrl = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
  }

  let popupClass;
  if (mapLightMode) {
    popupClass = "light-popup";
  } else {
    popupClass = "dark-popup";
  }

  let mapWrapperClass;
  if (mapLightMode) {
    mapWrapperClass = "map-wrapper light";
  } else {
    mapWrapperClass = "map-wrapper dark";
  }

  let buttonText;
  if (mapLightMode) {
    buttonText = "MAP DARK";
  } else {
    buttonText = "MAP LIGHT";
  }

  return (
    <div className={mapWrapperClass}>
      <button className="map-light-toggle" onClick={() => setMapLightMode(!mapLightMode)}>
        {buttonText}
      </button>
      <MapContainer
        center={[22.5, 82.0]}
        zoom={4}
        zoomControl={false}
        maxBounds={indiaBounds}
        maxBoundsViscosity={1.0}
        minZoom={4}
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
            center={[article.location.lat, article.location.lng]}
            radius={8}
            pathOptions={{
              color: typeColors[article.incidentType] || typeColors.Other,
              fillColor: typeColors[article.incidentType] || typeColors.Other,
              fillOpacity: 0.8,
              weight: 2
            }}
          >
            <Popup className={popupClass}>
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