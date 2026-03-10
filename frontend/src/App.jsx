import { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import FilterPanel from './components/FilterPanel.jsx';
import Map from './components/Map.jsx';
import StatsPanel from './components/StatsPanel.jsx';
import Ticker from "./components/Ticker.jsx"
import Loading from './components/Loading.jsx';
import './App.css';

const App = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isDark, setIsDark] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  let appClassName;
  if (isDark) {
    appClassName = "app dark";
  } else {
    appClassName = "app light";
  }

  return (
    <div className={appClassName}>
      <Header isDark={isDark} onToggle={() => setIsDark(!isDark)} />
      <div className="main">
        <FilterPanel activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        <Map activeFilter={activeFilter} />
        <StatsPanel />
      </div>
      <Ticker />
    </div>
  );
};

export default App;