const router = require("express").Router();
const auth = require("../middleware/auth.middleware");




router.get("/", auth, async (req, res) => {
  try {
    
    res.status(200).json({
      success: true,
      tasks: req.user.tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ message: "Server error while fetching tasks" });
  }
});




router.post("/", auth, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const newTask = {
      title,
      description: description || "",
      status: "pending",
    };

    req.user.tasks.push(newTask);
    await req.user.save();

    
    const createdTask = req.user.tasks[req.user.tasks.length - 1];

    res.status(201).json({
      success: true,
      task: createdTask,
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ message: "Server error while creating task" });
  }
});




router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description, status } = req.body;

    
    const task = req.user.tasks.id(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) {
      if (!["pending", "in progress", "done"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      task.status = status;
    }

    await req.user.save();

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ message: "Server error while updating task" });
  }
});




router.delete("/:id", auth, async (req, res) => {
  try {
    const task = req.user.tasks.id(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    
    req.user.tasks.pull(req.params.id);
    await req.user.save();

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: "Server error while deleting task" });
  }
});

module.exports = router;
