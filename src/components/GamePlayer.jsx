import React, { useRef, useState, useEffect } from 'react';
import {
  Maximize,
  Minimize,
  RotateCcw,
  ExternalLink,
  Heart,
  ArrowLeft,
  Tv,
  HelpCircle,
  ThumbsUp,
  Share2,
  Check
} from 'lucide-react';
import { playUiSound } from '../utils/audio.js';

export const GamePlayer = ({
  game,
  isFavorite,
  onToggleFavorite,
  onBack,
  onSelectNextGame,
  allGames,
}) => {
  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheater, setIsTheater] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [likes, setLikes] = useState(() => {
    const saved = localStorage.getItem(`likes_${game.id}`);
    return saved ? parseInt(saved, 10) : Math.floor((game.plays || 1000) * 0.12);
  });
  const [hasLiked, setHasLiked] = useState(() => {
    return localStorage.getItem(`has_liked_${game.id}`) === 'true';
  });
  const [copiedLink, setCopiedLink] = useState(false);

  // Monitor fullscreen change
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleToggleFullscreen = () => {
    playUiSound('action');
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleReload = () => {
    playUiSound('action');
    setReloadKey(prev => prev + 1);
  };

  const handleLike = () => {
    playUiSound('select');
    if (!hasLiked) {
      const nextLikes = likes + 1;
      setLikes(nextLikes);
      setHasLiked(true);
      localStorage.setItem(`likes_${game.id}`, nextLikes.toString());
      localStorage.setItem(`has_liked_${game.id}`, 'true');
    }
  };

  const handleShare = () => {
    playUiSound('click');
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Open in an unblocked about:blank popup
  const handleOpenAboutBlank = () => {
    playUiSound('action');
    const win = window.open('about:blank', '_blank');
    if (!win) return;
    win.document.title = game.title;
    
    if (game.type === 'srcdoc') {
      win.document.write(game.content);
      win.document.close();
    } else {
      win.document.body.style.margin = '0';
      win.document.body.style.height = '100vh';
      const ifr = win.document.createElement('iframe');
      ifr.style.border = 'none';
      ifr.style.width = '100%';
      ifr.style.height = '100%';
      ifr.src = game.content;
      win.document.body.appendChild(ifr);
    }
  };

  const relatedGames = allGames.filter(g => g.id !== game.id).slice(0, 4);

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 md:px-6 flex flex-col gap-6">
      {/* Top Bar Navigation in Player */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { playUiSound('click'); onBack(); }}
          className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Library</span>
        </button>

        {/* Clean Unboxed Breadcrumb / Category (NO PILLS) */}
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span>{game.category}</span>
          <span aria-hidden="true">·</span>
          <span>{game.type === 'srcdoc' ? 'Native HTML5' : 'External Frame'}</span>
          <span aria-hidden="true">·</span>
          <span className="text-sky-400 font-medium">{game.title}</span>
        </div>
      </div>

      {/* Main Theater Container */}
      <div
        ref={containerRef}
        className={`relative bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
          isTheater ? 'max-w-full' : 'w-full'
        } ${isFullscreen ? 'h-screen rounded-none border-none' : ''}`}
      >
        {/* In-Player Toolbar */}
        <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between text-xs text-slate-300 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white tracking-wide">{game.title}</span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:inline text-slate-400">{game.controls.split('·')[0]}</span>
          </div>

          <div className="flex items-center gap-1.5 md:gap-2">
            <button
              onClick={handleReload}
              title="Restart Game"
              className="p-1.5 hover:bg-slate-800 rounded-md text-slate-300 hover:text-white transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restart</span>
            </button>

            {!isFullscreen && (
              <button
                onClick={() => { playUiSound('click'); setIsTheater(!isTheater); }}
                title={isTheater ? "Normal View" : "Theater Mode"}
                className={`p-1.5 hover:bg-slate-800 rounded-md transition-colors flex items-center gap-1 ${isTheater ? 'text-sky-400' : 'text-slate-300 hover:text-white'}`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Theater</span>
              </button>
            )}

            <button
              onClick={handleOpenAboutBlank}
              title="Open Stealth Tab (about:blank)"
              className="p-1.5 hover:bg-slate-800 rounded-md text-slate-300 hover:text-white transition-colors flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pop Out</span>
            </button>

            <button
              onClick={handleToggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              className="p-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 rounded-md transition-colors flex items-center gap-1 font-medium ml-1"
            >
              {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
              <span>{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
            </button>
          </div>
        </div>

        {/* The Game Iframe Frame */}
        <div className={`w-full relative bg-black flex items-center justify-center ${isFullscreen ? 'flex-1' : isTheater ? 'h-[75vh]' : 'h-[580px]'}`}>
          {game.type === 'srcdoc' ? (
            <iframe
              key={`srcdoc-${game.id}-${reloadKey}`}
              ref={iframeRef}
              title={game.title}
              srcDoc={game.content}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
              className="w-full h-full border-none"
              tabIndex={0}
            />
          ) : (
            <iframe
              key={`url-${game.id}-${reloadKey}`}
              ref={iframeRef}
              title={game.title}
              src={game.content}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              allow="fullscreen"
              className="w-full h-full border-none"
              tabIndex={0}
            />
          )}
        </div>
      </div>

      {/* Game Details & Social Action Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-xl font-bold text-white tracking-tight">
                {game.title}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    hasLiked
                      ? 'bg-sky-500/20 text-sky-300'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
                  <span>{likes.toLocaleString()}</span>
                </button>

                <button
                  onClick={() => onToggleFavorite(game.id)}
                  className={`p-2 rounded-lg text-xs transition-colors ${
                    isFavorite
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Share'}</span>
                </button>
              </div>
            </div>

            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              {game.description}
            </p>
          </div>

          {/* Controls & Instructions Block */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>How to Play & Controls</span>
            </div>
            <div className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-lg border border-slate-800/60 font-mono leading-relaxed">
              <div><strong className="text-slate-200">Controls:</strong> {game.controls}</div>
              <div className="mt-1"><strong className="text-slate-200">Objective:</strong> {game.instructions}</div>
            </div>
          </div>
        </div>

        {/* Up Next / Recommended Side Deck */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 flex flex-col gap-4">
          <h3 className="font-display font-semibold text-sm text-slate-200">
            More Popular Games
          </h3>
          <div className="flex flex-col gap-2.5">
            {relatedGames.map((rel) => (
              <div
                key={rel.id}
                onClick={() => { playUiSound('action'); onSelectNextGame(rel); }}
                className="group cursor-pointer p-2.5 rounded-lg bg-slate-950/50 hover:bg-slate-800/80 border border-slate-800/60 hover:border-sky-500/40 transition-colors flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-xs font-medium text-slate-200 group-hover:text-sky-300 transition-colors line-clamp-1">
                    {rel.title}
                  </h4>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <span>{rel.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>★ {rel.rating || 4.8}</span>
                  </div>
                </div>
                <div className="text-slate-500 group-hover:text-sky-400 transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
