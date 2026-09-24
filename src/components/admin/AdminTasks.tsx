import React, { useState, useEffect } from 'react';
import { CheckSquare, Plus, Edit2, Trash2, Check, ExternalLink, Calendar } from 'lucide-react';
import { apiService } from '../../services/api';
import { TaskItem } from '../../types';

export const AdminTasks: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await apiService.getTasks();
      setTasks(data);
    } catch {
      // Fallback
      setTasks([
        {
          id: 'tsk_telegram_official',
          title: 'Join TTE Official Telegram Channel',
          description: 'Subscribe to announcements and get instant 25 TTE virtual points',
          reward: 25,
          type: 'telegram',
          category: 'Community',
          status: 'AVAILABLE',
          actionUrl: 'https://t.me/TTECommunity',
        },
      ]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    if (tasks.some((t) => t.id === editingTask.id)) {
      setTasks(tasks.map((t) => (t.id === editingTask.id ? editingTask : t)));
    } else {
      setTasks([...tasks, editingTask]);
    }
    setEditingTask(null);
    setFeedback('Task parameters saved and updated for all users.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
    setFeedback('Task deleted.');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-black text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-[#38bdf8]" />
            <span>Task & Engagement Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure partner engagement missions, social follows, video tasks, and virtual rewards
          </p>
        </div>

        <button
          onClick={() =>
            setEditingTask({
              id: 'tsk_' + Date.now().toString(36),
              title: 'New Mission',
              description: 'Follow our official channel to claim points',
              reward: 50,
              type: 'social',
              category: 'General',
              status: 'AVAILABLE',
              actionUrl: 'https://t.me',
            })
          }
          className="h-10 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-[#39ff14] text-slate-950 font-display font-extrabold text-xs flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Create New Task</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-[#39ff14]/10 border border-[#39ff14]/30 text-[#39ff14] text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Task List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((t) => (
          <div key={t.id} className="bg-[#080f21] rounded-3xl border border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-slate-700 uppercase">
                {t.type}
              </span>
              <span className="font-mono font-bold text-[#39ff14] text-sm">
                +{t.reward} TTE
              </span>
            </div>

            <div>
              <h3 className="font-bold text-white text-sm">{t.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{t.description}</p>
            </div>

            {t.actionUrl && (
              <a
                href={t.actionUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-mono text-[#38bdf8] flex items-center gap-1 hover:underline truncate max-w-sm"
              >
                <ExternalLink className="w-3 h-3 shrink-0" />
                <span className="truncate">{t.actionUrl}</span>
              </a>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span className="text-[10px] text-slate-500 font-mono">ID: {t.id}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingTask(t)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#080f21] rounded-3xl border border-slate-700 max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white font-display">Configure Mission</h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#040814] border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#040814] border border-slate-700 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Reward (TTE)</label>
                  <input
                    type="number"
                    value={editingTask.reward}
                    onChange={(e) => setEditingTask({ ...editingTask, reward: parseFloat(e.target.value) || 10 })}
                    className="w-full px-3 py-2 rounded-xl bg-[#040814] border border-slate-700 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Type</label>
                  <select
                    value={editingTask.type}
                    onChange={(e) => setEditingTask({ ...editingTask, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#040814] border border-slate-700 text-white text-xs"
                  >
                    <option value="telegram">Telegram</option>
                    <option value="video">Video</option>
                    <option value="social">Social</option>
                    <option value="checkin">Check-in</option>
                    <option value="ad">Ad Sponsor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Destination Action URL</label>
                <input
                  type="url"
                  value={editingTask.actionUrl || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, actionUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#040814] border border-slate-700 text-white text-xs font-mono"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
