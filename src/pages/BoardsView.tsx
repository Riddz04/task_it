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
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-700">Your Boards</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition-all duration-200"
        >
          <PlusCircle size={20} />
          <span>Create Board</span>
        </button>
      </div>

      {/* Empty State */}
      {boards.length === 0 ? (
        <div className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-xl shadow-md p-10 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">No boards yet</h2>
          <p className="text-gray-600 mb-6">Create your first board to get started with <span className="font-semibold text-indigo-600">TaskIt</span>.</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Create a Board
          </button>
        </div>
      ) : (
        // Table View
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white/60 backdrop-blur-md rounded-xl shadow-md border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700 font-semibold">
                <th className="py-3 px-6 rounded-tl-xl">Board Name</th>
                <th className="py-3 px-6">Description</th>
                <th className="py-3 px-6">Created</th>
                <th className="py-3 px-6">Tasks</th>
                <th className="py-3 px-6 rounded-tr-xl">Actions</th>
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
                    className="hover:bg-indigo-50/20 transition-colors duration-150"
                  >
                    <td className="py-4 px-6">
                      <Link
                        to={`/boards/${board.id}`}
                        className="font-semibold text-indigo-600 hover:text-indigo-800 transition"
                      >
                        {board.title}
                      </Link>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {board.description || <span className="italic text-gray-400">No description</span>}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      <div className="flex items-center">
                        <Clock size={16} className="mr-2 text-gray-400" />
                        <span>{formatDistanceToNow(new Date(board.createdAt), { addSuffix: true })}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
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
                          className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition"
                          title="Edit board"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteBoard(board.id, e)}
                          className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition"
                          title="Delete board"
                        >
                          <Trash2 size={16} />
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

      {/* Modal */}
      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={closeModal}
        editingBoard={editingBoard}
      />
    </div>
  );
};

export default BoardsView;
