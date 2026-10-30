import React from 'react';
import { Gamepad2, Shuffle, ShieldAlert, Code2, PlusCircle, Volume2, VolumeX, AlertOctagon } from 'lucide-react';
import { playUiSound } from '../utils/audio.js';

export const Navbar = ({
  onSelectCategory,
  onOpenAddModal,
  onOpenJsonModal,
  onOpenCloakModal,
  onRandomGame,
  onBackToHome,
  activeCategory,
  isSoundOn,
  onToggleSound,
  panicUrl,
  panicKey,
  onTriggerPanic,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between gap-8">
      {/* Zone 1: Single text element wordmark */}
      <div 
        onClick={() => { playUiSound('click'); onBackToHome(); }}
        className="cursor-pointer flex items-center gap-2.5 whitespace-nowrap shrink-0 group"
      >
        <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:border-purple-400 transition-colors">
          <Gamepad2 className="w-4 h-4" />
        </div>
        <span className="font-display text-lg font-bold tracking-tight text-white group-hover:text-purple-300 transition-colors">
          Nexus Space
        </span>
      </div>

      {/* Zone 2: 4–5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={() => { playUiSound('click'); onSelectCategory('All'); onBackToHome(); }}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${activeCategory === 'All' ? 'text-sky-400' : ''}`}
        >
          All Games
        </button>
        <button
          onClick={() => { playUiSound('click'); onSelectCategory('Favorites'); }}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${activeCategory === 'Favorites' ? 'text-sky-400' : ''}`}
        >
          Favorites
        </button>
        <button
          onClick={() => { playUiSound('click'); onOpenAddModal(); }}
          className="flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0 text-slate-300"
        >
          <PlusCircle className="w-3.5 h-3.5 text-sky-400" />
          <span>Add Game</span>
        </button>
        <button
          onClick={() => { playUiSound('click'); onOpenJsonModal(); }}
          className="flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0 text-slate-300"
        >
          <Code2 className="w-3.5 h-3.5 text-sky-400" />
          <span>JSON Library</span>
        </button>
        <button
          onClick={() => { playUiSound('click'); onOpenCloakModal(); }}
          className="flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0 text-slate-300"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>Tab Cloaking</span>
        </button>
      </nav>

      {/* Zone 3: Actions + Panic Button */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        <a
          href={panicUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            playUiSound('action');
            onTriggerPanic();
          }}
          title={`Panic: Open in new tab and disguise this page (${panicKey})`}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-rose-500/10 active:scale-95 cursor-pointer"
        >
          <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
          <span>Panic (New Tab)</span>
        </a>

        <button
          onClick={onToggleSound}
          title={isSoundOn ? 'Mute Sound FX' : 'Enable Sound FX'}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
          aria-label="Toggle Sound"
        >
          {isSoundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        <button
          onClick={() => { playUiSound('action'); onRandomGame(); }}
          className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-sky-500/20 active:scale-95"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Random</span>
        </button>
      </div>
    </header>
  );
};
