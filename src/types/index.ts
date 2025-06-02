export type Priority = 'low' | 'medium' | 'high';
export type ColumnType = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  assignedTo: string;
  priority: Priority;
  dueDate: string;
  createdAt: string;
}

export interface Column {
  id: string;
  title: string;
  type: ColumnType;
  tasks: Task[];
}

export interface Board {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  columns: Column[];
}