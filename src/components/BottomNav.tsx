import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, ListTodo, Timer, BarChart2, User, CalendarDays } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'tasks', icon: ListTodo, label: 'Tasks' },
  { id: 'schedule', icon: CalendarDays, label: 'Schedule' },
  { id: 'timer', icon: Timer, label: 'Timer' },
  { id: 'analytics', icon: BarChart2, label: 'Stats' },
  { id: 'profile', icon: User, label: 'Profile' },
];

export const BottomNav = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-black/40 backdrop-blur-xl border-t border-white/10 px-6 pb-safe">
      <div className="flex items-center justify-between h-full max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative flex flex-col items-center justify-center w-16 h-full gap-1"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 bg-white/5 rounded-2xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon 
                className={cn(
                  "w-6 h-6 transition-colors duration-300",
                  isActive ? "text-indigo-400" : "text-gray-500"
                )} 
              />
              <span className={cn(
                "text-[10px] font-medium transition-colors duration-300",
                isActive ? "text-indigo-400" : "text-gray-500"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
