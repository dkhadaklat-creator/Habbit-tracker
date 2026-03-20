import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, Task, UserStats, WorkSession, Category, Priority } from '../types';
import { isSameDay, startOfDay, differenceInDays } from 'date-fns';

interface AppContextType extends AppState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  toggleTaskCompletion: (id: string) => void;
  editTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  startSession: () => void;
  stopSession: () => void;
  activeSession: WorkSession | null;
  setDailyGoal: (goal: number) => void;
  addPoints: (points: number) => void;
  getLevelThresholds: (level: string) => { min: number; max: number };
  toast: string | null;
  showToast: (message: string) => void;
}

const defaultStats: UserStats = {
  points: 0,
  level: 'Beginner',
  currentStreak: 0,
  bestStreak: 0,
  lastActiveDate: null,
  dailyGoal: 5,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [toast, setToast] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('wt_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [sessions, setSessions] = useState<WorkSession[]>(() => {
    const saved = localStorage.getItem('wt_sessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('wt_stats');
    return saved ? JSON.parse(saved) : defaultStats;
  });
  const [activeSession, setActiveSession] = useState<WorkSession | null>(() => {
    const saved = localStorage.getItem('wt_active_session');
    return saved ? JSON.parse(saved) : null;
  });

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // Save to local storage whenever state changes
  useEffect(() => {
    localStorage.setItem('wt_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('wt_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('wt_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    if (activeSession) {
      localStorage.setItem('wt_active_session', JSON.stringify(activeSession));
    } else {
      localStorage.removeItem('wt_active_session');
    }
  }, [activeSession]);

  // Streak Logic
  useEffect(() => {
    const checkStreak = () => {
      setStats(prev => {
        if (!prev.lastActiveDate) return prev;
        const lastActive = new Date(prev.lastActiveDate);
        const today = new Date();
        const diff = differenceInDays(startOfDay(today), startOfDay(lastActive));
        
        if (diff > 1 && prev.currentStreak > 0) {
          return { ...prev, currentStreak: 0 };
        }
        return prev;
      });
    };
    
    checkStreak();
    window.addEventListener('focus', checkStreak);
    return () => window.removeEventListener('focus', checkStreak);
  }, []);

  const updateStreak = () => {
    const today = new Date().toISOString();
    setStats(prev => {
      let newStreak = prev.currentStreak;
      const lastActive = prev.lastActiveDate ? new Date(prev.lastActiveDate) : null;
      
      if (!lastActive || differenceInDays(startOfDay(new Date()), startOfDay(lastActive)) === 1) {
        newStreak += 1;
      } else if (differenceInDays(startOfDay(new Date()), startOfDay(lastActive)) > 1) {
        newStreak = 1;
      } else if (!lastActive) {
        newStreak = 1;
      }

      return {
        ...prev,
        currentStreak: newStreak,
        bestStreak: Math.max(newStreak, prev.bestStreak),
        lastActiveDate: today,
      };
    });
  };

  const updateLevel = (points: number) => {
    if (points >= 10000) return 'Godlike';
    if (points >= 5000) return 'Mythic';
    if (points >= 2500) return 'Legend';
    if (points >= 1000) return 'Master';
    if (points >= 500) return 'Pro';
    if (points >= 100) return 'Intermediate';
    return 'Beginner';
  };

  const getLevelThresholds = (level: string) => {
    switch (level) {
      case 'Beginner': return { min: 0, max: 100 };
      case 'Intermediate': return { min: 100, max: 500 };
      case 'Pro': return { min: 500, max: 1000 };
      case 'Master': return { min: 1000, max: 2500 };
      case 'Legend': return { min: 2500, max: 5000 };
      case 'Mythic': return { min: 5000, max: 10000 };
      case 'Godlike': return { min: 10000, max: 20000 };
      default: return { min: 0, max: 100 };
    }
  };

  const addPoints = (pointsToAdd: number) => {
    setStats(prev => {
      const newPoints = prev.points + pointsToAdd;
      const newLevel = updateLevel(newPoints);
      if (newLevel !== prev.level) {
        showToast(`Level Up! You are now a ${newLevel} 🏆`);
      }
      return {
        ...prev,
        points: newPoints,
        level: newLevel,
      };
    });
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
    showToast('Task added successfully! 📝');
  };

  // Pre-populate tasks if empty
  useEffect(() => {
    if (tasks.length === 0) {
      const sampleTasks: Task[] = [
        {
          id: crypto.randomUUID(),
          title: 'Complete Project Proposal',
          category: 'Work',
          priority: 'High',
          dueDate: new Date().toISOString(),
          startTime: '09:00',
          endTime: '11:00',
          completed: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          title: 'Morning Workout',
          category: 'Personal',
          priority: 'Medium',
          dueDate: new Date().toISOString(),
          startTime: '07:00',
          endTime: '08:00',
          completed: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          title: 'Read 20 pages of a book',
          category: 'Study',
          priority: 'Low',
          dueDate: new Date().toISOString(),
          startTime: '21:00',
          endTime: '22:00',
          completed: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          title: 'Prepare Healthy Lunch',
          category: 'Diet',
          priority: 'Medium',
          dueDate: new Date().toISOString(),
          startTime: '12:00',
          endTime: '13:00',
          completed: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          title: 'Review Weekly Goals',
          category: 'Work',
          priority: 'High',
          dueDate: new Date().toISOString(),
          startTime: '17:00',
          endTime: '18:00',
          completed: false,
          createdAt: new Date().toISOString(),
        }
      ];
      setTasks(sampleTasks);
    }
  }, []);

  const toggleTaskCompletion = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const isCompleting = !task.completed;
        if (isCompleting) {
          updateStreak();
          addPoints(10); // 10 points per task
        }
        return {
          ...task,
          completed: isCompleting,
          completedAt: isCompleting ? new Date().toISOString() : undefined,
        };
      }
      return task;
    }));
  };

  const editTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, ...updates } : task));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const startSession = () => {
    if (activeSession) return;
    setActiveSession({
      id: crypto.randomUUID(),
      startTime: new Date().toISOString(),
      duration: 0,
    });
  };

  const stopSession = () => {
    if (!activeSession) return;
    const endTime = new Date().toISOString();
    const duration = Math.floor((new Date(endTime).getTime() - new Date(activeSession.startTime).getTime()) / 1000);
    
    const completedSession: WorkSession = {
      ...activeSession,
      endTime,
      duration,
    };
    
    setSessions(prev => [...prev, completedSession]);
    setActiveSession(null);
    addPoints(Math.floor(duration / 60) * 2); // 2 points per minute
  };

  const setDailyGoal = (goal: number) => {
    setStats(prev => ({ ...prev, dailyGoal: goal }));
  };

  return (
    <AppContext.Provider value={{
      activeTab, setActiveTab,
      tasks, sessions, stats,
      addTask, toggleTaskCompletion, editTask, deleteTask,
      startSession, stopSession, activeSession,
      setDailyGoal, addPoints, getLevelThresholds,
      toast, showToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
