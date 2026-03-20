import React from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, Star, Zap, Target, Award, Crown, Settings, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const Profile = () => {
  const { stats, tasks, sessions, getLevelThresholds } = useApp();
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);

  const totalCompleted = tasks.filter(t => t.completed).length;
  const totalHours = (sessions.reduce((acc, s) => acc + s.duration, 0) / 3600).toFixed(1);

  const thresholds = getLevelThresholds(stats.level);
  const currentLevelXP = stats.points - thresholds.min;
  const rangeXP = thresholds.max - thresholds.min;
  const levelProgress = Math.min(Math.max((currentLevelXP / rangeXP) * 100, 0), 100);

  const productivityScore = Math.min(100, Math.round((totalCompleted * 10) + (parseFloat(totalHours) * 5) + (stats.currentStreak * 15)));

  const badges = [
    { id: 1, title: 'First Steps', desc: 'Complete your first task', icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', earned: totalCompleted >= 1 },
    { id: 2, title: 'On Fire', desc: 'Reach a 7-day streak', icon: Zap, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20', earned: stats.bestStreak >= 7 },
    { id: 3, title: 'Centurion', desc: 'Complete 100 tasks', icon: Target, color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20', earned: totalCompleted >= 100 },
    { id: 4, title: 'Deep Work', desc: 'Track 10 hours of focus', icon: Award, color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/20', earned: parseFloat(totalHours) >= 10 },
    { id: 5, title: 'Streak Master', desc: 'Reach a 30-day streak', icon: Crown, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20', earned: stats.bestStreak >= 30 },
    { id: 6, title: 'Pro Focus', desc: 'Track 50 hours of focus', icon: Zap, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', earned: parseFloat(totalHours) >= 50 },
  ];

  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="p-6 pt-12 space-y-8 min-h-screen pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Profile</h1>
        <button className="p-2 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-full border border-white/10">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* User Card */}
      <div className="relative p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10 backdrop-blur-md overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="relative flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[3px]">
            <div className="w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center border-2 border-transparent">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                {stats.level.charAt(0)}
              </span>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Productivity Ninja</h2>
            <div className="flex items-center gap-2 mt-1">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-400">{stats.level}</span>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Level Progress</span>
            <span className="text-xs font-bold text-indigo-400">{stats.points} / {thresholds.max} XP</span>
          </div>
          <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center">
          <div className="text-2xl font-semibold text-white">{stats.bestStreak}</div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Best Streak</div>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center">
          <div className="text-2xl font-semibold text-white">{productivityScore}</div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Productivity Score</div>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-medium text-white">Achievements</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {badges.map(badge => {
            const Icon = badge.icon;
            return (
              <motion.div 
                key={badge.id}
                whileHover={{ scale: 1.02 }}
                className={cn(
                  "p-4 rounded-2xl border backdrop-blur-md transition-all",
                  badge.earned 
                    ? `bg-white/5 ${badge.border}` 
                    : "bg-black/20 border-white/5 opacity-50 grayscale"
                )}
              >
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mb-3", badge.bg)}>
                  <Icon className={cn("w-5 h-5", badge.color)} />
                </div>
                <h4 className="text-sm font-medium text-white">{badge.title}</h4>
                <p className="text-[10px] text-gray-400 mt-1 leading-tight">{badge.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Reset Data Section */}
      <div className="pt-4">
        {!showResetConfirm ? (
          <button 
            onClick={() => setShowResetConfirm(true)}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-rose-500/10 text-rose-500 font-medium hover:bg-rose-500/20 transition-colors border border-rose-500/20"
          >
            <LogOut className="w-5 h-5" />
            Reset All Data
          </button>
        ) : (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-4">
            <p className="text-sm text-rose-500 text-center font-medium">Are you absolutely sure? This cannot be undone.</p>
            <div className="flex gap-3">
              <button 
                onClick={handleReset}
                className="flex-1 py-2 rounded-xl bg-rose-500 text-white text-sm font-bold"
              >
                Yes, Reset
              </button>
              <button 
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 rounded-xl bg-white/10 text-white text-sm font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center pt-8 pb-4">
        <p className="text-xs text-gray-500 tracking-widest uppercase">Made by DANIYAL</p>
      </div>
    </div>
  );
};
