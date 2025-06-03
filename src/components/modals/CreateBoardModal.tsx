import { useState, useEffect } from 'react';
import { X, Sparkles, Layers, Plus } from 'lucide-react';
import { useBoardStore } from '../../store/boardStore';

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingBoard: { id: string; title: string; description: string } | null;
}

const CreateBoardModal = ({ isOpen, onClose, editingBoard }: CreateBoardModalProps) => {
  const { addBoard, updateBoard } = useBoardStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (editingBoard) {
      setTitle(editingBoard.title);
      setDescription(editingBoard.description);
    } else {
      setTitle('');
      setDescription('');
    }
    setError('');
  }, [editingBoard, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Board title is required');
      return;
    }

    if (editingBoard) {
      updateBoard(editingBoard.id, title, description);
    } else {
      addBoard(title, description);
    }

    setTitle('');
    setDescription('');
    setError('');
    onClose();
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
        className="absolute inset-0 bg-gradient-to-br from-slate-900/30 via-black/20 to-gray-900/20 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div
        className={`relative w-full max-w-md transform transition-all duration-300 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glowing Gradient Border */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl blur opacity-20 animate-pulse" />

        {/* Modal Content */}
        <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 text-white rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-5 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-xl">
                {editingBoard ? <Layers size={20} /> : <Plus size={20} />}
              </div>
              <div>
                <h2 className="text-xl font-bold">{editingBoard ? 'Edit Board' : 'Create New Board'}</h2>
                <p className="text-sm text-white/70">
                  {editingBoard ? 'Update your board details' : 'Start organizing your tasks'}
                </p>
              </div>
            </div>
            <button onClick={handleClose} className="p-2 rounded-xl hover:bg-white/10 transition">
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
            {/* Board Title */}
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (e.target.value.trim()) setError('');
                }}
                placeholder="Board title *"
                className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white backdrop-blur focus:outline-none ${
                  error ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-white/10 focus:ring-2 focus:ring-cyan-500'
                }`}
                autoFocus
              />
              {error && (
                <div className="flex items-center mt-2 text-sm text-red-400">
                  <Sparkles size={16} className="mr-1" />
                  {error}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white backdrop-blur focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 text-white/80 bg-white/10 rounded-xl hover:bg-white/20 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-md hover:shadow-xl transition-all font-medium"
              >
                <span className="flex items-center justify-center space-x-2">
                  {editingBoard ? <Layers size={18} /> : <Plus size={18} />}
                  <span>{editingBoard ? 'Update Board' : 'Create Board'}</span>
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBoardModal;
