import { useState } from 'react';
import { SECTIONS } from '../../constants';
import { getSectionCount } from '../../data';

export default function Sidebar({ activeSection, onSectionChange, searchTerm, onSearchChange, importantCount }) {
  const [clickCount, setClickCount] = useState(0);

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    // Reset click count after 2 seconds of inactivity
    setTimeout(() => {
      setClickCount(0);
    }, 2000);

    if (newCount >= 5) {
      setClickCount(0);
      // Dispatch an event to open the modal in App.jsx
      window.dispatchEvent(new Event('openSecretModal'));
    }
  };

  return (
    <aside className="sidebar">
      {/* Fixed header: logo + search */}
      <div className="sidebar-header">
        <div className="sidebar-logo" onClick={handleLogoClick} style={{ cursor: 'pointer', userSelect: 'none' }}>
          <div className="sidebar-logo-icon">⚡</div>
          <div>
            <div className="sidebar-logo-text">MERN Prep</div>
            <div className="sidebar-logo-sub">2026 Edition</div>
          </div>
        </div>
        <div className="sidebar-search">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Scrollable nav list */}
      <nav className="sidebar-scroll">
        {SECTIONS.map((group) => (
          <div className="sidebar-section" key={group.group}>
            <div className="sidebar-title">{group.group}</div>
            {group.items.map((item) => (
              <div
                key={item.id}
                className={`sidebar-item${activeSection === item.id ? ' active' : ''}`}
                onClick={() => onSectionChange(item.id)}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
                <span className="count">
                  {item.id === 'important' ? importantCount : getSectionCount(item.id)}
                </span>
              </div>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
