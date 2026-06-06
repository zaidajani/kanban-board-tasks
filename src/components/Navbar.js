import React from "react";
import { useApp } from "../context/AppContext";

function Navbar() {
  const { user, handleLogout } = useApp();

  return (
    <header className="navbar">
      <div className="logo-section">
        <h2>TaskSpace</h2>
      </div>
      <div className="user-section">
        <span>{user?.name}</span>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
