import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Play, Square, Clock, History } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const TimeTracker = () => {
  const { activeSession, startSession, stopSession, sessions } = useApp();
  const [elapsed, setElapsed] = useState(() => {
    if (activeSession) {
      return Math.floor((new Date().getTime() - new Date(activeSession.startTime).getTime()) / 1000);
    }
    return 0;
  });

  useEffect(() => {
    let interval: any;
    
    const updateElapsed = () => {
      if (activeSession) {
        const start = new Date(activeSession.startTime).getTime();
        const now = Date.now();
        setElapsed(Math.floor((now - start) / 1000));
      } else {
        setElapsed(0);
      }
    };

    updateElapsed();

    if (activeSession) {
      interval = setInterval(updateElapsed, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeSession]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalSeconds = sessions.reduce((acc, s) => acc + s.duration, 0);
  const totalHours = (totalSeconds / 3600).toFixed(1);

  return (
    <div className="p-6 pt-12 space-y-8 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Focus Timer</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          <Clock className="w-4 h-4" />
          <span>{totalHours}h total</span>
        </div>
      </div>

      {/* Timer Display */}
      <div className="relative flex flex-col items-center justify-center py-12">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent rounded-[3rem] blur-xl" />
        
        <motion.div 
          className="relative w-64 h-64 rounded-full border-4 border-white/5 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm shadow-2xl"
          animate={{
            borderColor: activeSession ? ['rgba(255,255,255,0.05)', 'rgba(99,102,241,0.5)', 'rgba(255,255,255,0.05)'] : 'rgba(255,255,255,0.05)',
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {activeSession && (
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" style={{ animationDuration: '3s' }} />
          )}
          
          <span className="text-5xl font-mono font-light tracking-wider text-white mb-2">
            {formatTime(elapsed)}
          </span>
          <span className={cn(
            "text-sm font-medium uppercase tracking-widest transition-colors",
            activeSession ? "text-indigo-400" : "text-gray-500"
          )}>
            {activeSession ? 'Focusing' : 'Ready'}
          </span>
        </motion.div>

        <div className="mt-12">
          <button
            onClick={activeSession ? stopSession : startSession}
            className={cn(
              "flex items-center gap-3 px-8 py-4 rounded-full font-medium text-lg transition-all transform hover:scale-105 active:scale-95",
              activeSession 
                ? "bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.2)]" 
                : "bg-indigo-500 text-white shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:bg-indigo-600"
            )}
          >
            {activeSession ? (
              <>
                <Square className="w-5 h-5 fill-current" />
                Stop Session
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                Start Focus
              </>
            )}
          </button>
        </div>
      </div>

      {/* History */}
      <div className="space-y-4 pb-24">
        <div className="flex items-center gap-2 text-lg font-medium text-white mb-4">
          <History className="w-5 h-5 text-indigo-400" />
          Recent Sessions
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm bg-white/5 rounded-2xl border border-white/10 border-dashed">
            No sessions recorded yet.
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.slice().reverse().slice(0, 5).map(session => (
              <div key={session.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <div>
                  <div className="text-sm font-medium text-gray-200">
                    {format(new Date(session.startTime), 'MMM d, yyyy')}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {format(new Date(session.startTime), 'h:mm a')} - {session.endTime ? format(new Date(session.endTime), 'h:mm a') : 'Ongoing'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-mono text-indigo-400">
                    {formatTime(session.duration)}
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">Duration</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
