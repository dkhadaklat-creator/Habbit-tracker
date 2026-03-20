import React from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format, subDays, isSameDay } from 'date-fns';
import { Activity, CheckSquare, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const Analytics = () => {
  const { tasks, sessions, stats } = useApp();

  // Generate last 7 days data
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    const completedOnDate = tasks.filter(t => t.completedAt && isSameDay(new Date(t.completedAt), date)).length;
    return {
      name: format(date, 'EEE'),
      completed: completedOnDate,
      date: format(date, 'MMM d'),
    };
  });

  const totalCompleted = tasks.filter(t => t.completed).length;
  const totalHours = (sessions.reduce((acc, s) => acc + s.duration, 0) / 3600).toFixed(1);
  const totalHoursNum = parseFloat(totalHours);
  const completionRate = tasks.length > 0 ? Math.round((totalCompleted / tasks.length) * 100) : 0;

  // Smart Insights Logic
  const getInsights = () => {
    const insights = [];
    
    // Streak insight
    if (stats.currentStreak > 2) {
      insights.push(`You're on a ${stats.currentStreak}-day streak! Keep up the great work. 🔥`);
    } else {
      insights.push("Complete tasks daily to build your streak and earn more points. 🎯");
    }

    // Time of day insight
    const completedTasks = tasks.filter(t => t.completed && t.completedAt);
    if (completedTasks.length > 3) {
      let morning = 0, afternoon = 0, evening = 0;
      completedTasks.forEach(t => {
        const hour = new Date(t.completedAt!).getHours();
        if (hour >= 5 && hour < 12) morning++;
        else if (hour >= 12 && hour < 17) afternoon++;
        else evening++;
      });
      
      const max = Math.max(morning, afternoon, evening);
      if (max === morning) insights.push("You tend to be most productive in the mornings. 🌅");
      else if (max === afternoon) insights.push("Afternoons are your most productive time. ☀️");
      else insights.push("You're a night owl! Most tasks are completed in the evening. 🌙");
    }

    // Focus time insight
    if (totalHoursNum > 10) {
      insights.push("You've been highly focused this week. Don't forget to take breaks! ☕");
    } else if (totalHoursNum === 0) {
      insights.push("Try using the Focus Timer to track your deep work sessions. ⏱️");
    }

    return insights;
  };

  const insights = getInsights();

  return (
    <div className="p-6 pt-12 space-y-8 min-h-screen pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Analytics</h1>
        <div className="flex items-center gap-2 text-sm text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
          <TrendingUp className="w-4 h-4" />
          <span>{completionRate}% Rate</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
        >
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <CheckSquare className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Completed</span>
          </div>
          <div className="text-3xl font-semibold text-white">{totalCompleted}</div>
          <p className="text-[10px] text-gray-400 mt-1">Total tasks done</p>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
        >
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Focus Time</span>
          </div>
          <div className="text-3xl font-semibold text-white">{totalHours}<span className="text-sm text-gray-500 font-normal">h</span></div>
          <p className="text-[10px] text-gray-400 mt-1">Total hours tracked</p>
        </motion.div>
      </div>

      {/* Chart */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-medium text-gray-200 flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            Weekly Activity
          </h3>
        </div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff'
                }}
                labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
              />
              <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.completed > 0 ? '#6366f1' : '#374151'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Smart Insights</h3>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "p-4 rounded-2xl border backdrop-blur-sm",
                index === 0 
                  ? "bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20 text-indigo-200"
                  : "bg-white/5 border-white/10 text-gray-300"
              )}
            >
              <p className="text-sm">{insight}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
