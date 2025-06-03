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
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${getTypeColor(type)} rounded-2xl blur opacity-20 animate-pulse`} />

      {/* Modal Content */}
      <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 text-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl">
              {editingColumn ? <Columns size={20} /> : <Plus size={20} />}
            </div>
            <div>
              <h2 className="text-xl font-bold">{editingColumn ? 'Edit Column' : 'Add New Column'}</h2>
              <p className="text-sm text-white/70">
                {editingColumn ? 'Modify column settings' : 'Organize your workflow'}
              </p>
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
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          {/* Column Title */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
              placeholder="Column title"
              className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white backdrop-blur focus:outline-none ${
                error
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                  : 'border-white/10 focus:ring-2 focus:ring-cyan-500'
              }`}
              autoFocus
            />
            {error && (
              <div className="flex items-center mt-2 text-sm text-red-400">
                <AlertTriangle size={16} className="mr-1" />
                {error}
              </div>
            )}
          </div>

          {/* Column Type Selection */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Column Type
            </label>
            <div className="grid grid-cols-1 gap-3">
              {(['todo', 'in-progress', 'done'] as ColumnType[]).map((columnType) => (
                <label
                  key={columnType}
                  className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    type === columnType
                      ? 'border-cyan-500 bg-white/10'
                      : 'border-white/10 hover:border-white/20'
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
                      <div className="font-medium capitalize">
                        {columnType.replace('-', ' ')}
                      </div>
                      <div className="text-sm text-white/60">
                        {columnType === 'todo' && 'Tasks to be started'}
                        {columnType === 'in-progress' && 'Work in progress'}
                        {columnType === 'done' && 'Completed tasks'}
                      </div>
                    </div>
                  </div>
                  {type === columnType && (
                    <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center">
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
                className="flex items-center justify-center px-6 py-3 text-red-400 bg-white/10 rounded-xl hover:bg-red-500/10 transition-all duration-200 font-medium"
              >
                <Trash2 size={18} className="mr-2" />
                Delete Column
              </button>
            )}

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
                className={`flex-1 px-6 py-3 bg-gradient-to-r ${getTypeColor(type)} text-white rounded-xl shadow-md hover:shadow-xl transition-all font-medium`}
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
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
        <div className="relative bg-black/80 border border-white/10 text-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-600/20 rounded-2xl flex items-center justify-center">
            <AlertTriangle size={32} className="text-red-400" />
          </div>
          <h3 className="text-lg font-bold mb-2">Delete Column?</h3>
          <p className="text-sm text-white/70 mb-6">
            All tasks in this column will be permanently lost. This action cannot be undone.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 px-4 py-2 text-white/80 bg-white/10 rounded-xl hover:bg-white/20"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

};

export default CreateColumnModal;