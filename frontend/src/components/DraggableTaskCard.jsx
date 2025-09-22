import { useDraggable } from '@dnd-kit/core';
import TaskCard from './TaskCard';

export default function DraggableTaskCard({ task, onEdit, onDelete, onMarkDone, onMarkInProgress }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg p-3 lg:p-4 shadow-lg hover:shadow-xl transition-all relative group border-l-4 ${
        task.status === 'To-do' ? 'border-slate-400' :
        task.status === 'In-progress' ? 'border-blue-400' :
        'border-emerald-400'
      } ${isDragging ? 'opacity-50 rotate-5' : ''}`}
    >
      {/* Drag Handle - Larger on mobile for better touch interaction */}
      <div 
        {...listeners} 
        {...attributes}
        className="absolute top-2 left-2 cursor-grab active:cursor-grabbing opacity-40 hover:opacity-100 transition-opacity z-10 p-1 touch-manipulation"
        title="Drag to move task"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600 lg:w-4 lg:h-4">
          <path d="M9 5h2v2H9V5zm0 4h2v2H9V9zm0 4h2v2H9v-2zm4-8h2v2h-2V5zm0 4h2v2h-2V9zm0 4h2v2h-2v-2z"/>
        </svg>
      </div>

      <TaskCard task={task} />
      
      {/* Task Action Buttons - Always visible on mobile for better UX */}
      <div className="absolute top-2 right-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity flex gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
          className="text-amber-600 hover:text-amber-700 p-1 lg:p-1 rounded bg-white shadow-md z-20 text-lg lg:text-base touch-manipulation"
          title="Edit Task"
        >
          ✏️
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="text-red-600 hover:text-red-700 p-1 lg:p-1 rounded bg-white shadow-md z-20 text-lg lg:text-base touch-manipulation"
          title="Delete Task"
        >
          🗑️
        </button>
      </div>

      {/* Status Update Buttons - Responsive text and sizing */}
      <div className="mt-3 flex gap-1 lg:gap-2 flex-wrap">
        {task.status === 'To-do' && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkInProgress(task.id);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 lg:px-3 py-1 rounded-md text-xs font-semibold transition-all z-20 touch-manipulation flex-1 lg:flex-none min-w-0"
            >
              <span className="hidden sm:inline">🔄 Start Progress</span>
              <span className="sm:hidden">🔄 Start</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkDone(task.id);
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-2 lg:px-3 py-1 rounded-md text-xs font-semibold transition-all z-20 touch-manipulation flex-1 lg:flex-none min-w-0"
            >
              <span className="hidden sm:inline">✓ Mark Done</span>
              <span className="sm:hidden">✓ Done</span>
            </button>
          </>
        )}
        {task.status === 'In-progress' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkDone(task.id);
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-2 lg:px-3 py-1 rounded-md text-xs font-semibold transition-all z-20 touch-manipulation w-full lg:w-auto"
          >
            <span className="hidden sm:inline">✓ Complete</span>
            <span className="sm:hidden">✓ Done</span>
          </button>
        )}
      </div>
    </div>
  );
}
