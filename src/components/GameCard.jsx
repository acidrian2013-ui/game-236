import React, { useState } from 'react';
import { Play, Heart, Layers } from 'lucide-react';
import { playUiSound } from '../utils/audio.js';

export const GameCard = ({
  game,
  isFavorite,
  onToggleFavorite,
  onSelectGame,
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div
      onClick={() => {
        playUiSound('action');
        onSelectGame(game);
      }}
      className="group relative cursor-pointer bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-xl overflow-hidden transition-all duration-200 flex flex-col justify-between shadow-lg hover:shadow-purple-500/10"
    >
      {/* Banner / Graphic Area */}
      <div className={`relative h-40 bg-gradient-to-br ${game.colorTheme || 'from-indigo-600 via-purple-600 to-slate-900'} p-3.5 flex flex-col justify-between overflow-hidden border-b border-slate-800/80`}>
        {/* Real Thumbnail Image if provided */}
        {game.image && !imgFailed ? (
          <img
            src={game.image}
            alt={game.title}
            loading="lazy"
            decoding="async"
            onError={() => setImgFailed(true)}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
        )}

        {/* Gradient shadow overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30 pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-white/95 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10">
            {game.category}
          </span>
          <button
            onClick={(e) => onToggleFavorite(e, game.id)}
            aria-label={isFavorite ? "Remove favorite" : "Add to favorites"}
            className={`p-2 rounded-lg backdrop-blur-md transition-colors ${
              isFavorite
                ? 'bg-rose-500/30 text-rose-400 hover:bg-rose-500/40'
                : 'bg-black/50 text-white/70 hover:text-white hover:bg-black/70'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-white/90 font-mono tabular-nums bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
            <Layers className="w-3 h-3 text-purple-400" />
            <span>{game.type === 'srcdoc' ? 'HTML5' : 'Unblocked'}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-white text-slate-950 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-200 shadow-xl">
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <h3 className="font-display font-semibold text-base text-white group-hover:text-purple-300 transition-colors line-clamp-1">
            {game.title}
          </h3>
          <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Clean Unboxed Metadata with Typographic Separator */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 tabular-nums">
            <span>{(game.plays || 18000).toLocaleString()} plays</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-amber-400 font-medium">★ {game.rating || 4.8}</span>
          </div>
          {game.tags && game.tags.length > 1 && (
            <span className="text-[11px] text-purple-400 font-medium capitalize">
              {game.tags.find(t => t !== 'all') || 'Arcade'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
