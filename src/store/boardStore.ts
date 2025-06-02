import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Board, Column, Task, Priority, ColumnType } from '../types';

interface BoardState {
  boards: Board[];
  addBoard: (title: string, description: string) => void;
  updateBoard: (id: string, title: string, description: string) => void;
  deleteBoard: (id: string) => void;
  
  addColumn: (boardId: string, title: string, type: ColumnType) => void;
  updateColumn: (boardId: string, columnId: string, title: string, type: ColumnType) => void;
  deleteColumn: (boardId: string, columnId: string) => void;
  
  addTask: (
    boardId: string, 
    columnId: string, 
    title: string,
    description: string,
    createdBy: string,
    assignedTo: string,
    priority: Priority,
    dueDate: string
  ) => void;
  updateTask: (
    boardId: string,
    columnId: string,
    taskId: string,
    data: Partial<Omit<Task, 'id' | 'createdAt'>>
  ) => void;
  deleteTask: (boardId: string, columnId: string, taskId: string) => void;
  
  moveTask: (
    sourceBoardId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    taskId: string
  ) => void;
  reorderTasks: (
    boardId: string,
    columnId: string,
    startIndex: number,
    endIndex: number
  ) => void;
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      boards: [],
      
      addBoard: (title, description) => set((state) => ({
        boards: [
          ...state.boards,
          {
            id: uuidv4(),
            title,
            description,
            createdAt: new Date().toISOString(),
            columns: [
              {
                id: uuidv4(),
                title: 'To Do',
                type: 'todo',
                tasks: []
              },
              {
                id: uuidv4(),
                title: 'In Progress',
                type: 'in-progress',
                tasks: []
              },
              {
                id: uuidv4(),
                title: 'Done',
                type: 'done',
                tasks: []
              }
            ]
          }
        ]
      })),
      
      updateBoard: (id, title, description) => set((state) => ({
        boards: state.boards.map(board => 
          board.id === id 
            ? { ...board, title, description }
            : board
        )
      })),
      
      deleteBoard: (id) => set((state) => ({
        boards: state.boards.filter(board => board.id !== id)
      })),
      
      addColumn: (boardId, title, type) => set((state) => ({
        boards: state.boards.map(board => 
          board.id === boardId
            ? {
                ...board,
                columns: [
                  ...board.columns,
                  {
                    id: uuidv4(),
                    title,
                    type,
                    tasks: []
                  }
                ]
              }
            : board
        )
      })),
      
      updateColumn: (boardId, columnId, title, type) => set((state) => ({
        boards: state.boards.map(board => 
          board.id === boardId
            ? {
                ...board,
                columns: board.columns.map(column => 
                  column.id === columnId
                    ? { ...column, title, type }
                    : column
                )
              }
            : board
        )
      })),
      
      deleteColumn: (boardId, columnId) => set((state) => ({
        boards: state.boards.map(board => 
          board.id === boardId
            ? {
                ...board,
                columns: board.columns.filter(column => column.id !== columnId)
              }
            : board
        )
      })),
      
      addTask: (boardId, columnId, title, description, createdBy, assignedTo, priority, dueDate) => set((state) => ({
        boards: state.boards.map(board => 
          board.id === boardId
            ? {
                ...board,
                columns: board.columns.map(column => 
                  column.id === columnId
                    ? {
                        ...column,
                        tasks: [
                          ...column.tasks,
                          {
                            id: uuidv4(),
                            title,
                            description,
                            createdBy,
                            assignedTo,
                            priority,
                            dueDate,
                            createdAt: new Date().toISOString()
                          }
                        ]
                      }
                    : column
                )
              }
            : board
        )
      })),
      
      updateTask: (boardId, columnId, taskId, data) => set((state) => ({
        boards: state.boards.map(board => 
          board.id === boardId
            ? {
                ...board,
                columns: board.columns.map(column => 
                  column.id === columnId
                    ? {
                        ...column,
                        tasks: column.tasks.map(task => 
                          task.id === taskId
                            ? { ...task, ...data }
                            : task
                        )
                      }
                    : column
                )
              }
            : board
        )
      })),
      
      deleteTask: (boardId, columnId, taskId) => set((state) => ({
        boards: state.boards.map(board => 
          board.id === boardId
            ? {
                ...board,
                columns: board.columns.map(column => 
                  column.id === columnId
                    ? {
                        ...column,
                        tasks: column.tasks.filter(task => task.id !== taskId)
                      }
                    : column
                )
              }
            : board
        )
      })),
      
      moveTask: (sourceBoardId, sourceColumnId, destinationColumnId, taskId) => set((state) => {
        const sourceBoard = state.boards.find(board => board.id === sourceBoardId);
        if (!sourceBoard) return state;
        
        const sourceColumn = sourceBoard.columns.find(column => column.id === sourceColumnId);
        if (!sourceColumn) return state;
        
        const taskIndex = sourceColumn.tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) return state;
        
        const taskToMove = sourceColumn.tasks[taskIndex];
        
        return {
          boards: state.boards.map(board => 
            board.id === sourceBoardId
              ? {
                  ...board,
                  columns: board.columns.map(column => {
                    if (column.id === sourceColumnId) {
                      return {
                        ...column,
                        tasks: column.tasks.filter(task => task.id !== taskId)
                      };
                    }
                    if (column.id === destinationColumnId) {
                      return {
                        ...column,
                        tasks: [...column.tasks, taskToMove]
                      };
                    }
                    return column;
                  })
                }
              : board
          )
        };
      }),
      
      reorderTasks: (boardId, columnId, startIndex, endIndex) => set((state) => {
        const board = state.boards.find(board => board.id === boardId);
        if (!board) return state;
        
        const column = board.columns.find(column => column.id === columnId);
        if (!column) return state;
        
        const newTasks = [...column.tasks];
        const [removed] = newTasks.splice(startIndex, 1);
        newTasks.splice(endIndex, 0, removed);
        
        return {
          boards: state.boards.map(board => 
            board.id === boardId
              ? {
                  ...board,
                  columns: board.columns.map(column => 
                    column.id === columnId
                      ? { ...column, tasks: newTasks }
                      : column
                  )
                }
              : board
          )
        };
      })
    }),
    {
      name: 'taskit-board-storage'
    }
  )
);