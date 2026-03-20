import React from 'react';
import { useApp } from '../context/AppContext';
import { BottomNav } from './BottomNav';
import { Dashboard } from './Dashboard';
import { TasksScreen } from './TasksScreen';
import { TimeTracker } from './TimeTracker';
import { Analytics } from './Analytics';
import { Profile } from './Profile';
import { Schedule } from './Schedule';
import { motion, AnimatePresence } from 'motion/react';

export const Layout = () => {
  const { activeTab, toast } = useApp();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-indigo-500/30">
      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />
      </div>

      <main className="relative max-w-md mx-auto min-h-screen pb-24 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.3 }}
            className="min-h-full"
          >
            {activeTab === 'home' && <Dashboard />}
            {activeTab === 'tasks' && <TasksScreen />}
            {activeTab === 'schedule' && <Schedule />}
            {activeTab === 'timer' && <TimeTracker />}
            {activeTab === 'analytics' && <Analytics />}
            {activeTab === 'profile' && <Profile />}
          </motion.div>
        </AnimatePresence>

        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl z-50 flex items-center gap-2"
            >
              <span className="text-sm font-medium text-white">{toast}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
};
