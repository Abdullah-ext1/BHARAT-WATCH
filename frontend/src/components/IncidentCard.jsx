import React, { useState, useRef, useEffect } from 'react';
import './IncidentCard.css';

const typeColors = {
  Rape: '#ff3d57',
  Murder: '#ff6b35',
  Riot: '#ffc107',
  Protest: '#a78bfa',
  Rally: '#00ff88',
  Other: '#8ab8c2'
};

const IncidentCard = ({ 
  incidents = [], 
  isOpen, 
  onClose, 
  initialIndex = 0 
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const cardRef = useRef(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  if (!isOpen || incidents.length === 0) return null;

  const currentIncident = incidents[currentIndex];
  const totalCards = incidents.length;

  // Handle swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    setTouchEnd(e.changedTouches[0].clientX);
    handleSwipe();
  };

  const handleSwipe = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < totalCards - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToIndex = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="incident-card-overlay">
      <div className="incident-card-container">
        {/* Close Button */}
        <button className="card-close-btn" onClick={onClose}>
          ✕
        </button>

        {/* Main Card */}
        <div 
          className="incident-card"
          ref={cardRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Card Header with Type Badge */}
          <div 
            className="card-header"
            style={{ backgroundColor: `${typeColors[currentIncident.incidentType] || typeColors.Other}20` }}
          >
            <span 
              className="card-type-badge"
              style={{ backgroundColor: typeColors[currentIncident.incidentType] || typeColors.Other }}
            >
              {currentIncident.incidentType}
            </span>
            <span className="card-location">
              📍 {currentIncident.location?.city || 'Unknown Location'}
            </span>
          </div>

          {/* Card Body */}
          <div className="card-body">
            <h3 className="card-title">{currentIncident.title}</h3>
            
            <p className="card-description">
              {currentIncident.description || 'No description available'}
            </p>

            <div className="card-meta">
              <div className="meta-item">
                <span className="meta-label">Source:</span>
                <span className="meta-value">{currentIncident.source}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Date:</span>
                <span className="meta-value">
                  {new Date(currentIncident.pubDate).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              {currentIncident.location?.lat && currentIncident.location?.lng && (
                <div className="meta-item">
                  <span className="meta-label">Coordinates:</span>
                  <span className="meta-value">
                    {currentIncident.location.lat.toFixed(4)}, {currentIncident.location.lng.toFixed(4)}
                  </span>
                </div>
              )}
            </div>

            {/* Read More Link */}
            {currentIncident.url && (
              <a 
                href={currentIncident.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="card-link"
              >
                Read Full Article →
              </a>
            )}
          </div>

          {/* Card Footer - Navigation */}
          <div className="card-footer">
            <button 
              className="card-nav-btn prev"
              onClick={goToPrev}
              disabled={currentIndex === 0}
              title="Previous incident"
            >
              ← Prev
            </button>

            <div className="card-pagination">
              {totalCards <= 5 ? (
                // Show all dots if 5 or fewer
                Array.from({ length: totalCards }).map((_, i) => (
                  <button
                    key={i}
                    className={`pagination-dot ${currentIndex === i ? 'active' : ''}`}
                    onClick={() => goToIndex(i)}
                    aria-label={`Go to incident ${i + 1}`}
                  />
                ))
              ) : (
                // Show text if more than 5
                <span className="pagination-text">
                  {currentIndex + 1} / {totalCards}
                </span>
              )}
            </div>

            <button 
              className="card-nav-btn next"
              onClick={goToNext}
              disabled={currentIndex === totalCards - 1}
              title="Next incident"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Swipe Hint */}
        {totalCards > 1 && (
          <div className="swipe-hint">
            👆 Swipe or use arrows to browse
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentCard;
