import React from 'react';
import { Task } from '../types';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import { Check, Clock, Tag } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

const priorityColors = {
  High: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Low: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
};

const categoryColors = {
  Work: 'text-blue-400 bg-blue-400/10',
  Study: 'text-purple-400 bg-purple-400/10',
  Personal: 'text-teal-400 bg-teal-400/10',
  Diet: 'text-green-400 bg-green-400/10',
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { toggleTaskCompletion, showToast } = useApp();

  const handleToggle = () => {
    if (!task.completed) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#818cf8', '#c084fc', '#34d399']
      });
      showToast('Task Completed 🎉');
    }
    toggleTaskCompletion(task.id);
  };

  const isOverdue = !task.completed && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "relative group p-4 rounded-2xl border transition-all duration-300",
        "bg-white/5 backdrop-blur-sm hover:bg-white/10",
        task.completed ? "border-white/5 opacity-60" : "border-white/10",
        isOverdue && "border-rose-500/30 bg-rose-500/5"
      )}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={handleToggle}
          className={cn(
            "mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
            task.completed 
              ? "bg-indigo-500 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
              : "border-gray-500 hover:border-indigo-400"
          )}
        >
          <motion.div
            initial={false}
            animate={{ scale: task.completed ? 1 : 0, opacity: task.completed ? 1 : 0 }}
          >
            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
          </motion.div>
        </button>

        <div className="flex-1 min-w-0" onClick={() => onEdit?.(task)}>
          <h3 className={cn(
            "text-base font-medium truncate transition-all duration-300",
            task.completed ? "text-gray-400 line-through" : "text-gray-100"
          )}>
            {task.title}
          </h3>
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={cn(
              "text-[10px] px-2 py-0.5 rounded-full font-medium border",
              priorityColors[task.priority]
            )}>
              {task.priority}
            </span>
            <span className={cn(
              "flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium",
              categoryColors[task.category]
            )}>
              <Tag className="w-3 h-3" />
              {task.category}
            </span>
            <span className={cn(
              "flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium",
              isOverdue ? "text-rose-400 bg-rose-400/10" : "text-gray-400 bg-gray-800"
            )}>
              <Clock className="w-3 h-3" />
              {format(new Date(task.dueDate), 'MMM d')}
              {task.startTime && task.endTime ? ` • ${task.startTime} - ${task.endTime}` : ` • ${format(new Date(task.dueDate), 'h:mm a')}`}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
