import React from 'react';
import { Play, Heart, Layers } from 'lucide-react';
import { playUiSound } from '../utils/audio.js';

export const GameCard = ({
  game,
  isFavorite,
  onToggleFavorite,
  onSelectGame,
}) => {
  return (
    <div
      onClick={() => {
        playUiSound('action');
        onSelectGame(game);
      }}
      className="group relative cursor-pointer bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/50 rounded-xl overflow-hidden transition-all duration-200 flex flex-col justify-between"
    >
      {/* Banner / Graphic Area */}
      <div className={`relative h-36 bg-gradient-to-br ${game.colorTheme || 'from-slate-800 to-slate-900'} p-4 flex flex-col justify-between overflow-hidden border-b border-slate-800/60`}>
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between">
          <span className="text-xs font-semibold tracking-wider uppercase text-white/90">
            {game.category}
          </span>
          <button
            onClick={(e) => onToggleFavorite(e, game.id)}
            aria-label={isFavorite ? "Remove favorite" : "Add to favorites"}
            className={`p-2 rounded-lg backdrop-blur-sm transition-colors ${
              isFavorite
                ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                : 'bg-black/30 text-white/70 hover:text-white hover:bg-black/50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-white/80 font-mono tabular-nums">
            <Layers className="w-3.5 h-3.5" />
            <span>{game.type === 'srcdoc' ? 'Embedded JS' : 'Web Frame'}</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-white text-slate-950 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-200 shadow-lg">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <h3 className="font-display font-semibold text-base text-white group-hover:text-sky-300 transition-colors line-clamp-1">
            {game.title}
          </h3>
          <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Clean Unboxed Metadata with Typographic Separator (NO PILLS) */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 tabular-nums">
            <span>{(game.plays || 12000).toLocaleString()} plays</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>★ {game.rating || 4.8}</span>
          </div>
          {game.isCustom && (
            <span className="text-amber-400 font-medium">Custom</span>
          )}
        </div>
      </div>
    </div>
  );
};
