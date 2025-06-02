import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useBoardStore } from '../../store/boardStore';
import { ColumnType } from '../../types';

// Props for the modal
interface CreateColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
  editingColumn: { id: string, title: string, type: ColumnType } | null;
}

const CreateColumnModal = ({ isOpen, onClose, boardId, editingColumn }: CreateColumnModalProps) => {
  // Access store methods for adding, updating, and deleting columns
  const { addColumn, updateColumn, deleteColumn } = useBoardStore();

  // Local state for form fields and error handling
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ColumnType>('todo');
  const [error, setError] = useState('');

  // Populate the form when editing an existing column
  useEffect(() => {
    if (editingColumn) {
      setTitle(editingColumn.title);
      setType(editingColumn.type);
    } else {
      setTitle('');
      setType('todo');
    }
  }, [editingColumn, isOpen]);

  // Handle column creation or update
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Title must not be empty
    if (!title.trim()) {
      setError('Column title is required');
      return;
    }

    if (editingColumn) {
      updateColumn(boardId, editingColumn.id, title, type); // Update existing
    } else {
      addColumn(boardId, title, type); // Create new
    }

    // Clear state and close modal
    setTitle('');
    setType('todo');
    setError('');
    onClose();
  };

  // Handle column deletion
  const handleDelete = () => {
    if (!editingColumn) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this column? All tasks in this column will be lost.'
    );

    if (confirmed) {
      deleteColumn(boardId, editingColumn.id);
      onClose();
    }
  };

  // Don't render modal if it's not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 animate-fadeIn"
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing on inner clicks
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {editingColumn ? 'Edit Column' : 'Add New Column'}
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
          {/* Column Title Field */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Column Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter column title"
              autoFocus
            />
            {/* Show validation error */}
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>

          {/* Column Type Dropdown */}
          <div className="mb-6">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Column Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as ColumnType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* Footer: Delete button (if editing), Cancel and Submit */}
          <div className="flex justify-between">
            {/* Only show delete button in edit mode */}
            {editingColumn && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center px-4 py-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-200"
              >
                <Trash2 size={16} className="mr-2" />
                Delete Column
              </button>
            )}
            
            <div className="flex ml-auto space-x-3">
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
                {editingColumn ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateColumnModal;
