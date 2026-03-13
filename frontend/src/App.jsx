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

  // Fetch articles from backend
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(BACKEND_URL);
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
    </div>
  );
};

export default App;