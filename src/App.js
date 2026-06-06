import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import TaskForm from "./components/TaskForm";
import Checklist from "./components/Checklist";
import Board from "./components/Board";
import FilterBar from "./components/FilterBar";
import Sidebar from "./components/Sidebar";
import TaskDetailsPane from "./components/TaskDetailsPane";
import "./App.css";

function AppContent() {
  const {
    page,
    setPage,
    error,
    setError,
    success,
    authName,
    setAuthName,
    authEmail,
    setAuthEmail,
    authPassword,
    setAuthPassword,
    handleLogin,
    handleRegister,
    currentTab,
    selectedTaskId,
    setSelectedTaskId,
  } = useApp();

  
  if (page === "loading") {
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <p>Connecting to TaskSpace...</p>
      </div>
    );
  }

  
  if (page === "login") {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1>TaskSpace</h1>
          <p className="subtitle">Sign in to manage your daily tasks</p>
          
          {error && <div className="alert alert-error">{error}</div>}
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary">Sign In</button>
          </form>
          
          <div className="auth-footer">
            Don't have an account?{" "}
            <span onClick={() => { setPage("register"); setError(""); }}>
              Register here
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Render Register
  if (page === "register") {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1>Create Account</h1>
          <p className="subtitle">Get started with a clean, minimal workspace</p>
          
          {error && <div className="alert alert-error">{error}</div>}
          
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Min. 6 characters"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary">Register</button>
          </form>
          
          <div className="auth-footer">
            Already have an account?{" "}
            <span onClick={() => { setPage("login"); setError(""); }}>
              Sign In
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Render Dashboard
  return (
    <div className="centered-app-wrapper">
      <div className="centered-app-container">
        
        <Sidebar />

        
        <div className="middle-panel">
          <h1 className="middle-panel-title">
            {currentTab === "checklist" ? "My Tasks" : "Kanban Board"}
          </h1>

          <TaskForm />

          <FilterBar />

          
          {error && <div className="toast toast-error">{error}</div>}
          {success && <div className="toast toast-success">{success}</div>}

          <div className="middle-panel-content">
            {currentTab === "checklist" ? <Checklist /> : <Board />}
          </div>
        </div>
      </div>

      
      {selectedTaskId && (
        <div className="modal-backdrop" onClick={() => setSelectedTaskId(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <TaskDetailsPane />
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
