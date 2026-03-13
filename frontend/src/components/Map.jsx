import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import { getNews } from '../services/api';

const typeColors = {
  Rape: '#ff3d57',
  Murder: '#ff6b35',
  Riot: '#ffc107',
  Protest: '#a78bfa',
  Rally: '#00ff88',
  Other: '#8ab8c2'
};

const Map = ({ activeFilter }) => {
  const [mapLightMode, setMapLightMode] = useState(false);
  const [articles, setArticles] = useState([]);
  // India bounds to lock the map
  const indiaBounds = [
    [7.0, 68.0],  // Southwest corner
    [33.5, 95.5]  // Northeast corner
    // [5.0, 65.0],  // Southwest corner
    // [38.0, 100.0]  // Northeast corner
  ];

  useEffect(() => {
    const fetchNews = async () => {
      const newsData = await getNews();
      setArticles(newsData);
    };
    fetchNews();
  }, []);

  let filtered;
  if (activeFilter === 'all') {
    filtered = articles.filter(a => a.location?.lat);
  } else {
    filtered = articles.filter(a => a.incidentType === activeFilter && a.location?.lat);
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