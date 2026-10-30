import React, { useState } from 'react';
import {
  Gamepad2,
  Shuffle,
  ShieldAlert,
  Code2,
  PlusCircle,
  Volume2,
  VolumeX,
  AlertOctagon,
  Film,
  Menu,
  X
} from 'lucide-react';
import { playUiSound } from '../utils/audio.js';

export const Navbar = ({
  currentView = 'games',
  onSelectView,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark & Always-Visible Games / Movies Switcher */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => {
              playUiSound('click');
              onSelectView('games');
              onBackToHome();
            }}
            className="cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:border-purple-400 transition-colors">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <span className="font-display text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-purple-300 transition-colors">
              Nexus Space
            </span>
          </div>

          {/* Always Visible Games & Movies View Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => {
                playUiSound('click');
                onSelectView('games');
                onBackToHome();
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                currentView === 'games'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Games</span>
            </button>
            <button
              onClick={() => {
                playUiSound('click');
                onSelectView('movies');
                onBackToHome();
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                currentView === 'movies'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Movies</span>
            </button>
          </div>
        </div>

        {/* Zone 2: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-slate-300">
          <button
            onClick={() => {
              playUiSound('click');
              onSelectView('games');
              onSelectCategory('All');
              onBackToHome();
            }}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'games' && activeCategory === 'All' ? 'text-purple-400 font-semibold' : ''
            }`}
          >
            All Games
          </button>
          <button
            onClick={() => {
              playUiSound('click');
              onSelectView('movies');
              onBackToHome();
            }}
            className={`flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'movies' ? 'text-purple-400 font-semibold' : ''
            }`}
          >
            <Film className="w-3.5 h-3.5 text-purple-400" />
            <span>Movies</span>
          </button>
          <button
            onClick={() => {
              playUiSound('click');
              onSelectView('games');
              onSelectCategory('Favorites');
            }}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'games' && activeCategory === 'Favorites' ? 'text-purple-400 font-semibold' : ''
            }`}
          >
            Favorites
          </button>
          <button
            onClick={() => { playUiSound('click'); onOpenAddModal(); }}
            className="flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0 text-slate-300"
          >
            <PlusCircle className="w-3.5 h-3.5 text-purple-400" />
            <span>Add Game</span>
          </button>
          <button
            onClick={() => { playUiSound('click'); onOpenJsonModal(); }}
            className="flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0 text-slate-300"
          >
            <Code2 className="w-3.5 h-3.5 text-purple-400" />
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

        {/* Zone 3: Actions + Panic Button + Mobile Menu Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={panicUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              playUiSound('action');
              onTriggerPanic();
            }}
            title={`Panic: Open in new tab and disguise this page (${panicKey})`}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-rose-500/10 active:scale-95 cursor-pointer"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
            <span>Panic (New Tab)</span>
          </a>

          <button
            onClick={onToggleSound}
            title={isSoundOn ? 'Mute Sound FX' : 'Enable Sound FX'}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
            aria-label="Toggle Sound"
          >
            {isSoundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={() => {
              playUiSound('action');
              onSelectView('games');
              onRandomGame();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-purple-400 hover:bg-purple-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-purple-500/20 active:scale-95"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Random</span>
          </button>

          {/* Mobile menu hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-slate-800 flex flex-col gap-2 text-xs font-medium text-slate-300">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-800/60">
            <button
              onClick={() => {
                playUiSound('click');
                onSelectView('games');
                onSelectCategory('All');
                onBackToHome();
                setMobileMenuOpen(false);
              }}
              className={`p-2 rounded-lg text-left font-semibold flex items-center gap-2 ${
                currentView === 'games' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'bg-slate-900 text-slate-300'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>All Games</span>
            </button>
            <button
              onClick={() => {
                playUiSound('click');
                onSelectView('movies');
                onBackToHome();
                setMobileMenuOpen(false);
              }}
              className={`p-2 rounded-lg text-left font-semibold flex items-center gap-2 ${
                currentView === 'movies' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'bg-slate-900 text-slate-300'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Movies Lounge</span>
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <button
              onClick={() => {
                playUiSound('click');
                onSelectView('games');
                onSelectCategory('Favorites');
                setMobileMenuOpen(false);
              }}
              className="py-1.5 px-2 hover:bg-slate-900 rounded-lg text-left"
            >
              Favorites ({activeCategory === 'Favorites' ? 'Active' : 'View'})
            </button>
            <button
              onClick={() => {
                playUiSound('click');
                onOpenAddModal();
                setMobileMenuOpen(false);
              }}
              className="py-1.5 px-2 hover:bg-slate-900 rounded-lg text-left flex items-center gap-2 text-purple-400"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Custom Game</span>
            </button>
            <button
              onClick={() => {
                playUiSound('click');
                onOpenJsonModal();
                setMobileMenuOpen(false);
              }}
              className="py-1.5 px-2 hover:bg-slate-900 rounded-lg text-left flex items-center gap-2 text-purple-400"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>JSON Library Manager</span>
            </button>
            <button
              onClick={() => {
                playUiSound('click');
                onOpenCloakModal();
                setMobileMenuOpen(false);
              }}
              className="py-1.5 px-2 hover:bg-slate-900 rounded-lg text-left flex items-center gap-2 text-amber-400"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Tab Cloaking &amp; Panic Key</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
