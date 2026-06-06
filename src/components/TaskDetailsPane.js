import React from "react";
import { useApp } from "../context/AppContext";

function TaskDetailsPane() {
  const {
    tasks,
    selectedTaskId,
    setSelectedTaskId,
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
  } = useApp();

  const task = tasks.find((t) => t._id === selectedTaskId);

  if (!task) {
    return (
      <div className="details-pane empty">
        <div className="empty-state">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#A1A1AA" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3>No Task Selected</h3>
          <p>Select a task from the list or board to view its full details and manage its status.</p>
        </div>
      </div>
    );
  }

  const isEditing = editingTaskId === task._id;

  return (
    <div className="details-pane">
      
      <div className="details-toolbar">
        <button
          onClick={() => setSelectedTaskId(null)}
          className="btn-close-details"
          title="Close details"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="toolbar-actions">
          {!isEditing ? (
            <>
              <button
                onClick={() => startEditTask(task)}
                className="btn-toolbar edit"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  handleDeleteTask(task._id);
                  setSelectedTaskId(null);
                }}
                className="btn-toolbar delete"
              >
                Delete
              </button>
            </>
          ) : (
            <>
              <button
                onClick={async () => {
                  await handleSaveEdit(task._id);
                }}
                className="btn-toolbar save"
              >
                Save
              </button>
              <button
                onClick={() => setEditingTaskId(null)}
                className="btn-toolbar cancel"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      
      <div className="details-content">
        {isEditing ? (
          <div className="details-editor">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="details-title-input"
              placeholder="Task Title"
              required
            />
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="details-desc-textarea"
              placeholder="Add description..."
            />
          </div>
        ) : (
          <div className="details-view">
            <h2 className="details-title">{task.title}</h2>
            <p className="details-desc">
              {task.description || <span className="no-desc">No description provided. Click edit to add details.</span>}
            </p>
          </div>
        )}

        
        <div className="details-metadata">
          <div className="metadata-row">
            <span className="metadata-label">Status</span>
            <div className="metadata-value">
              <select
                value={task.status}
                onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
                className={`status-pill-select status-${task.status.replace(/\s+/g, "-")}`}
              >
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div className="metadata-row">
            <span className="metadata-label">Identifier</span>
            <span className="metadata-value code-font">{task._id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailsPane;
