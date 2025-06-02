import { useState } from 'react';
import { format } from 'date-fns';
import { AlertCircle, Clock, User, MoreHorizontal } from 'lucide-react';
import { useBoardStore } from '../store/boardStore';
import { Task } from '../types';
import CreateTaskModal from './modals/CreateTaskModal';

interface TaskCardProps {
  task: Task;
  boardId: string;
  columnId: string;
}

const TaskCard = ({ task, boardId, columnId }: TaskCardProps) => {
  const { deleteTask } = useBoardStore();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const priorityColors = {
    low: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800',
    medium: 'bg-gradient-to-r from-amber-100 to-yellow-200 text-yellow-800',
    high: 'bg-gradient-to-r from-red-100 to-rose-200 text-red-800'
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(boardId, columnId, task.id);
    }
    setShowMenu(false);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
    setShowMenu(false);
  };

  return (
    <>
      <div
        className="relative bg-white/70 backdrop-blur-md border border-gray-200 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
        onClick={() => setIsEditModalOpen(true)}
      >
        {/* Header with menu */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 pr-4">
            {task.title}
          </h3>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu((prev) => !prev);
              }}
              className="p-1 hover:bg-gray-100 text-gray-500 rounded-full transition"
            >
              <MoreHorizontal size={16} />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-xl rounded-lg z-20 border animate-fadeIn">
                <ul className="py-1 text-sm text-gray-700">
                  <li>
                    <button
                      onClick={handleEdit}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Edit Task
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleDelete}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      Delete Task
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
        )}

        {/* Assigned user */}
        <div className="flex items-center text-xs text-gray-600 mb-2">
          <User size={14} className="mr-1 text-gray-400" />
          <span>{task.assignedTo || 'Unassigned'}</span>
        </div>

        {/* Priority and due date */}
        <div className="flex justify-between items-center">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${priorityColors[task.priority]}`}
          >
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>

          {task.dueDate && (
            <div className="flex items-center text-xs text-gray-600">
              <Clock size={14} className="mr-1 text-gray-400" />
              {format(new Date(task.dueDate), 'MMM d')}
            </div>
          )}
        </div>
      </div>

      <CreateTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        boardId={boardId}
        columnId={columnId}
        editingTask={task}
      />
    </>
  );
};

export default TaskCard;
