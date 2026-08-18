import React from 'react';
import { Search, Filter, Plus, X, Film, Tv, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function FilterBar({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  sortBy,
  onSortByChange,
  onOpenAddModal,
}) {
  return (
    <div className="filter-bar-container">
      {/* Search Input */}
      <div className="search-input-wrapper">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          placeholder="Search by title, genre, or notes..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        {search && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => onSearchChange('')}
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filters & Actions Group */}
      <div className="filter-actions-group">
        {/* Type Filter Buttons */}
        <div className="type-filter-group">
          <button
            type="button"
            className={`type-pill ${typeFilter === 'all' ? 'active' : ''}`}
            onClick={() => onTypeFilterChange('all')}
          >
            All
          </button>
          <button
            type="button"
            className={`type-pill ${typeFilter === 'Movie' ? 'active' : ''}`}
            onClick={() => onTypeFilterChange('Movie')}
          >
            <Film size={14} />
            <span>Movies</span>
          </button>
          <button
            type="button"
            className={`type-pill ${typeFilter === 'TV' ? 'active' : ''}`}
            onClick={() => onTypeFilterChange('TV')}
          >
            <Tv size={14} />
            <span>TV Shows</span>
          </button>
        </div>

        {/* Sort Select */}
        <div className="sort-select-wrapper">
          <ArrowUpDown size={15} className="sort-icon" />
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="sort-select"
            aria-label="Sort media by"
          >
            <option value="-updated_at">Recently Updated</option>
            <option value="-created_at">Recently Added</option>
            <option value="-rating">Highest Rated</option>
            <option value="rating">Lowest Rated</option>
            <option value="title">Title (A - Z)</option>
            <option value="-title">Title (Z - A)</option>
          </select>
        </div>

        {/* Primary Add Button */}
        <button
          type="button"
          className="btn-add-primary"
          onClick={onOpenAddModal}
        >
          <Plus size={18} />
          <span>Add Media</span>
        </button>
      </div>
    </div>
  );
}
