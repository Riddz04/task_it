import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { PlusCircle, Settings, ArrowLeft } from 'lucide-react';
import { useBoardStore } from '../store/boardStore';
import TaskCard from '../components/TaskCard';
import CreateColumnModal from '../components/modals/CreateColumnModal';
import CreateTaskModal from '../components/modals/CreateTaskModal';
import BoardSettings from '../components/BoardSettings';
import { Column, ColumnType } from '../types';

const BoardDetail = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const { boards, moveTask, reorderTasks } = useBoardStore();
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<{ id: string, title: string, type: ColumnType } | null>(null);

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

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    
    if (!destination) {
      return;
    }
    
    if (source.droppableId === destination.droppableId) {
      reorderTasks(
        boardId!,
        source.droppableId,
        source.index,
        destination.index
      );
    } else {
      const taskId = board.columns
        .find(col => col.id === source.droppableId)
        ?.tasks[source.index]?.id;
        
      if (taskId) {
        moveTask(
          boardId!,
          source.droppableId,
          destination.droppableId,
          taskId
        );
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

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/')}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">{board.title}</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsColumnModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            <PlusCircle size={18} />
            <span>Add Column</span>
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            title="Board settings"
          >
            <Settings size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {board.columns.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-md">
          <p className="text-xl text-gray-600 mb-4">This board has no columns yet</p>
          <button
            onClick={() => setIsColumnModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            <PlusCircle size={20} />
            <span>Add Your First Column</span>
          </button>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex overflow-x-auto pb-4 gap-4">
            {board.columns.map(column => (
              <Droppable key={column.id} droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-shrink-0 w-80 border rounded-lg shadow-sm ${getColumnColor(column.type)}`}
                  >
                    <div className="p-3 border-b flex justify-between items-center">
                      <h3 className="font-medium text-gray-800">{column.title}</h3>
                      <div className="flex items-center">
                        <button
                          onClick={() => openEditColumnModal(column)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <Settings size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="p-2 min-h-[50vh] max-h-[70vh] overflow-y-auto">
                      {column.tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`mb-2 ${snapshot.isDragging ? 'opacity-75' : ''}`}
                            >
                              <TaskCard
                                task={task}
                                boardId={boardId!}
                                columnId={column.id}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>

                    <button
                      onClick={() => openTaskModal(column.id)}
                      className="m-2 p-2 w-full flex items-center justify-center gap-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-200"
                    >
                      <PlusCircle size={16} />
                      <span>Add Task</span>
                    </button>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      )}

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

      <BoardSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        board={board}
      />
    </div>
  );
};

export default BoardDetail;