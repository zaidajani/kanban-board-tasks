import React, { useState } from "react";
import { useApp } from "../context/AppContext";

function Checklist() {
  const {
    tasks,
    filteredTasks,
    editingTaskId,
    setEditingTaskId,
    editTitle,
    setEditTitle,
    editDesc,
    setEditDesc,
    handleSaveEdit,
    handleDeleteTask,
    handleUpdateStatus,
    startEditTask,
    selectedTaskId,
    setSelectedTaskId,
  } = useApp();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage) || 1;
  const activePage = Math.min(currentPage, totalPages);
  const paginatedTasks = filteredTasks.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );

  return (
    <section className="checklist-section">
      <div className="section-header">
        <h3>Quick Checklist</h3>
        <span className="checklist-progress">
          {tasks.filter((t) => t.status === "done").length} of {tasks.length} completed
        </span>
      </div>

      <div className="checklist-items">
        {filteredTasks.length === 0 ? (
          <div className="empty-placeholder">
            {tasks.length === 0
              ? "No tasks in your workspace yet. Use the input above to add one."
              : "No tasks match your search or filter."}
          </div>
        ) : (
          paginatedTasks.map((task) => (
            <div
              key={task._id}
              className={`checklist-item ${task.status === "done" ? "checked" : ""} ${
                editingTaskId === task._id ? "editing" : ""
              } ${selectedTaskId === task._id ? "selected" : ""}`}
              onClick={() => {
                if (editingTaskId !== task._id) {
                  setSelectedTaskId(task._id);
                }
              }}
              style={{ cursor: "pointer" }}
            >
              {editingTaskId === task._id ? (
                <div className="checklist-edit-form" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Title"
                    className="checklist-edit-title"
                    required
                  />
                  <input
                    type="text"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    placeholder="Description (optional)"
                    className="checklist-edit-desc"
                  />
                  <div className="checklist-edit-actions">
                    <button
                      onClick={() => handleSaveEdit(task._id)}
                      className="btn-save-checklist"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingTaskId(null)}
                      className="btn-cancel-checklist"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <label className="checkbox-container" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={task.status === "done"}
                      onChange={(e) =>
                        handleUpdateStatus(
                          task._id,
                          e.target.checked ? "done" : "pending"
                        )
                      }
                    />
                    <span className="checkmark"></span>
                  </label>

                  <div className="checklist-content">
                    <span className="checklist-title">{task.title}</span>
                    {task.description && (
                      <span className="checklist-desc">{task.description}</span>
                    )}
                  </div>

                  <div className="checklist-controls" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleUpdateStatus(task._id, e.target.value)
                      }
                      className="checklist-status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="in progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>

                    <div className="checklist-actions">
                      <button
                        onClick={() => startEditTask(task)}
                        className="action-link edit"
                        title="Edit task"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteTask(task._id);
                          if (selectedTaskId === task._id) setSelectedTaskId(null);
                        }}
                        className="btn-delete-checklist"
                        title="Delete task"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      <div className={`pagination-controls ${totalPages <= 1 ? "invisible" : ""}`}>
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={activePage === 1}
          className="pagination-btn"
        >
          Prev
        </button>
        <span className="pagination-info">
          Page {activePage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={activePage === totalPages}
          className="pagination-btn"
        >
          Next
        </button>
      </div>
    </section>
  );
}

export default Checklist;
