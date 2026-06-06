import React from "react";
import { useApp } from "../context/AppContext";

function FilterBar() {
  const { searchQuery, setSearchQuery, statusFilter, setStatusFilter } = useApp();

  return (
    <section className="filter-bar-section">
      <div className="filter-bar">
        
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="clear-search-btn"
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>

        
        <div className="filter-wrapper">
          <label htmlFor="status-filter">Filter by Status</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>
    </section>
  );
}

export default FilterBar;
