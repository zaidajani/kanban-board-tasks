import React, { useState } from "react";
import { useApp } from "../context/AppContext";

function Board() {
  const {
    filteredTasks,
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
    handleDeleteTask,
    handleUpdateStatus,
    startEditTask,
    handleSaveEdit,
    handleDragStart,
    handleDrop,
    selectedTaskId,
    setSelectedTaskId,
  } = useApp();

  const [colPages, setColPages] = useState({
    pending: 1,
    "in progress": 1,
    done: 1,
  });
  const itemsPerPage = 5;

  const columns = [
    { id: "pending", title: "Pending", accent: "col-pending" },
    { id: "in progress", title: "In Progress", accent: "col-progress" },
    { id: "done", title: "Done", accent: "col-done" },
  ];

  return (
    <div className="board-container">
      <section className="board-grid">
      {columns.map((col) => {
        const colTasks = filteredTasks.filter((t) => t.status === col.id);
        const colTotalPages = Math.ceil(colTasks.length / itemsPerPage) || 1;
        const colActivePage = Math.min(colPages[col.id] || 1, colTotalPages);
        const colPaginatedTasks = colTasks.slice(
          (colActivePage - 1) * itemsPerPage,
          colActivePage * itemsPerPage
        );
        return (
          <div
            key={col.id}
            className={`board-column ${col.accent} ${
              activeDropCol === col.id ? "drag-over" : ""
            }`}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => setActiveDropCol(col.id)}
            onDragLeave={() => setActiveDropCol(null)}
            onDrop={(e) => {
              handleDrop(e, col.id);
              setActiveDropCol(null);
            }}
          >
            <div className="column-header">
              <h3>{col.title}</h3>
              <span className="task-count">{colTasks.length}</span>
            </div>

            <div className="task-list">
              {colTasks.length === 0 ? (
                <div className="empty-placeholder">No tasks</div>
              ) : (
                colPaginatedTasks.map((task) => (
                  <div
                    key={task._id}
                    className={`task-card ${
                      draggingTaskId === task._id ? "dragging" : ""
                    } ${selectedTaskId === task._id ? "selected" : ""} ${
                      editingTaskId === task._id ? "editing" : ""
                    }`}
                    draggable={editingTaskId !== task._id}
                    onDragStart={(e) => handleDragStart(e, task._id)}
                    onDragEnd={() => setDraggingTaskId(null)}
                    onClick={() => {
                      if (editingTaskId !== task._id) {
                        setSelectedTaskId(task._id);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {editingTaskId === task._id ? (
                      <div className="task-edit-form" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Title"
                          className="edit-title-input"
                          required
                        />
                        <textarea
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          placeholder="Description"
                          className="edit-desc-input"
                        />
                        <div className="edit-actions">
                          <button
                            onClick={() => handleSaveEdit(task._id)}
                            className="btn-save"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingTaskId(null)}
                            className="btn-cancel"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="task-card-header">
                          <h4>{task.title}</h4>
                        </div>
                        {task.description && (
                          <p className="task-desc">{task.description}</p>
                        )}

                        <div className="task-card-footer" onClick={(e) => e.stopPropagation()}>
                          <div className="status-selector">
                            <label>Status</label>
                            <select
                              value={task.status}
                              onChange={(e) =>
                                handleUpdateStatus(task._id, e.target.value)
                              }
                            >
                              <option value="pending">Pending</option>
                              <option value="in progress">In Progress</option>
                              <option value="done">Done</option>
                            </select>
                          </div>

                          <div className="card-actions">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditTask(task);
                              }}
                              className="action-link edit"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTask(task._id);
                                if (selectedTaskId === task._id) setSelectedTaskId(null);
                              }}
                              className="action-link delete"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className={`col-pagination-controls ${colTotalPages <= 1 ? "invisible" : ""}`}>
              <button
                onClick={() =>
                  setColPages((prev) => ({
                    ...prev,
                    [col.id]: Math.max(1, (prev[col.id] || 1) - 1),
                  }))
                }
                disabled={colActivePage === 1}
                className="pagination-btn"
              >
                Prev
              </button>
              <span className="pagination-info">
                {colActivePage} / {colTotalPages}
              </span>
              <button
                onClick={() =>
                  setColPages((prev) => ({
                    ...prev,
                    [col.id]: Math.min(colTotalPages, (prev[col.id] || 1) + 1),
                  }))
                }
                disabled={colActivePage === colTotalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          </div>
        );
      })}
      </section>
    </div>
  );
}

export default Board;
