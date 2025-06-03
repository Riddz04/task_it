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
    <div className="relative p-6 z-10">
      {/* Background glow elements */}
      <div className="absolute -top-10 -left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse z-0" />
      <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse z-0" />

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          Your Boards
        </h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          <PlusCircle size={20} />
          <span>Create Board</span>
        </button>
      </div>

      {/* Empty State */}
      {boards.length === 0 ? (
        <div className="relative bg-white/5 text-white/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-10 text-center z-10">
          <h2 className="text-2xl font-semibold mb-4">No boards yet</h2>
          <p className="text-gray-400 mb-6">Create your first board to get started with <span className="font-semibold text-cyan-400">TaskIt</span>.</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-xl transition-all"
          >
            Create a Board
          </button>
        </div>
      ) : (
        // Table View
        <div className="relative overflow-x-auto z-10">
          <table className="min-w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg overflow-hidden">
            <thead>
              <tr className="text-left text-sm text-gray-300 uppercase tracking-wide">
                <th className="py-4 px-6 bg-white/5">Board Name</th>
                <th className="py-4 px-6 bg-white/5">Description</th>
                <th className="py-4 px-6 bg-white/5">Created</th>
                <th className="py-4 px-6 bg-white/5">Tasks</th>
                <th className="py-4 px-6 bg-white/5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {boards.map((board) => {
                const totalTasks = board.columns.reduce(
                  (sum, column) => sum + column.tasks.length,
                  0
                );

                return (
                  <tr
                    key={board.id}
                    className="hover:bg-white/10 transition-colors"
                  >
                    <td className="py-4 px-6 font-semibold text-cyan-400 hover:underline">
                      <Link to={`/boards/${board.id}`}>
                        {board.title}
                      </Link>
                    </td>
                    <td className="py-4 px-6 text-gray-400">
                      {board.description || <span className="italic text-gray-500">No description</span>}
                    </td>
                    <td className="py-4 px-6 text-gray-400">
                      <div className="flex items-center">
                        <Clock size={16} className="mr-2 text-gray-500" />
                        <span>{formatDistanceToNow(new Date(board.createdAt), { addSuffix: true })}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-400">
                      <div className="flex items-center">
                        <CalendarClock size={16} className="mr-2 text-gray-500" />
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
                          className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-full transition"
                          title="Edit board"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteBoard(board.id, e)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full transition"
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
