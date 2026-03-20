import React from 'react';
import { useApp } from '../context/AppContext';
import { format, startOfDay, addHours, isSameDay } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { CheckCircle2, Circle, Clock, CalendarDays } from 'lucide-react';

export const Schedule = () => {
  const { tasks, toggleTaskCompletion, showToast } = useApp();
  const today = startOfDay(new Date());
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Hours from 5 AM to 12 AM
  const hours = Array.from({ length: 20 }).map((_, i) => i + 5);

  const todayTasks = tasks.filter(task => isSameDay(new Date(task.dueDate), today));

  const handleToggle = (id: string, completed: boolean) => {
    if (!completed) {
      showToast('Schedule Item Done! 🎉');
    }
    toggleTaskCompletion(id);
  };

  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const timeIndicatorTop = ((currentHour - 5) * 80) + (currentMinute / 60 * 80);

  return (
    <div className="p-6 pt-12 space-y-8 min-h-screen pb-32">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">My Day</h1>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">
            {format(today, 'EEEE, MMMM do')}
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
          <CalendarDays className="w-6 h-6 text-indigo-400" />
        </div>
      </div>

      <div className="relative mt-8">
        {/* Timeline Line */}
        <div className="absolute left-[3.5rem] top-0 bottom-0 w-px bg-gradient-to-b from-white/5 via-white/10 to-white/5" />

        {/* Current Time Indicator */}
        {currentHour >= 5 && currentHour <= 24 && (
          <motion.div 
            className="absolute left-[3.5rem] right-0 h-px bg-indigo-500 z-20 flex items-center"
            style={{ top: timeIndicatorTop }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="absolute -left-1 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
            <div className="ml-2 px-2 py-0.5 rounded-md bg-indigo-500 text-[8px] font-bold text-white uppercase tracking-tighter">
              Now
            </div>
          </motion.div>
        )}

        <div className="space-y-0">
          {hours.map(hour => {
            const hourTasks = todayTasks.filter(task => {
              if (!task.startTime) return false;
              const taskHour = parseInt(task.startTime.split(':')[0]);
              return taskHour === hour;
            });

            return (
              <div key={hour} className="relative flex gap-6 h-20">
                {/* Time Label */}
                <div className="w-10 text-right pt-1">
                  <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">
                    {format(addHours(today, hour), 'h a')}
                  </span>
                </div>

                {/* Hour Marker Dot */}
                <div className="absolute left-[3.5rem] top-2.5 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/10 border border-[#0a0a0a] z-10" />

                {/* Tasks for this hour */}
                <div className="flex-1 -mt-1 pb-4">
                  <AnimatePresence>
                    {hourTasks.map((task, idx) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: idx * 0.1 }}
                        className={cn(
                          "group relative p-3 rounded-2xl border transition-all duration-500 mb-2",
                          task.completed 
                            ? "bg-white/[0.02] border-white/5 opacity-50" 
                            : "bg-gradient-to-br from-white/[0.08] to-transparent border-white/10 hover:border-indigo-500/40 shadow-xl shadow-black/40"
                        )}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <div className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                task.category === 'Work' ? "bg-blue-400" :
                                task.category === 'Study' ? "bg-purple-400" :
                                task.category === 'Diet' ? "bg-green-400" :
                                "bg-teal-400"
                              )} />
                              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                                {task.startTime} - {task.endTime || '...'}
                              </span>
                            </div>
                            <h4 className={cn(
                              "text-sm font-semibold truncate transition-all",
                              task.completed ? "text-gray-500 line-through" : "text-white"
                            )}>
                              {task.title}
                            </h4>
                          </div>

                          <button 
                            onClick={() => handleToggle(task.id, task.completed)}
                            className={cn(
                              "w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90",
                              task.completed 
                                ? "text-emerald-400 bg-emerald-400/10" 
                                : "text-gray-500 bg-white/5 hover:text-white hover:bg-white/10 border border-white/5"
                            )}
                          >
                            {task.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {todayTasks.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center space-y-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full" />
            <div className="relative w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur-xl">
              <Clock className="w-10 h-10 text-gray-600" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Clear Schedule</h3>
            <p className="text-sm text-gray-500 max-w-[200px] mx-auto">Your day is open. Add some tasks with times to start planning.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
