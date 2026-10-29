import React, { useState } from 'react';
import { X, Check, EyeOff, AlertTriangle } from 'lucide-react';
import { CLOAK_PROFILES, applyCloakProfile, getActiveCloakId } from '../utils/cloak.js';
import { playUiSound } from '../utils/audio.js';

export const CloakModal = ({
  isOpen,
  onClose,
  onTriggerPanic,
  panicKey,
  onSetPanicKey,
}) => {
  const [activeId, setActiveId] = useState(getActiveCloakId());
  const [recordingKey, setRecordingKey] = useState(false);

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

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-6 outline-none"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <EyeOff className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-white">
                Tab Cloaking & Stealth Mode
              </h3>
              <p className="text-xs text-slate-400">
                Disguise tab title and icon to blend seamlessly into school or work
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

        {/* Profile Grid */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-semibold text-slate-300">Choose Disguise Profile</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
            {CLOAK_PROFILES.map((profile) => {
              const isSelected = activeId === profile.id;
              return (
                <button
                  key={profile.id}
                  onClick={() => handleSelectProfile(profile.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-sky-500/10 border-sky-500/50 text-white'
                      : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <img src={profile.favicon} alt="" className="w-4 h-4 shrink-0 rounded-sm" />
                    <div className="truncate">
                      <div className="text-xs font-semibold truncate">{profile.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{profile.title}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-sky-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Panic / Boss Key Settings */}
        <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Panic / Boss Key</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Instant emergency toggle that hides games and displays a blank school screen
              </div>
            </div>
            <button
              onClick={() => { playUiSound('click'); setRecordingKey(true); }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-mono text-sky-300 transition-colors"
            >
              {recordingKey ? 'Press any key...' : panicKey}
            </button>
          </div>

          <button
            onClick={() => {
              playUiSound('action');
              onClose();
              onTriggerPanic();
            }}
            className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-lg text-xs font-medium transition-colors text-center"
          >
            Trigger Emergency Disguise Screen Now
          </button>
        </div>

        <div className="flex justify-end pt-2">
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
