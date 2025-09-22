export default function TaskCard({ task }) {
  const statusColor = {
    "To-do": "bg-slate-100 text-slate-700",
    "In-progress": "bg-blue-100 text-blue-700",
    "Done": "bg-green-100 text-green-700",
  };

  const priorityColor = {
    Low: "text-blue-600 bg-blue-50",
    Medium: "text-yellow-600 bg-yellow-50",
    High: "text-red-600 bg-red-50",
  };

  return (
    <div className="space-y-2 lg:space-y-3">
      <div>
        <h4 className="font-bold text-base lg:text-lg text-gray-800 mb-1 line-clamp-2">{task.title}</h4>
        <p className="text-gray-600 text-xs lg:text-sm leading-relaxed line-clamp-3 lg:line-clamp-none">{task.description}</p>
      </div>
      <div className="flex flex-wrap gap-1 lg:gap-2">
        <span className={`px-2 py-1 rounded-md text-xs font-semibold ${statusColor[task.status]}`}>
          {task.status}
        </span>
        <span className={`px-2 py-1 rounded-md text-xs font-semibold ${priorityColor[task.priority]}`}>
          <span className="hidden sm:inline">{task.priority} Priority</span>
          <span className="sm:hidden">{task.priority}</span>
        </span>
        {task.assignee_id && (
          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md truncate max-w-24 lg:max-w-none">
            <span className="hidden lg:inline">Assigned: User {task.assignee_id}</span>
            <span className="lg:hidden">User {task.assignee_id}</span>
          </span>
        )}
      </div>
    </div>
  );
}
