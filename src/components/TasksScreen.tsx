import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TaskCard } from './TaskCard';
import { Task, Category, Priority } from '../types';
import { Plus, X, Calendar, Tag, AlertCircle, Filter, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

export const TasksScreen = () => {
  const { tasks, addTask, editTask, deleteTask } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const [formData, setFormData] = useState({
    title: '',
    category: 'Work' as Category,
    priority: 'Medium' as Priority,
    dueDate: new Date().toISOString().slice(0, 16),
    startTime: '',
    endTime: '',
  });

  const handleOpenModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        category: task.category,
        priority: task.priority,
        dueDate: new Date(task.dueDate).toISOString().slice(0, 16),
        startTime: task.startTime || '',
        endTime: task.endTime || '',
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        category: 'Work',
        priority: 'Medium',
        dueDate: new Date().toISOString().slice(0, 16),
        startTime: '',
        endTime: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingTask) {
      editTask(editingTask.id, {
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString(),
      });
    } else {
      addTask({
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString(),
      });
    }
    handleCloseModal();
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  }).sort((a, b) => {
    if (a.completed === b.completed) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return a.completed ? 1 : -1;
  });

  return (
    <div className="p-6 pt-12 space-y-6 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Tasks</h1>
        <button
          onClick={() => handleOpenModal()}
          className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <Filter className="w-4 h-4 text-gray-500 mr-2" />
        {['all', 'pending', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all whitespace-nowrap",
              filter === f 
                ? "bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]" 
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3 pb-24">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-12 text-gray-500 text-sm"
            >
              No tasks found.
            </motion.div>
          ) : (
            filteredTasks.map(task => (
              <TaskCard key={task.id} task={task} onEdit={handleOpenModal} />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="w-full max-w-md bg-[#121212] border border-white/10 rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">{editingTask ? 'Edit Task' : 'New Task'}</h2>
                <button onClick={handleCloseModal} className="p-2 bg-white/5 rounded-full hover:bg-white/10">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <input
                    type="text"
                    placeholder="What needs to be done?"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 focus:border-indigo-500 px-2 py-3 text-lg outline-none placeholder:text-gray-600 transition-colors"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 flex items-center gap-1"><Tag className="w-3 h-3"/> Category</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-500 appearance-none"
                    >
                      <option value="Work" className="bg-[#121212]">Work</option>
                      <option value="Study" className="bg-[#121212]">Study</option>
                      <option value="Personal" className="bg-[#121212]">Personal</option>
                      <option value="Diet" className="bg-[#121212]">Diet</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Priority</label>
                    <select
                      value={formData.priority}
                      onChange={e => setFormData({ ...formData, priority: e.target.value as Priority })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-500 appearance-none"
                    >
                      <option value="High" className="bg-[#121212]">High</option>
                      <option value="Medium" className="bg-[#121212]">Medium</option>
                      <option value="Low" className="bg-[#121212]">Low</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3"/> Date</label>
                  <input
                    type="date"
                    value={formData.dueDate.slice(0, 10)}
                    onChange={e => setFormData({ ...formData, dueDate: `${e.target.value}T12:00` })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-500 [color-scheme:dark]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3"/> Start Time (Optional)</label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-500 [color-scheme:dark]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3"/> End Time (Optional)</label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-500 [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  {editingTask && (
                    <button
                      type="button"
                      onClick={() => {
                        deleteTask(editingTask.id);
                        handleCloseModal();
                      }}
                      className="px-4 py-3 rounded-xl bg-rose-500/10 text-rose-500 font-medium text-sm hover:bg-rose-500/20 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={!formData.title.trim()}
                    className="flex-1 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl py-3 font-medium text-sm transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                  >
                    {editingTask ? 'Save Changes' : 'Create Task'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
