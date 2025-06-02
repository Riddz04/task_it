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
    low: 'bg-green-100 text-green-800',
    medium: 'bg-amber-100 text-amber-800',
    high: 'bg-red-100 text-red-800'
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
      <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-800 line-clamp-2">{task.title}</h3>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
            >
              <MoreHorizontal size={16} />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-40 bg-white shadow-lg rounded-md z-10">
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

        {task.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
        )}

        <div className="flex items-center mb-2">
          <User size={14} className="mr-1 text-gray-400" />
          <span className="text-xs text-gray-600">
            {task.assignedTo || 'Unassigned'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>

          {task.dueDate && (
            <div className="flex items-center">
              <Clock size={14} className="mr-1 text-gray-400" />
              <span className="text-xs text-gray-600">
                {format(new Date(task.dueDate), 'MMM d')}
              </span>
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