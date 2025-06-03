import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PlusCircle, Settings, ArrowLeft } from 'lucide-react';
import { useBoardStore } from '../store/boardStore';
import TaskCard from '../components/TaskCard';
import CreateColumnModal from '../components/modals/CreateColumnModal';
import CreateTaskModal from '../components/modals/CreateTaskModal';
import BoardSettings from '../components/BoardSettings';
import { Column, ColumnType, Task } from '../types';

// Sortable Task Card Component
const SortableTaskCard = ({ 
  task, 
  boardId, 
  columnId, 
  onEditTask 
}: { 
  task: Task; 
  boardId: string; 
  columnId: string;
  onEditTask: (task: Task, columnId: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.75 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="mb-2"
    >
      <TaskCard 
        task={task} 
        boardId={boardId} 
        columnId={columnId} 
        onEditTask={onEditTask}
      />
    </div>
  );
};

const BoardDetail = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const { boards, moveTask, reorderTasks } = useBoardStore();
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<{ id: string, title: string, type: ColumnType } | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  
  // New state for edit task modal
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingTaskColumnId, setEditingTaskColumnId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const board = boards.find(board => board.id === boardId);

  useEffect(() => {
    if (!board) {
      navigate('/', { replace: true });
    }
  }, [board, navigate]);

  if (!board) {
    return null;
  }

  const getColumnColor = (type: ColumnType) => {
    switch (type) {
      case 'todo':
        return 'border-blue-200 bg-blue-50';
      case 'in-progress':
        return 'border-yellow-200 bg-yellow-50';
      case 'done':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  const findTaskById = (taskId: string): { task: Task; columnId: string } | null => {
    for (const column of board.columns) {
      const task = column.tasks.find(task => task.id === taskId);
      if (task) {
        return { task, columnId: column.id };
      }
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskData = findTaskById(active.id as string);
    if (taskData) {
      setActiveTask(taskData.task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the active task and its column
    const activeTaskData = findTaskById(activeId);
    if (!activeTaskData) return;

    const { columnId: activeColumnId } = activeTaskData;

    // Check if we're dropping over a column (droppable area)
    const overColumn = board.columns.find(col => col.id === overId);
    
    if (overColumn) {
      // Dropping over a column
      if (activeColumnId !== overId) {
        // Moving to a different column
        moveTask(boardId!, activeColumnId, overId, activeId);
      }
    } else {
      // Dropping over another task - need to find which column the over task belongs to
      const overTaskData = findTaskById(overId);
      if (!overTaskData) return;

      const { columnId: overColumnId } = overTaskData;

      if (activeColumnId === overColumnId) {
        // Reordering within the same column
        const column = board.columns.find(col => col.id === activeColumnId);
        if (!column) return;

        const activeIndex = column.tasks.findIndex(task => task.id === activeId);
        const overIndex = column.tasks.findIndex(task => task.id === overId);

        if (activeIndex !== overIndex) {
          reorderTasks(boardId!, activeColumnId, activeIndex, overIndex);
        }
      } else {
        // Moving to a different column
        moveTask(boardId!, activeColumnId, overColumnId, activeId);
      }
    }
  };

  const openTaskModal = (columnId: string) => {
    setActiveColumnId(columnId);
    setIsTaskModalOpen(true);
  };

  const openEditColumnModal = (column: Column) => {
    setEditingColumn({ id: column.id, title: column.title, type: column.type });
    setIsColumnModalOpen(true);
  };

  // New function to handle edit task
  const handleEditTask = (task: Task, columnId: string) => {
    setEditingTask(task);
    setEditingTaskColumnId(columnId);
    setIsEditTaskModalOpen(true);
  };

  return (
    <div className="h-full flex flex-col relative z-10">
      {/* Glowing background */}
      <div className="absolute -top-10 -left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse z-0" />
      <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse z-0" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6 z-10">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/')}
            className="mr-4 p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            {board.title}
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsColumnModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-xl transition-all"
          >
            <PlusCircle size={18} />
            <span>Add Column</span>
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition"
            title="Board settings"
          >
            <Settings size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* Empty State */}
      {board.columns.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white/5 text-white/80 backdrop-blur rounded-xl shadow-xl z-10">
          <p className="text-xl mb-4">This board has no columns yet</p>
          <button
            onClick={() => setIsColumnModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-md transition"
          >
            <PlusCircle size={20} />
            <span>Add Your First Column</span>
          </button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex overflow-x-auto pb-4 gap-4 z-10">
            {board.columns.map(column => (
              <div
                key={column.id}
                className="flex-shrink-0 w-80 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg"
              >
                <div className="p-3 border-b border-white/10 flex justify-between items-center">
                  <h3 className="font-semibold text-white/90">{column.title}</h3>
                  <button
                    onClick={() => openEditColumnModal(column)}
                    className="p-1 text-white/50 hover:text-white/80"
                  >
                    <Settings size={16} />
                  </button>
                </div>

                <SortableContext
                  items={column.tasks.map(task => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div
                    id={column.id}
                    className="p-2 min-h-[50vh] max-h-[70vh] overflow-y-auto"
                  >
                    {column.tasks.map(task => (
                      <SortableTaskCard
                        key={task.id}
                        task={task}
                        boardId={boardId!}
                        columnId={column.id}
                        onEditTask={handleEditTask}
                      />
                    ))}
                  </div>
                </SortableContext>

                <button
                  onClick={() => openTaskModal(column.id)}
                  className="m-2 p-2 w-full flex items-center justify-center gap-1 text-sm text-white/70 hover:bg-white/10 hover:text-white rounded-md transition"
                >
                  <PlusCircle size={16} />
                  <span>Add Task</span>
                </button>
              </div>
            ))}
          </div>

          <DragOverlay>
            {activeTask && (
              <div className="transform rotate-2">
                <TaskCard
                  task={activeTask}
                  boardId={boardId!}
                  columnId=""
                  onEditTask={() => {}}
                />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      )}

      {/* Modals */}
      <CreateColumnModal
        isOpen={isColumnModalOpen}
        onClose={() => {
          setIsColumnModalOpen(false);
          setEditingColumn(null);
        }}
        boardId={boardId!}
        editingColumn={editingColumn}
      />

      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setActiveColumnId(null);
        }}
        boardId={boardId!}
        columnId={activeColumnId}
      />

      {/* Edit Task Modal */}
      <CreateTaskModal
        isOpen={isEditTaskModalOpen}
        onClose={() => {
          setIsEditTaskModalOpen(false);
          setEditingTask(null);
          setEditingTaskColumnId(null);
        }}
        boardId={boardId!}
        columnId={editingTaskColumnId}
        editingTask={editingTask}
      />

      <BoardSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        board={board}
      />
    </div>
  );
};

export default BoardDetail;