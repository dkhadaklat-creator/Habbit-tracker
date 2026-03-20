export type Category = 'Work' | 'Study' | 'Personal' | 'Diet';
export type Priority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  dueDate: string; // ISO string
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  completed: boolean;
  completedAt?: string; // ISO string
  createdAt: string; // ISO string
}

export interface WorkSession {
  id: string;
  startTime: string; // ISO string
  endTime?: string; // ISO string
  duration: number; // in seconds
}

export interface UserStats {
  points: number;
  level: string;
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string | null;
  dailyGoal: number;
}

export interface AppState {
  tasks: Task[];
  sessions: WorkSession[];
  stats: UserStats;
}
