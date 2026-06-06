import React, { createContext, useState, useEffect, useContext } from "react";

const API_BASE = process.env.REACT_APP_API_BASE;
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [page, setPage] = useState("loading"); 
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");

  
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");

  
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  
  const [draggingTaskId, setDraggingTaskId] = useState(null);
  const [activeDropCol, setActiveDropCol] = useState(null);

  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [currentTab, setCurrentTab] = useState("checklist"); 

  
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      (task.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  
  useEffect(() => {
    checkAuth();
  }, []);

  
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    
    if (!token || token === "undefined" || token === "null") {
      localStorage.removeItem("token");
      setPage("login");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setUser(data.user);
        
        
        const tasksRes = await fetch(`${API_BASE}/tasks`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
        });
        const tasksData = await tasksRes.json();
        if (tasksRes.ok && tasksData.success) {
          setTasks(tasksData.tasks);
        }
        
        setPage("dashboard");
      } else {
        if (res.status === 401 || res.status === 403) {
          console.warn("Invalid token, clearing session.");
          localStorage.removeItem("token");
        }
        setPage("login");
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setPage("login");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!authEmail || !authPassword) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authEmail, password: authPassword }),
      });
      const data = await res.json();

      if (res.ok && data.success && data.token) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        await fetchTasks();
        setPage("dashboard");
        setAuthEmail("");
        setAuthPassword("");
      } else {
        setError(data.message || "Invalid credentials.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!authName || !authEmail || !authPassword) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: authName,
          email: authEmail,
          password: authPassword,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success && data.token) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        setTasks([]);
        setPage("dashboard");
        setAuthName("");
        setAuthEmail("");
        setAuthPassword("");
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setTasks([]);
    setPage("login");
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: "GET",
        headers: getHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTasks(data.tasks);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    setError("");
    if (!taskTitle.trim()) {
      setError("Task title cannot be empty.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ title: taskTitle, description: taskDesc }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setTasks([...tasks, data.task]);
        setTaskTitle("");
        setTaskDesc("");
        setSuccess("Task added!");
      } else {
        setError(data.message || "Failed to add task.");
      }
    } catch (err) {
      setError("Server error while adding task.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setTasks(tasks.filter((t) => t._id !== taskId));
        setSuccess("Task deleted.");
      } else {
        setError(data.message || "Failed to delete task.");
      }
    } catch (err) {
      setError("Server error while deleting task.");
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setTasks(tasks.map((t) => (t._id === taskId ? data.task : t)));
      } else {
        setError(data.message || "Failed to update status.");
      }
    } catch (err) {
      setError("Server error updating task status.");
    }
  };

  const startEditTask = (task) => {
    setEditingTaskId(task._id);
    setEditTitle(task.title);
    setEditDesc(task.description);
  };

  const handleSaveEdit = async (taskId) => {
    if (!editTitle.trim()) {
      setError("Task title cannot be empty.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ title: editTitle, description: editDesc }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setTasks(tasks.map((t) => (t._id === taskId ? data.task : t)));
        setEditingTaskId(null);
        setSuccess("Task updated!");
      } else {
        setError(data.message || "Failed to update task.");
      }
    } catch (err) {
      setError("Server error while updating task.");
    }
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("text/plain", taskId);
    setDraggingTaskId(taskId);
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain") || draggingTaskId;
    if (!taskId) return;

    const task = tasks.find((t) => t._id === taskId);
    if (!task || task.status === targetStatus) {
      setDraggingTaskId(null);
      return;
    }

    await handleUpdateStatus(taskId, targetStatus);
    setDraggingTaskId(null);
  };

  return (
    <AppContext.Provider
      value={{
        page,
        setPage,
        user,
        setUser,
        tasks,
        setTasks,
        error,
        setError,
        success,
        setSuccess,
        authName,
        setAuthName,
        authEmail,
        setAuthEmail,
        authPassword,
        setAuthPassword,
        taskTitle,
        setTaskTitle,
        taskDesc,
        setTaskDesc,
        editingTaskId,
        setEditingTaskId,
        editTitle,
        setEditTitle,
        editDesc,
        setEditDesc,
        draggingTaskId,
        setDraggingTaskId,
        activeDropCol,
        setActiveDropCol,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        filteredTasks,
        selectedTaskId,
        setSelectedTaskId,
        currentTab,
        setCurrentTab,
        checkAuth,
        handleLogin,
        handleRegister,
        handleLogout,
        fetchTasks,
        handleAddTask,
        handleDeleteTask,
        handleUpdateStatus,
        startEditTask,
        handleSaveEdit,
        handleDragStart,
        handleDrop,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
