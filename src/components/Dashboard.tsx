import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TaskCard } from './TaskCard';
import { format, isToday } from 'date-fns';
import { Flame, Target, CheckCircle2, Plus } from 'lucide-react';
import { motion } from 'motion/react';

export const Dashboard = () => {
  const { tasks, stats, setActiveTab } = useApp();
  
  const todayTasks = tasks.filter(t => isToday(new Date(t.dueDate)));
  const completedToday = todayTasks.filter(t => t.completed).length;
  const progress = todayTasks.length > 0 ? (completedToday / todayTasks.length) * 100 : 0;

  const nextTask = todayTasks
    .filter(t => !t.completed && t.startTime)
    .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''))[0];

  const quotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Productivity is being able to do things that you were never able to do before. - Franz Kafka",
    "Your mind is for having ideas, not holding them. - David Allen",
    "Focus on being productive instead of busy. - Tim Ferriss",
    "The way to get started is to quit talking and begin doing. - Walt Disney"
  ];
  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  return (
    <div className="p-6 pt-12 space-y-8 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, Daniyal
          </h1>
          <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest font-medium">Let's make today productive.</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px]">
          <div className="w-full h-full rounded-2xl bg-[#0a0a0a] flex items-center justify-center border border-white/10">
            <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              {stats.level.charAt(0)}
            </span>
          </div>
        </div>
      </div>

      {/* Quote Section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 italic text-center"
      >
        <p className="text-xs text-indigo-300/80 leading-relaxed">"{quote}"</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden shadow-2xl shadow-black/20"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl" />
          <div className="flex items-center gap-2 text-orange-400 mb-2">
            <Flame className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Streak</span>
          </div>
          <div className="text-3xl font-bold">{stats.currentStreak} <span className="text-xs text-gray-500 font-normal">days</span></div>
          {stats.currentStreak > 0 && (
            <p className="text-[10px] text-gray-400 mt-1">You're on fire! 🔥</p>
          )}
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden shadow-2xl shadow-black/20"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
          <div className="flex items-center gap-2 text-indigo-400 mb-2">
            <Target className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Goal</span>
          </div>
          <div className="text-3xl font-bold">{completedToday}<span className="text-gray-500">/{stats.dailyGoal}</span></div>
          <p className="text-[10px] text-gray-400 mt-1">Tasks completed</p>
        </motion.div>
      </div>

      {/* Progress */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 overflow-hidden shadow-2xl shadow-indigo-500/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white/90">Daily Progress</span>
            <span className="text-2xl font-bold text-white">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-black/20 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-white rounded-full"
            />
          </div>
          <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">
            {todayTasks.length - completedToday} tasks remaining
          </p>
        </div>
      </div>

      {/* Next Up Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Next Up</h3>
          <button 
            onClick={() => setActiveTab('schedule')}
            className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors"
          >
            View Schedule
          </button>
        </div>
        
        {nextTask ? (
          <motion.div 
            whileHover={{ scale: 1.02 }}
            onClick={() => setActiveTab('schedule')}
            className="p-4 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-4 cursor-pointer hover:bg-white/[0.08] transition-all shadow-xl shadow-black/20"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex flex-col items-center justify-center border border-indigo-500/20">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">
                {nextTask.startTime?.split(':')[0]}
              </span>
              <span className="text-[8px] font-bold text-indigo-500 uppercase tracking-tighter">
                {parseInt(nextTask.startTime?.split(':')[0] || '0') >= 12 ? 'PM' : 'AM'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white truncate">{nextTask.title}</h4>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                Starts at {nextTask.startTime}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
              <Plus className="w-4 h-4 text-gray-500 rotate-45" />
            </div>
          </motion.div>
        ) : (
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-dashed border-white/10 text-center">
            <p className="text-xs text-gray-500 font-medium">Nothing scheduled next. Relax or plan ahead!</p>
          </div>
        )}
      </div>

      {/* Today's Tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Today's Tasks</h2>
          <button 
            onClick={() => setActiveTab('tasks')}
            className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors"
          >
            See All
          </button>
        </div>
        
        <div className="space-y-3">
          {todayTasks.length === 0 ? (
            <div className="text-center py-8 bg-white/5 rounded-2xl border border-white/10 border-dashed">
              <CheckCircle2 className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No tasks for today.</p>
            </div>
          ) : (
            todayTasks
              .sort((a, b) => Number(a.completed) - Number(b.completed))
              .slice(0, 4)
              .map(task => (
                <TaskCard key={task.id} task={task} />
              ))
          )}
        </div>
      </div>

      {/* Floating Add Button */}
      <button 
        onClick={() => setActiveTab('tasks')}
        className="fixed bottom-24 right-6 w-14 h-14 bg-indigo-500 hover:bg-indigo-600 rounded-full shadow-[0_0_30px_rgba(99,102,241,0.4)] flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95 z-50"
      >
        <Plus className="w-6 h-6" />
      </button>

      <div className="text-center pt-8 pb-4">
        <p className="text-xs text-gray-500 tracking-widest uppercase">Made by DANIYAL</p>
      </div>
    </div>
  );
};
