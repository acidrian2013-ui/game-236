import React, { useState } from 'react';
import { X, Check, EyeOff, AlertTriangle, ExternalLink, Globe } from 'lucide-react';
import { CLOAK_PROFILES, PANIC_PRESETS, applyCloakProfile, getActiveCloakId } from '../utils/cloak.js';
import { playUiSound } from '../utils/audio.js';

export const CloakModal = ({
  isOpen,
  onClose,
  onTriggerPanic,
  panicKey,
  onSetPanicKey,
  panicUrl,
  onSetPanicUrl,
}) => {
  const [activeId, setActiveId] = useState(getActiveCloakId());
  const [recordingKey, setRecordingKey] = useState(false);
  const [customUrl, setCustomUrl] = useState(panicUrl || 'https://classroom.google.com');

  if (!isOpen) return null;

  const handleSelectProfile = (id) => {
    playUiSound('select');
    setActiveId(id);
    applyCloakProfile(id);
  };

  const handleKeyDown = (e) => {
    if (recordingKey) {
      e.preventDefault();
      onSetPanicKey(e.code);
      setRecordingKey(false);
      playUiSound('action');
    }
  };

  const handleUrlSelect = (url) => {
    playUiSound('select');
    setCustomUrl(url);
    onSetPanicUrl(url);
  };

  const handleCustomUrlChange = (e) => {
    const val = e.target.value;
    setCustomUrl(val);
    onSetPanicUrl(val);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 outline-none max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <EyeOff className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-white">
                Tab Cloaking &amp; Panic Button
              </h3>
              <p className="text-xs text-slate-400">
                Disguise tab favicon/title and configure your instant new-tab panic button
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

        {/* Tab Cloaking Profiles */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-slate-300">Tab Cloaking Profile (Title &amp; Favicon)</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {CLOAK_PROFILES.map((profile) => {
              const isSelected = activeId === profile.id;
              return (
                <button
                  key={profile.id}
                  onClick={() => handleSelectProfile(profile.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-sky-500/10 border-sky-500/50 text-white'
                      : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <img src={profile.favicon} alt="" className="w-4 h-4 shrink-0 rounded-sm" />
                    <div className="truncate">
                      <div className="text-xs font-semibold truncate">{profile.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{profile.title}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-sky-400 shrink-0 ml-1.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Panic Button & New Tab Destination Settings */}
        <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col gap-3.5">
          <div>
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Panic Button: New Tab Destination</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Select or type the safe educational website that opens in a new tab when you trigger Panic.
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {PANIC_PRESETS.map((p) => {
              const isCurrent = customUrl === p.url;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleUrlSelect(p.url)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left truncate transition-colors ${
                    isCurrent
                      ? 'bg-rose-500/15 border-rose-500/50 text-rose-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  {p.name}
                </button>
              );
            })}
          </div>

          {/* Custom URL Input */}
          <div className="relative">
            <Globe className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              value={customUrl}
              onChange={handleCustomUrlChange}
              placeholder="https://classroom.google.com"
              className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 focus:border-rose-500 rounded-lg text-xs text-white placeholder-slate-500 outline-none font-mono"
            />
          </div>

          {/* Panic Key Settings */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-200">Panic Keyboard Shortcut</span>
              <span className="block text-[11px] text-slate-400">Pressing this key triggers panic immediately</span>
            </div>
            <button
              onClick={() => { playUiSound('click'); setRecordingKey(true); }}
              className="px-3 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-700 rounded-lg text-xs font-mono text-rose-300 transition-colors"
            >
              {recordingKey ? 'Press any key...' : panicKey}
            </button>
          </div>

          {/* Test / Launch Panic Now */}
          <a
            href={customUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              playUiSound('action');
              onClose();
              onTriggerPanic();
            }}
            className="w-full py-2 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-rose-500/10"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Test Panic Button (Opens New Tab &amp; Disguises App)</span>
          </a>
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={() => { playUiSound('click'); onClose(); }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
