/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  X,
  Gamepad2,
  Flame,
  ArrowRight,
  Film
} from 'lucide-react';
import { DEFAULT_GAMES } from './data/defaultGames.js';
import { DEFAULT_MOVIES } from './data/defaultMovies.js';
import { Navbar } from './components/Navbar.jsx';
import { GameCard } from './components/GameCard.jsx';
import { GamePlayer } from './components/GamePlayer.jsx';
import { MoviesView } from './components/MoviesView.jsx';
import { AddGameModal } from './components/AddGameModal.jsx';
import { JsonModal } from './components/JsonModal.jsx';
import { CloakModal } from './components/CloakModal.jsx';
import { PanicOverlay } from './components/PanicOverlay.jsx';
import { playUiSound, isSoundEnabled, setSoundEnabled } from './utils/audio.js';
import { applyCloakProfile, getActiveCloakId, getPanicUrl, setPanicUrl, openPanicTab } from './utils/cloak.js';

export default function App() {
  // 1. Library State
  const [games, setGames] = useState(() => {
    const savedCustom = localStorage.getItem('unblocked_custom_games');
    if (savedCustom) {
      try {
        const parsed = JSON.parse(savedCustom);
        if (Array.isArray(parsed)) {
          return [...parsed, ...DEFAULT_GAMES];
        }
      } catch (e) {}
    }
    return DEFAULT_GAMES;
  });

  // Fetch games.json if available
  useEffect(() => {
    const jsonUrl = (import.meta.env.BASE_URL || './').replace(/\/$/, '') + '/games.json';
    fetch(jsonUrl)
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((jsonGames) => {
        if (Array.isArray(jsonGames) && jsonGames.length > 0) {
          const savedCustom = localStorage.getItem('unblocked_custom_games');
          const customList = savedCustom ? JSON.parse(savedCustom) : [];
          // Merge custom games on top of fetched json games
          const uniqueIds = new Set(customList.map(g => g.id));
          const filteredDefaults = jsonGames.filter(g => !uniqueIds.has(g.id));
          setGames([...customList, ...filteredDefaults]);
        }
      })
      .catch(() => {
        // Fallback to DEFAULT_GAMES is already loaded
      });
  }, []);

  // 2. Active Screen / Game Player
  const [activeGame, setActiveGame] = useState(null);

  // 3. Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  // 4. Favorites State
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('unblocked_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // 5. Cloaking & Panic State
  const [panicKey, setPanicKey] = useState(() => {
    return localStorage.getItem('unblocked_panic_key') || 'Escape';
  });
  const [panicUrl, setPanicUrlState] = useState(() => getPanicUrl());
  const [isPanicked, setIsPanicked] = useState(false);

  // 6. Navigation View State ('games' | 'movies')
  const [currentView, setCurrentView] = useState('games');
  const [movies, setMovies] = useState(() => {
    const saved = localStorage.getItem('unblocked_custom_movies');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return [...parsed, ...DEFAULT_MOVIES];
        }
      } catch (e) {}
    }
    return DEFAULT_MOVIES;
  });

  // 7. Sound State
  const [isSoundOn, setIsSoundOn] = useState(() => isSoundEnabled());

  // 8. Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isCloakModalOpen, setIsCloakModalOpen] = useState(false);

  const searchInputRef = useRef(null);

  // Initial Cloak Setup
  useEffect(() => {
    const activeCloak = getActiveCloakId();
    applyCloakProfile(activeCloak);
  }, []);

  // Global Keyboard Shortcuts (Panic Key & Quick Search)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Don't trigger shortcuts if user is typing in an input/textarea
      const tag = e.target?.tagName?.toLowerCase();
      const isInput = tag === 'input' || tag === 'textarea';

      // Check panic key
      if (e.code === panicKey) {
        e.preventDefault();
        if (!isPanicked) {
          openPanicTab(panicUrl);
          setIsPanicked(true);
        } else {
          setIsPanicked(false);
        }
        return;
      }

      // Quick search '/' shortcut
      if (e.key === '/' && !isInput && !activeGame) {
        e.preventDefault();
        searchInputRef.current?.focus();
        playUiSound('click');
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [panicKey, panicUrl, isPanicked, activeGame]);

  // Handle Favorites Toggle
  const handleToggleFavorite = (e, id) => {
    if (e) e.stopPropagation();
    playUiSound('select');
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id];
      localStorage.setItem('unblocked_favorites', JSON.stringify(next));
      return next;
    });
  };

  // Handle Add Custom Game
  const handleAddGame = (newGame) => {
    setGames(prev => {
      const updated = [newGame, ...prev];
      const customOnly = updated.filter(g => g.isCustom);
      localStorage.setItem('unblocked_custom_games', JSON.stringify(customOnly));
      return updated;
    });
    setActiveGame(newGame);
  };

  // Handle Import Games from JSON
  const handleImportGames = (imported) => {
    setGames(imported);
    const customOnly = imported.filter(g => g.isCustom);
    localStorage.setItem('unblocked_custom_games', JSON.stringify(customOnly));
    setActiveCategory('All');
  };

  // Handle Clear All Games
  const handleClearGames = () => {
    setGames([]);
    localStorage.removeItem('unblocked_custom_games');
    localStorage.removeItem('unblocked_favorites');
    setFavorites([]);
    setActiveGame(null);
  };

  // Handle Panic
  const handleTriggerPanic = () => {
    setIsPanicked(true);
  };

  const handleSetPanicUrl = (url) => {
    setPanicUrlState(url);
    setPanicUrl(url);
  };

  // Handle Add Custom Movie
  const handleAddMovie = (newMovie) => {
    setMovies(prev => {
      const updated = [newMovie, ...prev];
      const customOnly = updated.filter(m => m.id.startsWith('movie-') && !DEFAULT_MOVIES.some(d => d.id === m.id));
      localStorage.setItem('unblocked_custom_movies', JSON.stringify(customOnly));
      return updated;
    });
  };

  // Handle Sound Toggle
  const handleToggleSound = () => {
    const next = !isSoundOn;
    setIsSoundOn(next);
    setSoundEnabled(next);
    playUiSound('click');
  };

  // Handle Random Game Launcher
  const handleRandomGame = () => {
    if (games.length === 0) return;
    const randomIndex = Math.floor(Math.random() * games.length);
    setActiveGame(games[randomIndex]);
  };

  // Filtered & Sorted Games List
  const filteredGames = useMemo(() => {
    return games
      .filter(game => {
        // Category filtering
        if (activeCategory === 'Favorites') {
          if (!favorites.includes(game.id)) return false;
        } else if (activeCategory !== 'All') {
          const catLower = activeCategory.toLowerCase();
          const matchCat = game.category?.toLowerCase() === catLower;
          const matchTag = Array.isArray(game.tags) && game.tags.some(t => t.toLowerCase() === catLower);
          if (!matchCat && !matchTag) return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = game.title.toLowerCase().includes(q);
          const matchCat = game.category.toLowerCase().includes(q);
          const matchDesc = game.description.toLowerCase().includes(q);
          return matchTitle || matchCat || matchDesc;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'az') return a.title.localeCompare(b.title);
        return (b.plays || 0) - (a.plays || 0);
      });
  }, [games, activeCategory, searchQuery, sortBy, favorites]);

  // Featured Game for the Hero Banner
  const featuredGame = games[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* Panic Emergency Disguise Screen */}
      {isPanicked && (
        <PanicOverlay
          onDismiss={() => setIsPanicked(false)}
          panicKey={panicKey}
          panicUrl={panicUrl}
        />
      )}

      {/* 3-Zone Top Navigation Bar */}
      <Navbar
        currentView={currentView}
        onSelectView={(view) => {
          setCurrentView(view);
          setActiveGame(null);
        }}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setCurrentView('games');
        }}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenJsonModal={() => setIsJsonModalOpen(true)}
        onOpenCloakModal={() => setIsCloakModalOpen(true)}
        onRandomGame={() => {
          setCurrentView('games');
          handleRandomGame();
        }}
        onBackToHome={() => {
          setCurrentView('games');
          setActiveGame(null);
        }}
        activeCategory={activeCategory}
        isSoundOn={isSoundOn}
        onToggleSound={handleToggleSound}
        panicUrl={panicUrl}
        panicKey={panicKey}
        onTriggerPanic={handleTriggerPanic}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {currentView === 'movies' ? (
          <MoviesView
            movies={movies}
            onAddMovie={handleAddMovie}
            onBackToGames={() => setCurrentView('games')}
            panicUrl={panicUrl}
            panicKey={panicKey}
            onTriggerPanic={handleTriggerPanic}
          />
        ) : activeGame ? (
          <GamePlayer
            game={activeGame}
            isFavorite={favorites.includes(activeGame.id)}
            onToggleFavorite={(id) => handleToggleFavorite(null, id)}
            onBack={() => setActiveGame(null)}
            onSelectNextGame={(game) => setActiveGame(game)}
            allGames={games}
            panicUrl={panicUrl}
            panicKey={panicKey}
            onTriggerPanic={handleTriggerPanic}
          />
        ) : (
          <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-8 flex flex-col gap-10">
            {/* Hero / Spotlight Header */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1a1a2e] via-slate-900 to-[#0a0a0a] border border-purple-500/20 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-xl flex flex-col gap-3">
                <div className="text-xs font-semibold tracking-wider uppercase text-purple-400 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Space Arcade &bull; 275+ Games Scraped</span>
                </div>

                <h1 className="font-display text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight text-balance">
                  Over 275+ unblocked games, retro hits &amp; classics.
                </h1>

                <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
                  Every game imported directly from <span className="font-mono text-purple-300">space.prosysaudit.ro</span> with authentic thumbnail covers, high-speed iframe streaming, tab cloaking, and emergency panic button.
                </p>

                {/* Clean unboxed proof metrics (NO PILLS) */}
                <div className="pt-3 flex items-center gap-4 text-xs text-slate-400">
                  <div className="tabular-nums">
                    <strong className="text-white font-semibold">{games.length}</strong> Games Loaded
                  </div>
                  <span aria-hidden="true" className="text-slate-700">&bull;</span>
                  <div>
                    <strong className="text-white font-semibold">100%</strong> Unrestricted
                  </div>
                  <span aria-hidden="true" className="text-slate-700">&bull;</span>
                  <div>
                    <strong className="text-white font-semibold">Instant</strong> Play
                  </div>
                </div>
              </div>

              {/* Quick Launch Card for Featured Title */}
              {featuredGame && (
                <div 
                  onClick={() => { playUiSound('action'); setActiveGame(featuredGame); }}
                  className="relative z-10 w-full md:w-80 bg-slate-950/80 border border-slate-800 hover:border-purple-500/60 rounded-xl p-5 cursor-pointer group transition-all duration-200 shadow-xl"
                >
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Spotlight Title</span>
                    <span className="text-amber-400">★ {featuredGame.rating}</span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-white group-hover:text-purple-300 transition-colors">
                    {featuredGame.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {featuredGame.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400">{featuredGame.category}</span>
                    <span className="text-purple-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Play Now <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              )}
            </section>

            {/* Filter & Search Bar Deck */}
            <section className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Category Segmented Controls (Interactive Functional Buttons) */}
              <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800/80 rounded-xl overflow-x-auto scrollbar-none">
                <button
                  type="button"
                  onClick={() => { playUiSound('click'); setCurrentView('movies'); }}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 text-purple-300 hover:text-white bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <Film className="w-3.5 h-3.5 text-purple-400" />
                  <span>Movies</span>
                </button>
                {['All', 'Popular', 'Multiplayer', 'Arcade', 'Horror', 'Emulator', 'Favorites'].map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => { playUiSound('click'); setActiveCategory(cat); }}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                        isActive
                          ? 'bg-purple-500 text-white font-bold shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      {cat === 'Favorites' ? `Favorites (${favorites.length})` : cat}
                    </button>
                  );
                })}
              </div>

              {/* Search Box & Sort Selection */}
              <div className="flex items-center gap-2.5">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 275+ unblocked games... (Press /)"
                    className="w-full pl-9 pr-8 py-1.5 bg-slate-900 border border-slate-800 focus:border-sky-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => { playUiSound('click'); setSortBy(e.target.value); }}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-800 focus:border-sky-500 rounded-xl text-xs text-slate-300 font-medium outline-none cursor-pointer"
                  >
                    <option value="popular">Most Played</option>
                    <option value="rating">Highest Rated</option>
                    <option value="az">Alphabetical (A-Z)</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Games Grid */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>
                  Showing <strong className="text-slate-200">{filteredGames.length}</strong> {filteredGames.length === 1 ? 'game' : 'games'}
                </span>
                {activeCategory !== 'All' && (
                  <button
                    onClick={() => { playUiSound('click'); setActiveCategory('All'); setSearchQuery(''); }}
                    className="text-sky-400 hover:underline"
                  >
                    Reset filters
                  </button>
                )}
              </div>

              {filteredGames.length === 0 ? (
                <div className="py-16 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl flex flex-col items-center justify-center gap-3">
                  <Gamepad2 className="w-10 h-10 text-slate-600" />
                  <div className="text-base font-semibold text-slate-300">
                    {games.length === 0 ? 'Your game library is empty' : 'No games matched your criteria'}
                  </div>
                  <p className="text-xs text-slate-500 max-w-sm">
                    {games.length === 0
                      ? 'All default games have been removed. Add your custom HTML/JS/CSS game or import a games.json file to get started.'
                      : 'Try adjusting your search terms, choosing a different category, or adding a new game.'}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => { playUiSound('action'); setIsAddModalOpen(true); }}
                      className="px-4 py-2 bg-sky-400 text-slate-950 text-xs font-bold rounded-lg hover:bg-sky-300 transition-colors"
                    >
                      Embed Custom Game
                    </button>
                    <button
                      onClick={() => { playUiSound('click'); setIsJsonModalOpen(true); }}
                      className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      Import games.json
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredGames.map((game) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      isFavorite={favorites.includes(game.id)}
                      onToggleFavorite={(e) => handleToggleFavorite(e, game.id)}
                      onSelectGame={(selected) => setActiveGame(selected)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* Quiet Clean Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-6 px-4 md:px-8 bg-slate-950/80 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-display font-semibold text-slate-300">Nexus Arcade</span>
          <span aria-hidden="true">&bull;</span>
          <span>Self-contained HTML5 &amp; JS Game Hub</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => { playUiSound('click'); setIsCloakModalOpen(true); }}
            className="hover:text-slate-300 transition-colors"
          >
            Tab Cloaking
          </button>
          <span aria-hidden="true">&bull;</span>
          <button
            onClick={() => { playUiSound('click'); setIsJsonModalOpen(true); }}
            className="hover:text-slate-300 transition-colors"
          >
            JSON Schema
          </button>
          <span aria-hidden="true">&bull;</span>
          <button
            onClick={() => { playUiSound('click'); setIsAddModalOpen(true); }}
            className="hover:text-slate-300 transition-colors"
          >
            Embed Game
          </button>
        </div>
      </footer>

      {/* Modals */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddGame}
      />

      <JsonModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        games={games}
        onImportGames={handleImportGames}
        onClearGames={handleClearGames}
      />

      <CloakModal
        isOpen={isCloakModalOpen}
        onClose={() => setIsCloakModalOpen(false)}
        onTriggerPanic={() => setIsPanicked(true)}
        panicKey={panicKey}
        onSetPanicKey={(key) => {
          setPanicKey(key);
          localStorage.setItem('unblocked_panic_key', key);
        }}
        panicUrl={panicUrl}
        onSetPanicUrl={handleSetPanicUrl}
      />
    </div>
  );
}
