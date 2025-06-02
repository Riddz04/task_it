import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useBoardStore } from '../../store/boardStore';

// Props interface for the modal component
interface CreateBoardModalProps {
  isOpen: boolean; // Whether the modal is open or not
  onClose: () => void; // Function to close the modal
  editingBoard: { id: string, title: string, description: string } | null; // If editing, holds board info
}

// Modal component to create or edit a board
const CreateBoardModal = ({ isOpen, onClose, editingBoard }: CreateBoardModalProps) => {
  // Extract board store actions
  const { addBoard, updateBoard } = useBoardStore();

  // State variables for form input fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(''); // Error message for validation

  // Populate form fields if editing a board, or clear fields if creating a new one
  useEffect(() => {
    if (editingBoard) {
      setTitle(editingBoard.title);
      setDescription(editingBoard.description);
    } else {
      setTitle('');
      setDescription('');
    }
  }, [editingBoard, isOpen]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation: title is required
    if (!title.trim()) {
      setError('Board title is required');
      return;
    }

    // Update or add a board based on mode
    if (editingBoard) {
      updateBoard(editingBoard.id, title, description);
    } else {
      addBoard(title, description);
    }

    // Reset state and close modal
    setTitle('');
    setDescription('');
    setError('');
    onClose();
  };

  // Don't render anything if modal is closed
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 animate-fadeIn"
        onClick={(e) => e.stopPropagation()} // Prevent click from closing the modal
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {editingBoard ? 'Edit Board' : 'Create New Board'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4">
          {/* Board Title Field */}
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
                if (e.target.value.trim()) setError(''); // Clear error on input
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter board title"
              autoFocus
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>

          {/* Description Field (optional) */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
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

          {/* Form Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
            >
              {editingBoard ? 'Update Board' : 'Create Board'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBoardModal;
