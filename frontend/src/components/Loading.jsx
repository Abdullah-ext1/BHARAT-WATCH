import './Loading.css';

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <h1 className="loading-title">INDIA MONITOR</h1>
        <p className="loading-subtitle">Initializing System...</p>
        <div className="loading-progress">
          <div className="loading-bar"></div>
        </div>
        <p className="loading-status">Loading Components...</p>
      </div>
    </div>
  );
};

export default Loading;
