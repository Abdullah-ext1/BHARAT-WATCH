import './Header.css';

const Header = ({ isDark, onToggle }) => {
  let buttonText;
  if (isDark) {
    buttonText = 'LIGHT MODE';
  } else {
    buttonText = 'DARK MODE';
  }

  return (
    <header className="header">
      <div className="logo">INDIA<span>//</span>MONITOR <span className="version">v0.1.0</span></div>
      <div className="header-meta">
        <div className="meta-item"><span className="status-dot"></span>LIVE</div>
        <div className="meta-item">INCIDENTS: <strong>142</strong></div>
        <div className="meta-item">LAST SYNC: <strong>12:34:56</strong></div>
        <div className="meta-item">REGION: <strong>IN</strong></div>
        <button className="theme-toggle" onClick={onToggle}>
          {buttonText}
        </button>
      </div>
    </header>
  );
};

export default Header;