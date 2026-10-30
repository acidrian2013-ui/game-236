import React, { useState, useMemo } from 'react';
import {
  Film,
  Play,
  Search,
  PlusCircle,
  ExternalLink,
  RotateCcw,
  Maximize,
  Minimize,
  Tv,
  Star,
  Clock,
  Calendar,
  AlertOctagon,
  X,
  Share2,
  Check,
  ArrowLeft
} from 'lucide-react';
import { playUiSound } from '../utils/audio.js';

export const MoviesView = ({
  movies,
  onAddMovie,
  onBackToGames,
  panicUrl,
  panicKey,
  onTriggerPanic,
}) => {
  const [activeMovie, setActiveMovie] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [isTheater, setIsTheater] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // New movie form state
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newGenre, setNewGenre] = useState('Action');
  const [newYear, setNewYear] = useState('2024');
  const [newDesc, setNewDesc] = useState('');

  const genres = ['All', 'Action', 'Sci-Fi', 'Animation', 'Drama', 'Open Stream'];

  const filteredMovies = useMemo(() => {
    return movies.filter((m) => {
      if (selectedGenre !== 'All') {
        const gLower = selectedGenre.toLowerCase();
        if (!m.genre?.toLowerCase().includes(gLower)) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = m.title?.toLowerCase().includes(q);
        const matchGenre = m.genre?.toLowerCase().includes(q);
        const matchDesc = m.description?.toLowerCase().includes(q);
        return matchTitle || matchGenre || matchDesc;
      }
      return true;
    });
  }, [movies, selectedGenre, searchQuery]);

  const handleOpenAboutBlank = () => {
    if (!activeMovie) return;
    playUiSound('action');
    const win = window.open('about:blank', '_blank');
    if (!win) return;
    const stream = useFallback ? (activeMovie.fallbackUrl || activeMovie.streamUrl) : activeMovie.streamUrl;
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Google Docs - Document Viewer</title>
          <style>html,body{margin:0;padding:0;width:100%;height:100%;overflow:hidden;background:#000;}</style>
        </head>
        <body>
          <iframe src="${stream}" width="100%" height="100%" frameborder="0" allowfullscreen allow="autoplay; fullscreen; encrypted-media"></iframe>
        </body>
      </html>
    `);
    win.document.close();
  };

  const handleToggleFullscreen = () => {
    playUiSound('action');
    const elem = document.getElementById('movie-player-container');
    if (!elem) return;
    if (!document.fullscreenElement) {
      elem.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleCreateMovie = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;
    playUiSound('action');
    const created = {
      id: 'movie-' + Date.now(),
      title: newTitle.trim(),
      year: newYear || '2024',
      rating: '8.5',
      genre: newGenre,
      duration: 'Feature Film',
      image: newImage.trim() || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80',
      description: newDesc.trim() || `Custom stream for ${newTitle.trim()}.`,
      streamUrl: newUrl.trim(),
      fallbackUrl: newUrl.trim()
    };
    onAddMovie(created);
    setActiveMovie(created);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewUrl('');
    setNewImage('');
    setNewDesc('');
  };

  const activeStream = activeMovie
    ? (useFallback ? (activeMovie.fallbackUrl || activeMovie.streamUrl) : activeMovie.streamUrl)
    : '';

  const isDirectVideo = activeStream.endsWith('.mp4') || activeStream.endsWith('.webm');

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-6">
      {/* Back to Games bar */}
      {onBackToGames && (
        <div>
          <button
            onClick={() => { playUiSound('click'); onBackToGames(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 text-purple-300 hover:text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Back to All Games</span>
          </button>
        </div>
      )}

      {/* Header Spotlight */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1a1a2e] via-slate-900 to-[#0a0a0a] border border-purple-500/20 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl flex flex-col gap-2.5">
          <div className="text-xs font-semibold tracking-wider uppercase text-purple-400 flex items-center gap-1.5">
            <Film className="w-4 h-4 text-purple-400" />
            <span>Cinema Lounge &bull; Unblocked Movies &amp; Streams</span>
          </div>

          <h1 className="font-display text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Movies, Shows &amp; Custom Video Streams
          </h1>

          <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
            Stream popular movies, educational films, or embed your own video stream links. Includes stealth theater mode, <span className="font-mono text-purple-300">about:blank</span> pop-out, and instant panic controls.
          </p>

          <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
            <div>
              <strong className="text-white font-semibold">{movies.length}</strong> Titles Ready
            </div>
            <span aria-hidden="true" className="text-slate-700">&bull;</span>
            <div>
              <strong className="text-white font-semibold">1080p HD</strong> Streaming
            </div>
            <span aria-hidden="true" className="text-slate-700">&bull;</span>
            <div>
              <strong className="text-white font-semibold">No Popups</strong>
            </div>
          </div>
        </div>

        <button
          onClick={() => { playUiSound('action'); setIsAddModalOpen(true); }}
          className="relative z-10 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-purple-600/20 flex items-center gap-2 shrink-0 active:scale-95 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Custom Movie</span>
        </button>
      </section>

      {/* Active Movie Theater Screen */}
      {activeMovie && (
        <section 
          id="movie-player-container"
          className={`flex flex-col bg-slate-900 border border-purple-500/30 rounded-2xl overflow-hidden shadow-2xl transition-all ${
            isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : ''
          }`}
        >
          {/* Top Bar */}
          <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 truncate">
              <span className="font-display font-bold text-white text-base truncate">
                {activeMovie.title}
              </span>
              <span className="text-xs text-purple-400 font-mono hidden sm:inline">
                ({activeMovie.year})
              </span>
              <span className="text-xs text-amber-400 flex items-center gap-1 font-semibold">
                <Star className="w-3.5 h-3.5 fill-current" />
                {activeMovie.rating}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setUseFallback(!useFallback)}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                  useFallback ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
                title="Toggle Alternate Player Source"
              >
                {useFallback ? 'Using Backup Stream' : 'Switch Source'}
              </button>

              <button
                onClick={handleOpenAboutBlank}
                title="Pop out in stealth about:blank tab"
                className="p-1.5 hover:bg-slate-800 rounded-md text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pop Out</span>
              </button>

              {!isFullscreen && (
                <button
                  onClick={() => setIsTheater(!isTheater)}
                  className={`p-1.5 hover:bg-slate-800 rounded-md transition-colors flex items-center gap-1 text-xs ${
                    isTheater ? 'text-purple-400' : 'text-slate-300 hover:text-white'
                  }`}
                  title="Theater Mode"
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Theater</span>
                </button>
              )}

              {panicUrl && (
                <a
                  href={panicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    playUiSound('action');
                    onTriggerPanic();
                  }}
                  title={`Panic Button: Opens new tab and disguises this screen (${panicKey})`}
                  className="p-1.5 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 rounded-md transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                >
                  <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">Panic</span>
                </a>
              )}

              <button
                onClick={handleToggleFullscreen}
                className="p-1.5 bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 rounded-md transition-colors flex items-center gap-1 text-xs font-medium"
              >
                {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
                <span>{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
              </button>

              <button
                onClick={() => { playUiSound('click'); setActiveMovie(null); }}
                className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-colors"
                title="Close player"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Video / Iframe Viewport */}
          <div className={`w-full bg-black flex items-center justify-center relative ${
            isFullscreen ? 'flex-1' : isTheater ? 'h-[75vh]' : 'h-[540px]'
          }`}>
            {isDirectVideo ? (
              <video
                key={activeStream}
                src={activeStream}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            ) : (
              <iframe
                key={activeStream}
                src={activeStream}
                title={activeMovie.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
                className="w-full h-full border-none"
              />
            )}
          </div>

          {/* Movie Details Footer */}
          <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-slate-400">
            <div className="max-w-2xl">
              <p className="text-slate-300 leading-relaxed">{activeMovie.description}</p>
              <div className="flex items-center gap-4 mt-2">
                <span>Genre: <strong className="text-white">{activeMovie.genre}</strong></span>
                <span>Duration: <strong className="text-white">{activeMovie.duration || '2h'}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied' : 'Share'}</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Filter & Search Bar */}
      <section className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800/80 rounded-xl overflow-x-auto scrollbar-none">
          {genres.map((g) => {
            const isActive = selectedGenre === g;
            return (
              <button
                key={g}
                onClick={() => { playUiSound('click'); setSelectedGenre(g); }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>

        <div className="relative sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies &amp; shows..."
            className="w-full pl-9 pr-8 py-1.5 bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-colors"
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
      </section>

      {/* Movies Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {filteredMovies.map((movie) => {
          const isSelected = activeMovie?.id === movie.id;
          return (
            <div
              key={movie.id}
              onClick={() => {
                playUiSound('action');
                setActiveMovie(movie);
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
              className={`group relative cursor-pointer bg-slate-900/90 border rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-lg ${
                isSelected
                  ? 'border-purple-500 ring-2 ring-purple-500/30'
                  : 'border-slate-800 hover:border-purple-500/50 hover:shadow-purple-500/10'
              }`}
            >
              {/* Poster Cover */}
              <div className="relative aspect-[2/3] overflow-hidden bg-slate-950">
                <img
                  src={movie.image}
                  alt={movie.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md border border-white/10 text-amber-400 font-bold text-[11px] flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{movie.rating}</span>
                </div>

                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-semibold uppercase text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/30">
                    {movie.year}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all shadow-xl">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Title & Info */}
              <div className="p-3 flex flex-col gap-1">
                <h3 className="font-display font-semibold text-sm text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                  {movie.title}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  {movie.genre}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Add Custom Movie Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateMovie}
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 outline-none"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Film className="w-4 h-4" />
                </div>
                <h3 className="font-display font-semibold text-base text-white">Add Movie / Video Stream</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Movie Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deadpool & Wolverine"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-lg text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Stream URL / Embed Link *</label>
                <input
                  type="url"
                  required
                  placeholder="https://vidsrc.to/embed/movie/533535 or direct .mp4"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-lg text-white font-mono outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Release Year</label>
                  <input
                    type="text"
                    placeholder="2024"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-lg text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Genre</label>
                  <input
                    type="text"
                    placeholder="Action / Sci-Fi"
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-lg text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Poster Image URL (optional)</label>
                <input
                  type="url"
                  placeholder="https://... poster image URL"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-lg text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Brief Synopsis</label>
                <textarea
                  rows={2}
                  placeholder="Brief synopsis or description of the movie"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-lg text-white outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Add to Cinema Lounge
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
