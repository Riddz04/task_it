import { X, Trash2, Save, Layers } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoardStore } from '../store/boardStore';
import { Board } from '../types';

interface BoardSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  board: Board;
}

const BoardSettings = ({ isOpen, onClose, board }: BoardSettingsProps) => {
  const navigate = useNavigate();
  const { updateBoard, deleteBoard } = useBoardStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen && board) {
      setIsAnimating(true);
      setTitle(board.title);
      setDescription(board.description);
      setError('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, board]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Board title is required');
      return;
    }
    updateBoard(board.id, title.trim(), description.trim());
    onClose();
  };

  const handleDelete = () => {
    deleteBoard(board.id);
    navigate('/', { replace: true });
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => onClose(), 150);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-purple-900/20 to-indigo-900/20 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient border animation */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-20 blur animate-pulse" />

        <div className="relative bg-white rounded-2xl">
          {/* Header */}
          <div className="relative overflow-hidden rounded-t-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-white/20" />

            <div className="relative flex justify-between items-center p-6 text-white">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Layers size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Board Settings</h2>
                  <p className="text-white/80 text-sm">Update or delete your board</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-xl hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Board Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (e.target.value.trim()) setError('');
                }}
                placeholder="Enter board title"
                className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 ${
                  error ? 'border-red-500 focus:ring-red-300' : 'border-gray-200 focus:ring-indigo-300'
                }`}
              />
              {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Board Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="Describe the purpose or scope of this board"
              />
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-4 border-t">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center text-red-600 hover:text-red-800 text-sm"
              >
                <Trash2 size={18} className="mr-1" />
                Delete
              </button>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                >
                  <Save size={18} className="mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          </form>

          {/* Delete Confirm Dialog */}
          {showDeleteConfirm && (
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm text-center space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Confirm Deletion</h3>
                <p className="text-gray-600 text-sm">
                  Are you sure you want to delete this board? All columns and tasks will be lost.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardSettings;
