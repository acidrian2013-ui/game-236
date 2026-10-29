import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { playUiSound } from '../utils/audio.js';

export const AddGameModal = ({
  isOpen,
  onClose,
  onAddGame,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [description, setDescription] = useState('');
  const [controls, setControls] = useState('');
  const [mode, setMode] = useState('srcdoc');
  const [rawContent, setRawContent] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a game title.');
      return;
    }
    if (!rawContent.trim()) {
      setError('Please provide the game HTML/JS code or iframe URL.');
      return;
    }

    let finalType = mode;
    let finalContent = rawContent.trim();

    // Smart parser if user pasted an <iframe ...> tag
    if (finalContent.startsWith('<iframe') && finalContent.includes('src=')) {
      const srcMatch = finalContent.match(/src=["'](.*?)["']/);
      if (srcMatch && srcMatch[1]) {
        finalType = 'url';
        finalContent = srcMatch[1];
      }
    }

    const newGame = {
      id: 'custom-' + Date.now(),
      title: title.trim(),
      category,
      description: description.trim() || 'Custom user embedded game.',
      instructions: 'Enjoy playing this custom added unblocked game!',
      controls: controls.trim() || 'Keyboard and mouse controls.',
      type: finalType,
      content: finalContent,
      aspectRatio: '16/9',
      plays: 1,
      rating: 5.0,
      isCustom: true,
      addedAt: new Date().toISOString(),
      colorTheme: 'from-sky-500 to-indigo-600'
    };

    playUiSound('action');
    onAddGame(newGame);
    onClose();

    // Reset form
    setTitle('');
    setDescription('');
    setControls('');
    setRawContent('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="font-display font-semibold text-lg text-white">
              Add Game to JSON Library
            </h3>
            <p className="text-xs text-slate-400">
              Embed custom HTML/JS/CSS code or an iframe into your game catalog
            </p>
          </div>
          <button
            onClick={() => { playUiSound('click'); onClose(); }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Game Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Retro Pac Maze"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-white outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-white outline-none"
              >
                <option value="Arcade">Arcade</option>
                <option value="Action">Action</option>
                <option value="Retro">Retro</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Strategy">Strategy</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Embed Type</label>
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => setMode('srcdoc')}
                  className={`py-1 rounded text-center font-medium transition-colors ${
                    mode === 'srcdoc' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  HTML/JS Code
                </button>
                <button
                  type="button"
                  onClick={() => setMode('url')}
                  className={`py-1 rounded text-center font-medium transition-colors ${
                    mode === 'url' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Web URL
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              {mode === 'srcdoc' ? 'Self-Contained HTML/JS/CSS (or iframe tag)' : 'Game URL (iframe src)'} *
            </label>
            <textarea
              value={rawContent}
              onChange={(e) => setRawContent(e.target.value)}
              rows={mode === 'srcdoc' ? 6 : 2}
              placeholder={
                mode === 'srcdoc'
                  ? '<!DOCTYPE html><html><head><style>...</style></head><body><canvas id="game"></canvas><script>...</script></body></html>'
                  : 'https://example.com/games/my-game.html'
              }
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-white font-mono text-[11px] outline-none resize-none leading-relaxed"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Description (Optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of gameplay and theme"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Controls Cheat Sheet (Optional)</label>
            <input
              type="text"
              value={controls}
              onChange={(e) => setControls(e.target.value)}
              placeholder="e.g. Arrow keys to steer · Space to jump"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-white outline-none"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => { playUiSound('click'); onClose(); }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold rounded-lg transition-colors shadow-sm shadow-sky-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Library</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
