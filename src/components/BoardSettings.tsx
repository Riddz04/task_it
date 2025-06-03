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
        className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-black/30 to-gray-900/30 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal container */}
      <div
        className={`relative w-full max-w-lg transform transition-all duration-300 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glowing border */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl blur opacity-20 animate-pulse z-0" />

        {/* Modal content */}
        <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 text-white rounded-2xl shadow-2xl z-10">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-5 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <Layers size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Board Settings</h2>
                <p className="text-sm text-white/60">Update or delete your board</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-xl hover:bg-white/10 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="px-6 py-6 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm text-white/80 mb-1">Board Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (e.target.value.trim()) setError('');
                }}
                placeholder="Enter board title"
                className={`w-full px-4 py-3 rounded-xl bg-white/10 border backdrop-blur focus:outline-none text-white ${
                  error
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                    : 'border-white/10 focus:ring-2 focus:ring-cyan-500'
                }`}
              />
              {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm text-white/80 mb-1">Board Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe the board's purpose"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 backdrop-blur text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center text-red-400 hover:text-red-300 text-sm"
              >
                <Trash2 size={18} className="mr-1" />
                Delete
              </button>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl shadow transition"
                >
                  <Save size={18} className="mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          </form>

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-20 rounded-2xl">
              <div className="bg-black/80 border border-white/10 rounded-2xl shadow-xl p-6 text-white w-full max-w-sm text-center space-y-4">
                <h3 className="text-lg font-semibold">Confirm Deletion</h3>
                <p className="text-sm text-white/70">
                  Are you sure you want to delete this board? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-sm text-white/80 hover:text-white"
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
