import { useState, useEffect } from 'react';
import { X, Trash2, Columns, Plus, AlertTriangle } from 'lucide-react';
import { useBoardStore } from '../../store/boardStore';
import { ColumnType } from '../../types';

interface CreateColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
  editingColumn: { id: string, title: string, type: ColumnType } | null;
}

const CreateColumnModal = ({ isOpen, onClose, boardId, editingColumn }: CreateColumnModalProps) => {
  const { addColumn, updateColumn, deleteColumn } = useBoardStore();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<ColumnType>('todo');
  const [error, setError] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (editingColumn) {
      setTitle(editingColumn.title);
      setType(editingColumn.type);
    } else {
      setTitle('');
      setType('todo');
    }
    setError('');
  }, [editingColumn, isOpen]);

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
      setError('Column title is required');
      return;
    }

    if (editingColumn) {
      updateColumn(boardId, editingColumn.id, title, type);
    } else {
      addColumn(boardId, title, type);
    }

    setTitle('');
    setType('todo');
    setError('');
    onClose();
  };

  const handleDelete = () => {
    if (!editingColumn) return;
    deleteColumn(boardId, editingColumn.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleClose = () => {
    setIsAnimating(false);
    setShowDeleteConfirm(false);
    setTimeout(() => onClose(), 150);
  };

  const getTypeColor = (columnType: ColumnType) => {
    switch (columnType) {
      case 'todo': return 'from-orange-500 to-red-500';
      case 'in-progress': return 'from-blue-500 to-purple-500';
      case 'done': return 'from-green-500 to-teal-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTypeIcon = (columnType: ColumnType) => {
    switch (columnType) {
      case 'todo': return '📋';
      case 'in-progress': return '⚡';
      case 'done': return '✅';
      default: return '📋';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Enhanced backdrop */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      <div 
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated border */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl opacity-20 blur animate-pulse"></div>
        
        <div className="relative bg-white rounded-2xl">
          {/* Enhanced Header */}
          <div className="relative overflow-hidden rounded-t-2xl">
            <div className={`absolute inset-0 bg-gradient-to-r ${getTypeColor(type)}`}></div>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-white/20"></div>
            
            <div className="relative flex justify-between items-center p-6 text-white">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  {editingColumn ? <Columns size={24} /> : <Plus size={24} />}
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {editingColumn ? 'Edit Column' : 'Add New Column'}
                  </h2>
                  <p className="text-white/80 text-sm">
                    {editingColumn ? 'Modify column settings' : 'Organize your workflow'}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Column Title */}
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
                  error ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                }`}
                placeholder=" "
                autoFocus
              />
              <label 
                htmlFor="title" 
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                  title ? '-top-2 text-xs bg-white px-2 text-purple-600' : 'top-3 text-gray-500'
                } peer-focus:-top-2 peer-focus:text-xs peer-focus:bg-white peer-focus:px-2 peer-focus:text-purple-600`}
              >
                Column Title *
              </label>
              {error && (
                <div className="flex items-center mt-2 text-red-500 text-sm">
                  <AlertTriangle size={16} className="mr-1" />
                  {error}
                </div>
              )}
            </div>

            {/* Enhanced Column Type Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Column Type
              </label>
              <div className="grid grid-cols-1 gap-3">
                {(['todo', 'in-progress', 'done'] as ColumnType[]).map((columnType) => (
                  <label
                    key={columnType}
                    className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      type === columnType
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={columnType}
                      checked={type === columnType}
                      onChange={(e) => setType(e.target.value as ColumnType)}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3 flex-1">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getTypeColor(columnType)} flex items-center justify-center text-lg`}>
                        {getTypeIcon(columnType)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 capitalize">
                          {columnType.replace('-', ' ')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {columnType === 'todo' && 'Tasks to be started'}
                          {columnType === 'in-progress' && 'Work in progress'}
                          {columnType === 'done' && 'Completed tasks'}
                        </div>
                      </div>
                    </div>
                    {type === columnType && (
                      <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3 pt-4">
              {editingColumn && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center justify-center px-6 py-3 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-200 font-medium hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Trash2 size={18} className="mr-2" />
                  Delete Column
                </button>
              )}
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium hover:scale-[1.02] active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 px-6 py-3 bg-gradient-to-r ${getTypeColor(type)} text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium hover:scale-[1.02] active:scale-[0.98] shadow-md`}
                >
                  <span className="flex items-center justify-center space-x-2">
                    {editingColumn ? <Columns size={18} /> : <Plus size={18} />}
                    <span>{editingColumn ? 'Update' : 'Create'}</span>
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
                <AlertTriangle size={32} className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Column?</h3>
              <p className="text-gray-600 mb-6">
                All tasks in this column will be permanently lost. This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateColumnModal;