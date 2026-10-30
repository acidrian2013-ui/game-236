import React, { useState } from 'react';
import { X, Download, Upload, Copy, Check, FileJson } from 'lucide-react';
import { playUiSound } from '../utils/audio.js';

export const JsonModal = ({
  isOpen,
  onClose,
  games,
  onImportGames,
  onClearGames,
}) => {
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState(null);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(games, null, 2);
  const fileSizeKb = (new Blob([jsonString]).size / 1024).toFixed(1);

  const handleCopy = () => {
    playUiSound('action');
    navigator.clipboard?.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    playUiSound('action');
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'games.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].title && parsed[0].content) {
          playUiSound('action');
          onImportGames(parsed);
          setImportStatus(`Successfully loaded ${parsed.length} games from JSON!`);
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          setImportStatus('Invalid JSON schema. Expected array of game objects with content.');
        }
      } catch (err) {
        setImportStatus('Error parsing JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <FileJson className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-white">
                JSON Game Storage Viewer
              </h3>
              <p className="text-xs text-slate-400">
                All unblocked games and iframe contents stored in structured JSON
              </p>
            </div>
          </div>
          <button
            onClick={() => { playUiSound('click'); onClose(); }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 block">Total Games</span>
            <span className="text-lg font-bold text-white font-mono">{games.length}</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 block">Unblocked Iframes</span>
            <span className="text-lg font-bold text-purple-400 font-mono">
              {games.filter(g => g.type === 'url').length}
            </span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 block">File Size</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">{fileSizeKb} KB</span>
          </div>
        </div>

        {importStatus && (
          <div className={`p-2.5 rounded-lg text-xs ${importStatus.includes('Error') || importStatus.includes('Invalid') ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'}`}>
            {importStatus}
          </div>
        )}

        {/* JSON Preview Frame */}
        <div className="flex-1 min-h-[220px] max-h-[300px] bg-slate-950 rounded-xl border border-slate-800 p-3 overflow-auto font-mono text-[11px] text-slate-300 leading-relaxed select-text">
          <pre>{jsonString}</pre>
        </div>

        {/* Actions Deck */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload games.json</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            {games.length > 0 && onClearGames && (
              <button
                type="button"
                onClick={() => {
                  playUiSound('action');
                  onClearGames();
                  setImportStatus('All games removed.');
                  setTimeout(() => setImportStatus(null), 3000);
                }}
                className="px-2.5 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-sky-400 hover:bg-sky-300 text-slate-950 text-xs font-bold rounded-lg transition-colors shadow-sm shadow-sky-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download games.json</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
