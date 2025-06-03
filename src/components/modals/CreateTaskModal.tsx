import { useState, useEffect, useRef } from 'react';
import { X, Trash2, Calendar, User, UserCheck, AlertCircle, Zap, CheckCircle2, Plus } from 'lucide-react';
import { useBoardStore } from '../../store/boardStore';
import { Priority, Task } from '../../types';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
  columnId: string | null;
  editingTask?: Task;
}

const CreateTaskModal = ({ isOpen, onClose, boardId, columnId, editingTask }: CreateTaskModalProps) => {
  const { addTask, updateTask, deleteTask } = useBoardStore();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);

  const isEditing = !!editingTask;
  const modalTitle = isEditing ? 'Edit Task' : 'Create New Task';
  const submitLabel = isEditing ? 'Update Task' : 'Create Task';

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      titleRef.current?.focus();
      if (editingTask) {
        setTitle(editingTask.title);
        setDescription(editingTask.description);
        setCreatedBy(editingTask.createdBy);
        setAssignedTo(editingTask.assignedTo);
        setPriority(editingTask.priority);
        setDueDate(editingTask.dueDate ? new Date(editingTask.dueDate).toISOString().split('T')[0] : '');
      } else {
        resetForm();
      }
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [editingTask, isOpen]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCreatedBy('');
    setAssignedTo('');
    setPriority('medium');
    setDueDate('');
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Task title is required';
    if (!createdBy.trim()) newErrors.createdBy = 'Creator name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !columnId) return;

    const taskData = {
      title,
      description,
      createdBy,
      assignedTo,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : ''
    };

    if (isEditing) {
      updateTask(boardId, columnId, editingTask!.id, taskData);
    } else {
      addTask(boardId, columnId, title, description, createdBy, assignedTo, priority, taskData.dueDate);
    }

    resetForm();
    onClose();
  };

  const handleDelete = () => {
    if (!editingTask || !columnId) return;
    deleteTask(boardId, columnId, editingTask.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleClose = () => {
    setIsAnimating(false);
    setShowDeleteConfirm(false);
    setTimeout(() => onClose(), 150);
  };

  const getPriorityColor = (taskPriority: Priority) => {
    switch (taskPriority) {
      case 'high': return 'from-red-500 to-pink-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'low': return 'from-green-500 to-teal-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getPriorityIcon = (taskPriority: Priority) => {
    switch (taskPriority) {
      case 'high': return <Zap size={18} />;
      case 'medium': return <AlertCircle size={18} />;
      case 'low': return <CheckCircle2 size={18} />;
      default: return <AlertCircle size={18} />;
    }
  };

  if (!isOpen || !columnId) return null;

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-gradient-to-br from-slate-900/30 via-black/20 to-gray-900/20 backdrop-blur-sm"
      onClick={handleClose}
    />

    {/* Modal */}
    <div
      className={`relative w-full max-w-lg transform transition-all duration-300 max-h-[90vh] overflow-hidden ${
        isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Gradient glow border */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${getPriorityColor(priority)} rounded-2xl blur opacity-20 animate-pulse`} />

      {/* Modal Content */}
      <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 text-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl">
              {isEditing ? getPriorityIcon(priority) : <Plus size={20} />}
            </div>
            <div>
              <h2 className="text-xl font-bold">{modalTitle}</h2>
              <p className="text-sm text-white/70">
                {isEditing ? 'Update task details' : 'Add a new task to track'}
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

        {/* Scrollable form */}
        <div className="max-h-[calc(90vh-120px)] overflow-y-auto px-6 py-6 space-y-6">
          {/* Title */}
          <div>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setErrors({ ...errors, title: '' });
              }}
              placeholder="Task title"
              className={`w-full px-4 py-3 rounded-xl bg-white/10 border backdrop-blur focus:outline-none text-white ${
                errors.title
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                  : 'border-white/10 focus:ring-2 focus:ring-cyan-500'
              }`}
            />
            {errors.title && (
              <p className="text-sm text-red-400 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description (optional)"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 backdrop-blur text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          {/* Created By */}
          <div>
            <label className="flex items-center gap-2 text-sm text-white/80 mb-1">
              <User size={16} />
              Created by
            </label>
            <input
              type="text"
              value={createdBy}
              onChange={(e) => {
                setCreatedBy(e.target.value);
                if (e.target.value.trim()) setErrors({ ...errors, createdBy: '' });
              }}
              placeholder="Your name"
              className={`w-full px-4 py-3 rounded-xl bg-white/10 border backdrop-blur focus:outline-none text-white ${
                errors.createdBy
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                  : 'border-white/10 focus:ring-2 focus:ring-cyan-500'
              }`}
            />
            {errors.createdBy && (
              <p className="text-sm text-red-400 mt-1">{errors.createdBy}</p>
            )}
          </div>

          {/* Assigned To */}
          <div>
            <label className="flex items-center gap-2 text-sm text-white/80 mb-1">
              <UserCheck size={16} />
              Assigned to
            </label>
            <input
              type="text"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="Assignee name (optional)"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 backdrop-blur text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="flex items-center gap-2 text-sm text-white/80 mb-1">
              <Calendar size={16} />
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 backdrop-blur text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="flex items-center gap-2 text-sm text-white/80 mb-1">
              <Zap size={16} />
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 backdrop-blur text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-white/10">
            {isEditing && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center text-red-400 hover:text-red-300 text-sm"
              >
                <Trash2 size={18} className="mr-1" />
                Delete
              </button>
            )}
            <button
              type="submit"
              onClick={handleSubmit}
              className="ml-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-5 py-2 rounded-xl shadow transition"
            >
              {submitLabel}
            </button>
          </div>
        </div>

        {/* Delete Confirm Dialog */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-20 rounded-2xl">
            <div className="bg-black/80 border border-white/10 rounded-2xl shadow-xl p-6 text-white w-full max-w-sm text-center space-y-4">
              <h3 className="text-lg font-semibold">Confirm Delete</h3>
              <p className="text-sm text-white/70">
                Are you sure you want to delete this task? This cannot be undone.
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

export default CreateTaskModal;
