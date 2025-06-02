import { X, Trash2, Save } from 'lucide-react'; // Icons
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirection
import { useBoardStore } from '../store/boardStore'; // Zustand store
import { Board } from '../types'; // Board type definition

interface BoardSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  board: Board;
}

const BoardSettings = ({ isOpen, onClose, board }: BoardSettingsProps) => {
  const navigate = useNavigate();
  const { updateBoard, deleteBoard } = useBoardStore(); // Extract store actions

  const [title, setTitle] = useState(''); // State for board title
  const [description, setDescription] = useState(''); // State for board description
  const [error, setError] = useState(''); // State for validation error

  // Initialize state when modal opens
  useEffect(() => {
    if (isOpen && board) {
      setTitle(board.title);
      setDescription(board.description);
      setError('');
    }
  }, [isOpen, board]);

  // Save changes to the board
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: title must not be empty
    if (!title.trim()) {
      setError('Board title is required');
      return;
    }

    updateBoard(board.id, title.trim(), description.trim());
    onClose(); // Close modal after update
  };

  // Delete board with confirmation
  const handleDelete = () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this board? All columns and tasks will be lost.'
    );
    if (confirmDelete) {
      deleteBoard(board.id);
      navigate('/', { replace: true }); // Redirect to home after deletion
    }
  };

  // Don't render the modal if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal container */}
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 animate-fadeIn"
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing on inner click
      >
        {/* Modal header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Board Settings</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Modal body */}
        <form onSubmit={handleSave} className="p-4">
          {/* Board title input */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Board Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
              className={`w-full px-3 py-2 border ${
                error ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="Enter board title"
              autoFocus
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>

          {/* Board description input */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
              placeholder="Enter board description"
            />
          </div>

          {/* Footer buttons: Delete, Cancel, Save */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center px-4 py-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-200"
            >
              <Trash2 size={16} className="mr-2" />
              Delete Board
            </button>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
              >
                <Save size={16} className="mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoardSettings;
