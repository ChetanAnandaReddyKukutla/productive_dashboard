import { useEffect, useState } from "react";
import API from "../api/axios";
import ProjectCard from "../components/ProjectCard";
import TaskCard from "../components/TaskCard";
import DraggableTaskCard from "../components/DraggableTaskCard";
import DroppableColumn from "../components/DroppableColumn";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

export default function DashboardWrapper() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Dashboard />
    </div>
  );
}

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  // Project fields
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [editProjectId, setEditProjectId] = useState(null);
  const [editProjectTitle, setEditProjectTitle] = useState("");
  const [editProjectDescription, setEditProjectDescription] = useState("");

  // Task fields
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskDesc, setEditTaskDesc] = useState("");
  const [editTaskPriority, setEditTaskPriority] = useState("medium");

  // Modal states
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);

  // Responsive state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Drag and drop state
  const [activeTask, setActiveTask] = useState(null);

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("❌ Error fetching projects:", err.response?.data || err);
      alert("Error fetching projects");
    }
  };

  // Fetch tasks for selected project
  const fetchTasks = async (projectId) => {
    try {
      console.log(`🔍 Fetching tasks for project ${projectId}...`);
      const res = await API.get(`/tasks/project/${projectId}`);
      console.log(`✅ Tasks fetched successfully:`, res.data);
      setTasks(res.data);
    } catch (error) {
      console.error(`❌ Error fetching tasks:`, error.response?.data || error);
      alert("Error fetching tasks");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // PROJECT CRUD functions
  const handleCreateProject = async () => {
    if (!newProjectTitle.trim()) {
      alert("Please enter a project title");
      return;
    }
    try {
      const res = await API.post("/projects", {
        title: newProjectTitle,
        description: newProjectDescription,
      });
      setProjects([...projects, res.data]);
      setNewProjectTitle("");
      setNewProjectDescription("");
    } catch (err) {
      console.error("❌ Error creating project:", err.response?.data || err);
      alert("Error creating project");
    }
  };

  const handleUpdateProject = async (projectId) => {
    if (!editProjectTitle.trim()) {
      alert("Please enter a project title");
      return;
    }
    try {
      const res = await API.put(`/projects/${projectId}`, {
        title: editProjectTitle,
        description: editProjectDescription,
      });
      setProjects(projects.map((p) => (p.id === projectId ? res.data : p)));
      setEditProjectId(null);
      setEditProjectTitle("");
      setEditProjectDescription("");
    } catch (err) {
      console.error("❌ Error updating project:", err.response?.data || err);
      alert("Error updating project");
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await API.delete(`/projects/${projectId}`);
      setProjects(projects.filter((p) => p.id !== projectId));
      if (selectedProject === projectId) {
        setSelectedProject(null);
        setTasks([]);
      }
    } catch (err) {
      console.error("❌ Error deleting project:", err.response?.data || err);
      alert("Error deleting project");
    }
  };

  const handleProjectClick = (projectId) => {
    setSelectedProject(projectId);
    fetchTasks(projectId);
    setIsSidebarOpen(false); // close sidebar on mobile
  };

  // TASK CRUD functions
  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) {
      alert("Please enter a task title");
      return;
    }
    try {
      console.log(`🆕 Creating task for project ${selectedProject}...`);

      const res = await API.post(`/tasks/project/${selectedProject}`, {
        title: newTaskTitle,
        description: newTaskDesc,
        status: "to_do", // backend enum
        priority: newTaskPriority.toLowerCase(),
        assignee_id: null,
      });

      console.log(`✅ Task created successfully:`, res.data);
      setTasks([...tasks, res.data]);
      setNewTaskTitle("");
      setNewTaskDesc("");
      setNewTaskPriority("medium");
      setIsAddTaskModalOpen(false);
    } catch (error) {
      console.error(`❌ Error creating task:`, error.response?.data || error);
      alert("Error creating task");
    }
  };

  const handleUpdateTask = async (taskId) => {
    if (!editTaskTitle.trim()) {
      alert("Please enter a task title");
      return;
    }
    try {
      const task = tasks.find((t) => t.id === taskId);

      const res = await API.put(`/tasks/${taskId}`, {
        title: editTaskTitle,
        description: editTaskDesc,
        status: task.status, // preserve existing status
        priority: editTaskPriority.toLowerCase(),
        assignee_id: task.assignee_id,
      });

      setTasks(tasks.map((t) => (t.id === taskId ? res.data : t)));
      closeEditTaskModal();
    } catch (error) {
      console.error(`❌ Error updating task:`, error.response?.data || error);
      alert("Error updating task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await API.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error(`❌ Error deleting task:`, error.response?.data || error);
      alert("Error deleting task");
    }
  };

  // Drag and drop handlers
  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    setActiveTask(task);
    console.log('🔄 Drag started for task:', task?.title, 'ID:', active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    console.log('🎯 Drag ended:', { activeId: active.id, overId: over?.id });
    setActiveTask(null);

    if (!over) {
      console.log('❌ No drop target');
      return;
    }

    const taskId = active.id;
    const newColumnId = over.id;

    // Backend-compatible status map
    const statusMap = {
      'todo-column': 'to_do',
      'in-progress-column': 'in_progress',
      'done-column': 'done',
    };

    const targetStatus = statusMap[newColumnId];
    console.log('🎯 Target status:', targetStatus);

    if (!targetStatus) {
      console.log('❌ Invalid drop target');
      return;
    }

    const task = tasks.find((t) => t.id === taskId);
    if (!task) {
      console.log('❌ Task not found');
      return;
    }

    if (task.status === targetStatus) {
      console.log('⚠️ Task already in target status');
      return;
    }

    console.log(`✅ Moving task "${task.title}" from ${task.status} to ${targetStatus}`);

    // Optimistically update UI
    const updatedTask = { ...task, status: targetStatus };
    setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)));

    try {
      let res;
      if (targetStatus === 'done') {
        res = await API.patch(`/tasks/${taskId}/mark-done`);
      } else if (targetStatus === 'in_progress') {
        res = await API.patch(`/tasks/${taskId}/mark-in-progress`);
      } else if (targetStatus === 'to_do') {
        res = await API.patch(`/tasks/${taskId}/mark-todo`);
      }

      if (res) {
        setTasks(prevTasks =>
          prevTasks.map((t) => (t.id === taskId ? res.data : t))
        );
        console.log('✅ Task status updated successfully');
      }
    } catch (error) {
      console.error('❌ Error updating task status:', error.response?.data || error);
      // Revert optimistic update
      setTasks(prevTasks =>
        prevTasks.map((t) => (t.id === taskId ? task : t))
      );
      alert(`Error updating task status. Changes reverted.`);
    }
  };

  // Modal helpers
  const openAddTaskModal = () => setIsAddTaskModalOpen(true);
  const closeAddTaskModal = () => {
    setIsAddTaskModalOpen(false);
    setNewTaskTitle("");
    setNewTaskDesc("");
    setNewTaskPriority("medium");
  };
  const openEditTaskModal = (task) => {
    setEditTaskId(task.id);
    setEditTaskTitle(task.title);
    setEditTaskDesc(task.description);
    setEditTaskPriority(task.priority);
    setIsEditTaskModalOpen(true);
  };
  const closeEditTaskModal = () => {
    setIsEditTaskModalOpen(false);
    setEditTaskId(null);
    setEditTaskTitle("");
    setEditTaskDesc("");
    setEditTaskPriority("medium");
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 pt-16 lg:pt-20">
        {/* Mobile Header Bar - positioned below main navbar */}
        <div className="lg:hidden fixed top-16 left-0 right-0 z-30 bg-gray-900 bg-opacity-95 backdrop-blur-xl border-b border-gray-700 px-4 py-2 flex items-center justify-between h-12">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white p-1 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-base font-bold text-white truncate mx-2">
            {selectedProject ? projects.find(p => p.id === selectedProject)?.title : 'Project Board'}
          </h1>
          {selectedProject && (
            <button
              onClick={openAddTaskModal}
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-1 rounded-lg transition-colors flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
        </div>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar - Projects */}
        <div className={`
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 transition-transform duration-300 ease-in-out
          fixed lg:relative z-50 lg:z-auto
          w-80 h-full
          bg-gray-900 bg-opacity-95 backdrop-blur-xl border-r border-gray-700 flex flex-col shadow-2xl
          pt-28 lg:pt-0
        `}>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">📂 Projects</h2>
            
            {/* Create Project Form */}
            <div className="space-y-3">
              <input
                placeholder="Project Title"
                className="w-full p-3 rounded-lg bg-gray-800 bg-opacity-80 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                value={editProjectId ? editProjectTitle : newProjectTitle}
                onChange={(e) =>
                  editProjectId
                    ? setEditProjectTitle(e.target.value)
                    : setNewProjectTitle(e.target.value)
                }
              />
              <input
                placeholder="Description"
                className="w-full p-3 rounded-lg bg-gray-800 bg-opacity-80 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                value={editProjectId ? editProjectDescription : newProjectDescription}
                onChange={(e) =>
                  editProjectId
                    ? setEditProjectDescription(e.target.value)
                    : setNewProjectDescription(e.target.value)
                }
              />
              <button
                onClick={() =>
                  editProjectId
                    ? handleUpdateProject(editProjectId)
                    : handleCreateProject()
                }
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                {editProjectId ? "✏️ Update Project" : "➕ Create Project"}
              </button>
              {editProjectId && (
                <button
                  onClick={() => {
                    setEditProjectId(null);
                    setEditProjectTitle("");
                    setEditProjectDescription("");
                  }}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Projects List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`relative group cursor-pointer transition-all transform hover:scale-102 ${
                  selectedProject === project.id
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-700 shadow-lg'
                    : 'bg-gray-800 bg-opacity-60 hover:bg-opacity-80'
                } rounded-xl p-4 border border-gray-600 backdrop-blur-sm`}
                onClick={() => handleProjectClick(project.id)}
              >
                <ProjectCard project={project} onClick={handleProjectClick} />
                
                {/* Project Action Buttons */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditProjectId(project.id);
                      setEditProjectTitle(project.title);
                      setEditProjectDescription(project.description);
                    }}
                    className="text-yellow-400 hover:text-yellow-300 p-1 rounded bg-gray-900 bg-opacity-70"
                    title="Edit Project"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id);
                    }}
                    className="text-red-400 hover:text-red-300 p-1 rounded bg-gray-900 bg-opacity-70"
                    title="Delete Project"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Task Board */}
        <div className="flex-1 flex flex-col pt-28 lg:pt-0 min-h-0">
          {/* Top Bar - Hidden on mobile */}
          <div className="hidden lg:block p-6 border-b border-gray-700 bg-gray-900 bg-opacity-50 backdrop-blur-md flex-shrink-0">
            {selectedProject ? (
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">
                  {projects.find(p => p.id === selectedProject)?.title || 'Project Tasks'}
                </h1>
                <button
                  onClick={openAddTaskModal}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 transform hover:scale-105 shadow-lg"
                >
                  ➕ Add Task
                </button>
              </div>
            ) : (
              <h1 className="text-3xl font-bold text-white text-center">
                Select a project to view tasks
              </h1>
            )}
          </div>

          {/* Task Columns */}
          {selectedProject && (
            <div className="flex-1 flex flex-col lg:flex-row gap-3 lg:gap-6 p-3 lg:p-6 overflow-auto min-h-0">
              {/* To-Do Column */}
              <DroppableColumn
                id="todo-column"
                title="📋 To-Do"
                count={tasks.filter(task => task.status === "To-do").length}
                headerClass="bg-gradient-to-r from-slate-700 to-slate-600"
              >
                {tasks.filter(task => task.status === "To-do").map((task) => (
                  <DraggableTaskCard
                    key={task.id}
                    task={task}
                    onEdit={openEditTaskModal}
                    onDelete={handleDeleteTask}
                    onMarkDone={handleMarkTaskDone}
                    onMarkInProgress={handleMarkTaskInProgress}
                  />
                ))}
              </DroppableColumn>

              {/* In-Progress Column */}
              <DroppableColumn
                id="in-progress-column"
                title="🔄 In Progress"
                count={tasks.filter(task => task.status === "In-progress").length}
                headerClass="bg-gradient-to-r from-blue-700 to-blue-600"
              >
                {tasks.filter(task => task.status === "In-progress").map((task) => (
                  <DraggableTaskCard
                    key={task.id}
                    task={task}
                    onEdit={openEditTaskModal}
                    onDelete={handleDeleteTask}
                    onMarkDone={handleMarkTaskDone}
                    onMarkInProgress={handleMarkTaskInProgress}
                  />
                ))}
              </DroppableColumn>

              {/* Done Column */}
              <DroppableColumn
                id="done-column"
                title="✅ Done"
                count={tasks.filter(task => task.status === "Done").length}
                headerClass="bg-gradient-to-r from-emerald-700 to-emerald-600"
              >
                {tasks.filter(task => task.status === "Done").map((task) => (
                  <DraggableTaskCard
                    key={task.id}
                    task={task}
                    onEdit={openEditTaskModal}
                    onDelete={handleDeleteTask}
                    onMarkDone={handleMarkTaskDone}
                    onMarkInProgress={handleMarkTaskInProgress}
                  />
                ))}
              </DroppableColumn>
            </div>
          )}

          {/* Empty State */}
          {!selectedProject && (
            <div className="flex-1 flex items-center justify-center px-4">
              <div className="text-center text-white">
                <div className="text-4xl lg:text-6xl mb-4">📋</div>
                <h2 className="text-xl lg:text-2xl font-semibold mb-2">No Project Selected</h2>
                <p className="text-sm lg:text-lg opacity-75">Choose a project from the sidebar to view its tasks</p>
              </div>
            </div>
          )}
        </div>

        {/* Add Task Modal */}
        <Modal
          isOpen={isAddTaskModalOpen}
          onClose={closeAddTaskModal}
          title="➕ Add New Task"
        >
          <div className="space-y-4">
            <input
              placeholder="Task Title"
              className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-400"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <textarea
              placeholder="Task Description"
              className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-400 h-24 resize-none"
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
            />
            <select
              className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-400"
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
            >
              <option value="Low">🔵 Low Priority</option>
              <option value="Medium">🟡 Medium Priority</option>
              <option value="High">🔴 High Priority</option>
            </select>
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleCreateTask}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-all flex-1"
              >
                Create Task
              </button>
              <button
                onClick={closeAddTaskModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>

        {/* Edit Task Modal */}
        <Modal
          isOpen={isEditTaskModalOpen}
          onClose={closeEditTaskModal}
          title="✏️ Edit Task"
        >
          <div className="space-y-4">
            <input
              placeholder="Task Title"
              className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={editTaskTitle}
              onChange={(e) => setEditTaskTitle(e.target.value)}
            />
            <textarea
              placeholder="Task Description"
              className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 h-24 resize-none"
              value={editTaskDesc}
              onChange={(e) => setEditTaskDesc(e.target.value)}
            />
            <select
              className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={editTaskPriority}
              onChange={(e) => setEditTaskPriority(e.target.value)}
            >
              <option value="Low">🔵 Low Priority</option>
              <option value="Medium">🟡 Medium Priority</option>
              <option value="High">🔴 High Priority</option>
            </select>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => handleUpdateTask(editTaskId)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-semibold transition-all flex-1"
              >
                Update Task
              </button>
              <button
                onClick={closeEditTaskModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask ? (
          <div className="bg-white rounded-lg p-4 shadow-xl border-l-4 border-blue-500 rotate-5 opacity-90">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
