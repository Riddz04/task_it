import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Trash2, Edit, Clock, CalendarClock } from 'lucide-react';
import { useBoardStore } from '../store/boardStore';
import { formatDistanceToNow } from 'date-fns';
import CreateBoardModal from '../components/modals/CreateBoardModal';

const BoardsView = () => {
  const { boards, deleteBoard } = useBoardStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<{ id: string, title: string, description: string } | null>(null);

  const handleDeleteBoard = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this board?')) {
      deleteBoard(id);
    }
  };

  const handleEditBoard = (board: { id: string, title: string, description: string }, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingBoard(board);
    setIsCreateModalOpen(true);
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    setEditingBoard(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Boards</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          <PlusCircle size={20} />
          <span>Create Board</span>
        </button>
      </div>

      {boards.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">No boards yet</h2>
          <p className="text-gray-600 mb-6">Create your first board to get started with TaskIt!</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Create a Board
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-600 font-medium">
                <th className="py-3 px-6 rounded-tl-lg">Board Name</th>
                <th className="py-3 px-6">Description</th>
                <th className="py-3 px-6">Created</th>
                <th className="py-3 px-6">Tasks</th>
                <th className="py-3 px-6 rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {boards.map((board) => {
                const totalTasks = board.columns.reduce(
                  (sum, column) => sum + column.tasks.length,
                  0
                );
                
                return (
                  <tr 
                    key={board.id} 
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="py-4 px-6">
                      <Link 
                        to={`/boards/${board.id}`}
                        className="font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                        {board.title}
                      </Link>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {board.description || "No description"}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      <div className="flex items-center">
                        <Clock size={16} className="mr-2 text-gray-400" />
                        <span>{formatDistanceToNow(new Date(board.createdAt), { addSuffix: true })}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <CalendarClock size={16} className="mr-2 text-gray-400" />
                        <span>{totalTasks} task{totalTasks !== 1 ? 's' : ''}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button 
                          onClick={(e) => handleEditBoard({ 
                            id: board.id, 
                            title: board.title, 
                            description: board.description 
                          }, e)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit board"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={(e) => handleDeleteBoard(board.id, e)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Delete board"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <CreateBoardModal 
        isOpen={isCreateModalOpen} 
        onClose={closeModal}
        editingBoard={editingBoard}
      />
    </div>
  );
};

export default BoardsView;