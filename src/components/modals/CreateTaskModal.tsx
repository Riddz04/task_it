import { useState, useEffect, useRef } from 'react';
import { X, Trash2 } from 'lucide-react';
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

  // Ref for focusing on the title input when modal opens
  const titleRef = useRef<HTMLInputElement>(null);

  const isEditing = !!editingTask;
  const modalTitle = isEditing ? 'Edit Task' : 'Create New Task';
  const submitLabel = isEditing ? 'Update Task' : 'Create Task';

  // Set focus and fill data when editing or modal is opened
  useEffect(() => {
    if (isOpen) {
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
    }
  }, [editingTask, isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Reset form fields
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCreatedBy('');
    setAssignedTo('');
    setPriority('medium');
    setDueDate('');
    setErrors({});
  };

  // Validate required fields
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Task title is required';
    if (!createdBy.trim()) newErrors.createdBy = 'Creator name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission (create or update)
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

  // Handle task deletion
  const handleDelete = () => {
    if (!editingTask || !columnId) return;
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(boardId, columnId, editingTask.id);
      onClose();
    }
  };

  // Do not render if modal is closed or columnId is missing
  if (!isOpen || !columnId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-800">
            {modalTitle}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4">
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Task Title*
            </label>
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
              className={`w-full px-3 py-2 border ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="Enter task title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
              placeholder="Enter task description"
            />
          </div>

          {/* Created By */}
          <div className="mb-4">
            <label htmlFor="createdBy" className="block text-sm font-medium text-gray-700 mb-1">
              Created By*
            </label>
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
              className={`w-full px-3 py-2 border ${
                errors.createdBy ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="Enter your name"
            />
            {errors.createdBy && <p className="mt-1 text-sm text-red-600">{errors.createdBy}</p>}
          </div>

          {/* Assigned To */}
          <div className="mb-4">
            <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
              Assigned To
            </label>
            <input
              type="text"
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter assignee name"
            />
          </div>

          {/* Priority */}
          <div className="mb-4">
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Due Date */}
          <div className="mb-6">
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              min={new Date().toISOString().split('T')[0]} // prevent past dates
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center px-4 py-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-200"
              >
                <Trash2 size={16} className="mr-2" />
                Delete Task
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
                {submitLabel}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
