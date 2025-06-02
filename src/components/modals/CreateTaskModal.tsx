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
      {/* Enhanced backdrop */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-purple-900/20 to-indigo-900/20 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      <div 
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 max-h-[90vh] overflow-hidden ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated gradient border */}
        <div className={`absolute -inset-0.5 bg-gradient-to-r ${getPriorityColor(priority)} rounded-2xl opacity-20 blur animate-pulse`}></div>
        
        <div className="relative bg-white rounded-2xl">
          {/* Enhanced Header */}
          <div className="relative overflow-hidden rounded-t-2xl">
            <div className={`absolute inset-0 bg-gradient-to-r ${getPriorityColor(priority)}`}></div>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-white/20"></div>
            
            <div className="relative flex justify-between items-center p-6 text-white">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  {isEditing ? getPriorityIcon(priority) : <Plus size={24} />}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{modalTitle}</h2>
                  <p className="text-white/80 text-sm">
                    {isEditing ? 'Update task details' : 'Add a new task to track'}
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

          {/* Scrollable Form Content */}
          <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div className="relative">
                <input
                  ref={titleRef}
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (e.target.value.trim()) {
                      setErrors({ ...errors, title: '' });
                    }
                  }}
                    className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 ${
                    errors.title ? 'border-red-500 focus:ring-red-300' : 'border-gray-200 focus:ring-indigo-300'
                  }`}
                  placeholder="Task title"
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="Task description (optional)"
              />

              {/* Created By */}
              <div className="relative">
                <div className="flex items-center space-x-2 mb-1 text-sm font-medium text-gray-700">
                  <User size={16} />
                  <label htmlFor="createdBy">Created by</label>
                </div>
                <input
                  type="text"
                  id="createdBy"
                  value={createdBy}
                  onChange={(e) => {
                    setCreatedBy(e.target.value);
                    if (e.target.value.trim()) {
                      setErrors({ ...errors, createdBy: '' });
                    }
                  }}
                  className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 ${
                    errors.createdBy ? 'border-red-500 focus:ring-red-300' : 'border-gray-200 focus:ring-indigo-300'
                  }`}
                  placeholder="Your name"
                />
                {errors.createdBy && (
                  <p className="text-sm text-red-500 mt-1">{errors.createdBy}</p>
                )}
              </div>

              {/* Assigned To */}
              <div>
                <div className="flex items-center space-x-2 mb-1 text-sm font-medium text-gray-700">
                  <UserCheck size={16} />
                  <label htmlFor="assignedTo">Assigned to</label>
                </div>
                <input
                  type="text"
                  id="assignedTo"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder="Assignee name (optional)"
                />
              </div>

              {/* Due Date */}
              <div>
                <div className="flex items-center space-x-2 mb-1 text-sm font-medium text-gray-700">
                  <Calendar size={16} />
                  <label htmlFor="dueDate">Due Date</label>
                </div>
                <input
                  type="date"
                  id="dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              {/* Priority Selector */}
              <div>
                <div className="flex items-center space-x-2 mb-1 text-sm font-medium text-gray-700">
                  <Zap size={16} />
                  <label htmlFor="priority">Priority</label>
                </div>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-between items-center pt-4 border-t">
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center text-red-600 hover:text-red-800 text-sm"
                  >
                    <Trash2 size={18} className="mr-1" />
                    Delete
                  </button>
                )}
                <button
                  type="submit"
                  className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl transition-all duration-200"
                >
                  {submitLabel}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Confirm Delete Modal */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm text-center space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Confirm Delete</h3>
              <p className="text-gray-600 text-sm">
                Are you sure you want to delete this task? This action cannot be undone.
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
  );
};

export default CreateTaskModal;
