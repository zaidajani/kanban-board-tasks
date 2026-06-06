import React from "react";
import { useApp } from "../context/AppContext";

function Sidebar() {
  const { user, handleLogout, currentTab, setCurrentTab } = useApp();

  return (
    <aside className="app-sidebar">
      
      <div className="sidebar-profile">
        <div className="profile-avatar">
          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>
        <div className="profile-info">
          <span className="profile-name">{user?.name || "User"}</span>
          <span className="profile-email">{user?.email || "Workspace"}</span>
        </div>
      </div>

      
      <nav className="sidebar-nav">
        <button
          className={`nav-item ${currentTab === "checklist" ? "active" : ""}`}
          onClick={() => setCurrentTab("checklist")}
        >
          <svg className="nav-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <span className="nav-label">Checklist</span>
        </button>

        <button
          className={`nav-item ${currentTab === "board" ? "active" : ""}`}
          onClick={() => setCurrentTab("board")}
        >
          <svg className="nav-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
          <span className="nav-label">Kanban Board</span>
        </button>
      </nav>

      
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="btn-sidebar-logout">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
