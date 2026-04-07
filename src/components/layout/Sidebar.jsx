import { useState, useMemo, useCallback } from 'react';
import { SECTIONS } from '../../constants';
import { getSectionCount } from '../../data';

export default function Sidebar({ activeSection, onSectionChange, searchTerm, onSearchChange, importantCount }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-search">
        <input
          type="text"
          placeholder="Search questions..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

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
              {item.label}
              <span className="count">
                {item.id === 'important' ? importantCount : getSectionCount(item.id)}
              </span>
            </div>
          ))}
        </div>
      ))}
    </aside>
  );
}
