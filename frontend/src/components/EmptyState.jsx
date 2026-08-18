import React from 'react';
import { Film, Plus, Sparkles, Search, Clock, CheckCircle2 } from 'lucide-react';

export default function EmptyState({
  activeTab,
  hasSearchOrFilter,
  onResetFilters,
  onOpenAddModal,
  onSeedData,
}) {
  if (hasSearchOrFilter) {
    return (
      <div className="empty-state-card">
        <div className="empty-icon-circle">
          <Search size={32} />
        </div>
        <h3 className="empty-title">No matching titles found</h3>
        <p className="empty-desc">
          We couldn't find anything matching your search filters. Try clearing your filters or adding a new title.
        </p>
        <button
          type="button"
          className="btn-secondary"
          onClick={onResetFilters}
        >
          Clear Search & Filters
        </button>
      </div>
    );
  }

  if (activeTab === 'Unwatched') {
    return (
      <div className="empty-state-card">
        <div className="empty-icon-circle unwatched-circle">
          <Clock size={36} />
        </div>
        <h3 className="empty-title">Your "To Watch" list is clear!</h3>
        <p className="empty-desc">
          Ready to discover new cinema? Add movies and TV shows you want to watch next, or load our starter recommendations.
        </p>
        <div className="empty-actions">
          <button
            type="button"
            className="btn-primary"
            onClick={onOpenAddModal}
          >
            <Plus size={16} />
            <span>Add a Movie or Show</span>
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={onSeedData}
          >
            <Sparkles size={16} />
            <span>Load Sample Movies</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="empty-state-card">
      <div className="empty-icon-circle watched-circle">
        <CheckCircle2 size={36} />
      </div>
      <h3 className="empty-title">No watched movies yet</h3>
      <p className="empty-desc">
        When you watch titles from your "To Watch" list, mark them as Watched and give them a 5-star rating!
      </p>
      <div className="empty-actions">
        <button
          type="button"
          className="btn-primary"
          onClick={onOpenAddModal}
        >
          <Plus size={16} />
          <span>Add & Rate a Movie</span>
        </button>
      </div>
    </div>
  );
}
