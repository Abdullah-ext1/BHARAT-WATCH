import { Analytics } from "@vercel/analytics/react";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header.jsx';
import FilterPanel from './components/FilterPanel.jsx';
import Map from './components/Map.jsx';
import StatsPanel from './components/StatsPanel.jsx';
import Ticker from "./components/Ticker.jsx"
import Loading from './components/Loading.jsx';
import './App.css';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const App = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isDark, setIsDark] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [lastSync, setLastSync] = useState('--:--:--');
  const [isFeedPanelOpen, setIsFeedPanelOpen] = useState(false);
  const [isStatsPanelOpen, setIsStatsPanelOpen] = useState(false);

  // Fetch articles from backend
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsUrl = `${BACKEND_URL}/news`;
        const response = await axios.get(newsUrl);
        const data = response.data.data || [];
        setArticles(data);
        
        // Update last sync time
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        });
        setLastSync(timeString);
      } catch (error) {
        console.error('Error fetching news:', error);
        setArticles([]);
      }
    };

    fetchNews();
    // Fetch every 30 seconds for live updates
    const interval = setInterval(fetchNews, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  const totalIncidents = articles.length;
  const geoLocatedIncidents = articles.filter(a => a.location?.lat && a.location?.lng).length;

  let appClassName;
  if (isDark) {
    appClassName = "app dark";
  } else {
    appClassName = "app light";
  }

  return (
    
      <>
      <Analytics />
    <div className={appClassName}>
      <Header 
        isDark={isDark} 
        onToggle={() => setIsDark(!isDark)} 
        totalIncidents={totalIncidents}
        lastSync={lastSync}
      />
      <div className="main">
        <FilterPanel activeFilter={activeFilter} onFilterChange={setActiveFilter} articles={articles} />
        <Map activeFilter={activeFilter} articles={articles} />
        <StatsPanel articles={articles} />
      </div>
      <Ticker />

      {/* Mobile Live Feed Panel */}
      <div className={`mobile-side-panel ${isFeedPanelOpen ? 'open' : ''}`}>
        <div className="mobile-panel-header">
          <h2>LIVE FEED</h2>
          <button 
            className="mobile-panel-close" 
            onClick={() => setIsFeedPanelOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="mobile-panel-content">
          <FilterPanel 
            activeFilter={activeFilter} 
            onFilterChange={setActiveFilter} 
            articles={articles}
          />
        </div>
      </div>

      {/* Mobile Analytics Panel */}
      <div className={`mobile-side-panel ${isStatsPanelOpen ? 'open' : ''}`}>
        <div className="mobile-panel-header">
          <h2>ANALYTICS</h2>
          <button 
            className="mobile-panel-close" 
            onClick={() => setIsStatsPanelOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="mobile-panel-content">
          <StatsPanel articles={articles} />
        </div>
      </div>

      {/* Mobile Toggle Buttons */}
      <button 
        className="mobile-panel-toggle mobile-feed-btn"
        onClick={() => setIsFeedPanelOpen(true)}
      >
        📰 FEED
      </button>
      <button 
        className="mobile-panel-toggle mobile-stats-btn"
        onClick={() => setIsStatsPanelOpen(true)}
      >
        📊 STATS
      </button>
    </div>
    </>
  );
};

export default App;