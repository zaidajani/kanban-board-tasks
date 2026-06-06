import React from "react";
import { useApp } from "../context/AppContext";

function TaskForm() {
  const {
    taskTitle,
    setTaskTitle,
    taskDesc,
    setTaskDesc,
    handleAddTask,
  } = useApp();

  return (
    <section className="creation-section">
      <form onSubmit={handleAddTask} className="task-form">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Add details (optional)..."
          value={taskDesc}
          onChange={(e) => setTaskDesc(e.target.value)}
        />
        <button type="submit" className="btn-add">
          Add Task
        </button>
      </form>
    </section>
  );
}

export default TaskForm;
