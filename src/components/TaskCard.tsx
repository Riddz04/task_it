import { useState } from 'react';
import { format } from 'date-fns';
import { Clock, User, MoreHorizontal } from 'lucide-react';
import { useBoardStore } from '../store/boardStore';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  boardId: string;
  columnId: string;
  onEditTask: (task: Task, columnId: string) => void;
}

const TaskCard = ({ task, boardId, columnId, onEditTask }: TaskCardProps) => {
  const { deleteTask } = useBoardStore();
  const [showMenu, setShowMenu] = useState(false);

  const priorityColors = {
    low: 'bg-gradient-to-r from-green-400/20 to-green-500/30 text-green-300',
    medium: 'bg-gradient-to-r from-yellow-400/20 to-yellow-500/30 text-yellow-200',
    high: 'bg-gradient-to-r from-rose-400/20 to-red-500/30 text-red-300'
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
    onEditTask(task, columnId);
    setShowMenu(false);
  };

  const handleCardClick = () => {
    onEditTask(task, columnId);
  };

  return (
    <div
      className="relative bg-white/5 text-white/90 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Header with menu */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-semibold line-clamp-2 pr-4">
          {task.title}
        </h3>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu((prev) => !prev);
            }}
            className="p-1 hover:bg-white/10 text-white/60 rounded-full transition"
          >
            <MoreHorizontal size={16} />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-black/70 backdrop-blur border border-white/10 rounded-lg z-20 animate-fadeIn">
              <ul className="py-1 text-sm text-white/80">
                <li>
                  <button
                    onClick={handleEdit}
                    className="w-full text-left px-4 py-2 hover:bg-white/10"
                  >
                    Edit Task
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-2 hover:bg-white/10 text-red-400"
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
        <p className="text-xs text-white/70 mb-3 line-clamp-2">{task.description}</p>
      )}

      {/* Assigned user */}
      <div className="flex items-center text-xs text-white/60 mb-2">
        <User size={14} className="mr-1 text-white/40" />
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
          <div className="flex items-center text-xs text-white/60">
            <Clock size={14} className="mr-1 text-white/40" />
            {format(new Date(task.dueDate), 'MMM d')}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;