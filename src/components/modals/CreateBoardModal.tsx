import { useState, useEffect } from 'react';
import { X, Sparkles, Layers, Plus } from 'lucide-react';
import { useBoardStore } from '../../store/boardStore';

// Props interface for the modal component
interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingBoard: { id: string, title: string, description: string } | null;
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
      {/* Enhanced backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      <div 
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient border effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl opacity-20 blur"></div>
        
        <div className="relative bg-white rounded-2xl">
          {/* Enhanced Header with gradient background */}
          <div className="relative overflow-hidden rounded-t-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-white/20"></div>
            
            <div className="relative flex justify-between items-center p-6 text-white">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  {editingBoard ? <Layers size={24} /> : <Plus size={24} />}
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {editingBoard ? 'Edit Board' : 'Create New Board'}
                  </h2>
                  <p className="text-white/80 text-sm">
                    {editingBoard ? 'Update your board details' : 'Start organizing your tasks'}
                  </p>
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

          {/* Enhanced Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Board Title Field with floating label effect */}
            <div className="relative">
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (e.target.value.trim()) setError('');
                }}
                className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:bg-white transition-all duration-200 peer ${
                  error ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                }`}
                placeholder=" "
                autoFocus
              />
              <label 
                htmlFor="title" 
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                  title ? '-top-2 text-xs bg-white px-2 text-blue-600' : 'top-3 text-gray-500'
                } peer-focus:-top-2 peer-focus:text-xs peer-focus:bg-white peer-focus:px-2 peer-focus:text-blue-600`}
              >
                Board Title *
              </label>
              {error && (
                <div className="flex items-center mt-2 text-red-500 text-sm">
                  <Sparkles size={16} className="mr-1" />
                  {error}
                </div>
              )}
            </div>

            {/* Description Field with floating label */}
            <div className="relative">
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all duration-200 peer resize-none"
                rows={3}
                placeholder=" "
              />
              <label 
                htmlFor="description" 
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                  description ? '-top-2 text-xs bg-white px-2 text-blue-600' : 'top-3 text-gray-500'
                } peer-focus:-top-2 peer-focus:text-xs peer-focus:bg-white peer-focus:px-2 peer-focus:text-blue-600`}
              >
                Description (optional)
              </label>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium hover:scale-[1.02] active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
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