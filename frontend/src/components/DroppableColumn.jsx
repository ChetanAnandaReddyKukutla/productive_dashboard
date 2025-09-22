import { useDroppable } from '@dnd-kit/core';

export default function DroppableColumn({ id, title, count, headerClass, children }) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div className="flex-1 min-w-0 bg-gray-800 bg-opacity-60 backdrop-blur-md rounded-xl border border-gray-600 flex flex-col shadow-xl mb-3 lg:mb-0 max-h-full">
      <div className={`p-3 lg:p-4 border-b border-gray-600 ${headerClass} rounded-t-xl flex-shrink-0`}>
        <h3 className="text-base lg:text-xl font-semibold text-white flex items-center gap-2">
          {title}
          <span className="bg-white bg-opacity-20 text-white text-xs px-2 py-1 rounded-full font-bold">
            {count}
          </span>
        </h3>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto p-3 lg:p-4 space-y-2 lg:space-y-3 transition-all duration-200 min-h-32 ${
          isOver 
            ? 'bg-blue-100 bg-opacity-20 border-2 border-blue-400 border-dashed scale-[1.02]' 
            : 'border-2 border-transparent'
        }`}
      >
        {children}
        {/* Drop zone indicator */}
        {isOver && (
          <div className="flex items-center justify-center h-12 lg:h-16 border-2 border-blue-400 border-dashed rounded-lg bg-blue-50 bg-opacity-30">
            <span className="text-blue-200 font-semibold text-sm lg:text-base">Drop task here</span>
          </div>
        )}
      </div>
    </div>
  );
}
