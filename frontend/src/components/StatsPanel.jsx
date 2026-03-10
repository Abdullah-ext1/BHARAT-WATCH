import React from 'react';
import './StatsPanel.css';

const mockArticles = [
  { incidentType: "Riot", location: { city: "Delhi" } },
  { incidentType: "Rape", location: { city: "Mumbai" } },
  { incidentType: "Protest", location: { city: "Delhi" } },
  { incidentType: "Murder", location: { city: "Bengaluru" } },
  { incidentType: "Rally", location: { city: "Chennai" } },
  { incidentType: "Protest", location: { city: "Kolkata" } },
  { incidentType: "Rape", location: { city: "Hyderabad" } },
  { incidentType: "Riot", location: { city: "Nagpur" } },
  { incidentType: "Murder", location: { city: "Pune" } },
  { incidentType: "Rally", location: { city: "Lucknow" } },
  { incidentType: "Other" },
  { incidentType: "Rape" },
];

const typeColors = {
  Rape: '#ff3d57',
  Murder: '#ff6b35',
  Riot: '#ffc107',
  Protest: '#a78bfa',
  Rally: '#00ff88',
};

const StatsPanel = () => {
  const total = mockArticles.length;
  const geoCount = mockArticles.filter(a => a.location?.city).length;

  const counts = { Rape: 0, Murder: 0, Riot: 0, Protest: 0, Rally: 0 };
  mockArticles.forEach(a => { if (counts[a.incidentType] !== undefined) counts[a.incidentType]++; });

  const cityCounts = {};
  mockArticles.forEach(a => {
    if (a.location?.city) cityCounts[a.location.city] = (cityCounts[a.location.city] || 0) + 1;
  });
  const hotZones = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  let hotZonesContent;
  if (hotZones.length > 0) {
    hotZonesContent = hotZones.map(([city, n]) => (
      <div className="hot-zone-row" key={city}>
        <span>{city}</span>
        <span style={{ color: '#ff3d57' }}>{n}</span>
      </div>
    ));
  } else {
    hotZonesContent = <div>-- NO DATA --</div>;
  }

  return (
    <div className="stats-panel">
      <div className="panel-header"><span>ANALYTICS</span></div>

      <div className="stat-block">
        <div className="stat-label">Total Incidents</div>
        <div className="stat-value">{total}</div>
        <div className="stat-sub">Across all categories</div>
      </div>

      <div className="stat-block">
        <div className="stat-label">Geo-Located</div>
        <div className="stat-value" style={{ color: '#00ff88' }}>{geoCount}</div>
        <div className="stat-sub">Pinned on map</div>
      </div>

      <div className="stat-block">
        <div className="stat-label">Threat Index</div>
        <div className="threat-level">
          {[...Array(5)].map((_, i) => {
            let activeClass = '';
            if (i < 4) {
              activeClass = 'active';
            }
            return (
              <div key={i} className={`threat-seg ${activeClass}`}></div>
            );
          })}
        </div>
        <div className="stat-sub" style={{ marginTop: 6 }}>ELEVATED // MONITOR</div>
      </div>

      <div className="bar-chart">
        <div className="stat-label">Distribution</div>
        {Object.entries(counts).map(([type, count]) => {
          const pct = Math.round((count / total) * 100);
          return (
            <div className="bar-row" key={type}>
              <div className="bar-label">
                <span>{type}</span>
                <span>{pct}%</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${pct}%`, background: typeColors[type] }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="stat-block">
        <div className="stat-label">Hot Zones</div>
        <div className="hot-zones">
          {hotZonesContent}
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;