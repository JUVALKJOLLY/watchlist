import React from 'react';
import { Clock, CheckCircle2, Film, Eye } from 'lucide-react';

export default function TabsNav({
  activeTab,
  onTabChange,
  unwatchedCount = 0,
  watchedCount = 0,
}) {
  return (
    <div className="tabs-nav-wrapper">
      <div className="tabs-segmented-control" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'Unwatched'}
          className={`tab-btn ${activeTab === 'Unwatched' ? 'active' : ''}`}
          onClick={() => onTabChange('Unwatched')}
        >
          <Clock size={18} className="tab-icon" />
          <span className="tab-label">To Watch</span>
          <span className="tab-badge">{unwatchedCount}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'Watched'}
          className={`tab-btn ${activeTab === 'Watched' ? 'active' : ''}`}
          onClick={() => onTabChange('Watched')}
        >
          <CheckCircle2 size={18} className="tab-icon" />
          <span className="tab-label">Watched</span>
          <span className="tab-badge">{watchedCount}</span>
        </button>
      </div>
    </div>
  );
}
