import React from 'react'
import { CardData } from '../../data/cards'
import { ActiveCard } from '../../hooks/useGameEngine'

interface GameCardProps {
  card: CardData | ActiveCard;
  isPlayed?: boolean;
  onClick?: () => void;
  playable?: boolean;
  isSelected?: boolean;
  isTargetable?: boolean;
  isEngaged?: boolean;
  canAttack?: boolean;
  isInHand?: boolean;
  size?: 'sm' | 'md';
}

const GameCard: React.FC<GameCardProps> = ({ 
  card, 
  isPlayed, 
  onClick, 
  playable,
  isSelected,
  isTargetable,
  isEngaged,
  canAttack,
  isInHand = false,
  size = 'md'
}) => {
  const isCreature = card.type.includes('Créature') || card.type.includes('Bête');
  const activeCard = 'currentHealth' in card ? card as ActiveCard : null;
  const currentHealth = activeCard ? activeCard.currentHealth : card.def;
  const isWounded = activeCard && activeCard.currentHealth < card.def;
  const healthPercent = card.def > 0 ? (currentHealth / card.def) * 100 : 100;

  const getRarityColor = () => {
    switch (card.rarity) {
      case 'mythic': return { border: '#e9c349', glow: 'rgba(233,195,73,0.6)', bg: 'rgba(233,195,73,0.08)' };
      case 'rare': return { border: '#4edea3', glow: 'rgba(78,222,163,0.5)', bg: 'rgba(78,222,163,0.06)' };
      default: return { border: '#988d9f', glow: 'rgba(152,141,159,0.3)', bg: 'rgba(152,141,159,0.04)' };
    }
  };

  const rarity = getRarityColor();
  const w = size === 'sm' ? 'w-[5.5rem]' : 'w-[6.5rem]';
  const h = size === 'sm' ? 'h-[7.5rem]' : 'h-[9rem]';

  return (
    <div 
      onClick={onClick}
      className={`${w} ${h} rounded-xl relative overflow-hidden transition-all duration-300 select-none
        ${isEngaged ? 'brightness-50 saturate-50' : ''}
        ${playable ? 'cursor-pointer hover:-translate-y-3 hover:z-50' : ''}
        ${isTargetable ? 'cursor-pointer hover:scale-110' : ''}
        ${canAttack && !isEngaged ? 'cursor-pointer hover:-translate-y-1 hover:scale-105' : ''}
        ${isSelected ? 'scale-110 z-50' : ''}
      `}
      style={{
        boxShadow: isSelected 
          ? `0 0 25px rgba(78,222,163,0.9), 0 0 50px rgba(78,222,163,0.4), inset 0 0 20px rgba(78,222,163,0.1)`
          : isTargetable
            ? `0 0 20px rgba(255,84,73,0.7), 0 0 40px rgba(255,84,73,0.3)`
            : canAttack && !isEngaged
              ? `0 0 15px ${rarity.glow}, 0 0 30px rgba(233,195,73,0.2)`
              : playable
                ? `0 0 12px ${rarity.glow}`
                : `0 2px 8px rgba(0,0,0,0.5)`,
      }}
    >
      {/* Card frame background */}
      <div className="absolute inset-0 rounded-xl" style={{
        background: `linear-gradient(135deg, ${rarity.bg}, #0d0b10 40%, ${rarity.bg})`,
        border: `1.5px solid ${isSelected ? '#4edea3' : isTargetable ? '#ff5449' : canAttack && !isEngaged ? rarity.border : 'rgba(152,141,159,0.25)'}`,
        borderRadius: '0.75rem',
      }} />

      {/* Animated glow ring for attackable */}
      {canAttack && !isEngaged && (
        <div className="absolute inset-0 rounded-xl animate-pulse pointer-events-none" style={{
          border: `2px solid ${rarity.border}`,
          boxShadow: `inset 0 0 15px ${rarity.glow}`,
        }} />
      )}

      {/* Targetable pulse */}
      {isTargetable && (
        <div className="absolute inset-0 rounded-xl animate-pulse pointer-events-none z-20"
          style={{ background: 'rgba(255,84,73,0.15)', border: '2px solid rgba(255,84,73,0.8)', borderRadius: '0.75rem' }}
        />
      )}

      {/* Selected ring */}
      {isSelected && (
        <div className="absolute inset-0 rounded-xl pointer-events-none z-20"
          style={{ border: '2.5px solid #4edea3', boxShadow: 'inset 0 0 20px rgba(78,222,163,0.2)', borderRadius: '0.75rem' }}
        />
      )}

      {/* Engaged overlay */}
      {isEngaged && (
        <div className="absolute inset-0 z-30 flex items-center justify-center rounded-xl bg-surface-container-highest dark:bg-black/40">
          <div className="w-8 h-8 rounded-full bg-surface-container-highest dark:bg-black/80 border border-outline/50 flex items-center justify-center">
            <span className="material-symbols-outlined text-outline text-sm">pause</span>
          </div>
        </div>
      )}

      {/* Cost gem - top right */}
      <div className="absolute top-1 right-1 z-20" style={{
        width: '1.3rem', height: '1.3rem',
        background: 'linear-gradient(135deg, #1a1625, #0d0b10)',
        border: '1.5px solid rgba(233,195,73,0.7)',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 6px rgba(233,195,73,0.3)',
      }}>
        <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#e9c349' }}>{card.cost}</span>
      </div>

      {/* Image area */}
      <div className="relative w-full" style={{ height: '52%' }}>
        {card.image ? (
          <img 
            src={card.image} 
            alt={card.title} 
            className="w-full h-full object-cover" 
            style={{ borderRadius: '0.7rem 0.7rem 0 0' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" 
            style={{ background: '#1a1625', borderRadius: '0.7rem 0.7rem 0 0' }}>
            <span className="material-symbols-outlined text-outline/40 text-2xl">image</span>
          </div>
        )}
        {/* Image gradient overlay */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, transparent 50%, #0d0b10 100%)',
        }} />
      </div>

      {/* Info section */}
      <div className="relative z-10 px-1.5 flex-1 flex flex-col justify-between" style={{ marginTop: '-0.5rem' }}>
        <h4 className="text-[9px] font-bold leading-tight text-center line-clamp-2 text-on-surface dark:text-white/90 tracking-wide" 
          title={card.title}>
          {card.title}
        </h4>
        
        {/* Type label */}
        <div className="text-center mt-0.5">
          <span className="text-[7px] uppercase tracking-widest" style={{ color: rarity.border, opacity: 0.8 }}>
            {card.type.split(' - ')[0]}
          </span>
        </div>

        {/* Stats bar for creatures */}
        {isCreature && (
          <div className="flex justify-between items-center w-full px-0.5 mt-auto mb-1">
            {/* ATK */}
            <div className="flex items-center gap-0.5 bg-red-900/40 px-1 py-0.5 rounded" style={{ border: '1px solid rgba(255,84,73,0.3)' }}>
              <span className="material-symbols-outlined text-red-400" style={{ fontSize: '8px' }}>swords</span>
              <span className="text-red-400 font-black" style={{ fontSize: '9px' }}>{card.atk}</span>
            </div>
            {/* DEF/HP */}
            <div className="flex items-center gap-0.5 px-1 py-0.5 rounded relative overflow-hidden"
              style={{ 
                border: `1px solid ${isWounded ? 'rgba(255,84,73,0.5)' : 'rgba(78,222,163,0.3)'}`,
                background: isWounded ? 'rgba(255,84,73,0.15)' : 'rgba(78,222,163,0.15)',
              }}>
              {/* Health bar background */}
              {isPlayed && (
                <div className="absolute inset-0 transition-all duration-500" style={{
                  width: `${healthPercent}%`,
                  background: isWounded 
                    ? 'linear-gradient(90deg, rgba(255,84,73,0.2), rgba(255,84,73,0.1))' 
                    : 'linear-gradient(90deg, rgba(78,222,163,0.2), rgba(78,222,163,0.1))',
                }} />
              )}
              <span className="material-symbols-outlined relative z-10" 
                style={{ fontSize: '8px', color: isWounded ? '#ff5449' : '#4edea3' }}>shield</span>
              <span className="font-black relative z-10" 
                style={{ fontSize: '9px', color: isWounded ? '#ff5449' : '#4edea3' }}>
                {currentHealth}{isPlayed ? '' : `/${card.def}`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Attack ready badge */}
      {canAttack && !isEngaged && (
        <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 z-30 px-2 py-0.5 rounded-b-md"
          style={{ 
            background: 'linear-gradient(180deg, #e9c349, #c4a02e)',
            boxShadow: '0 2px 8px rgba(233,195,73,0.5)',
          }}>
          <span className="text-[7px] font-black text-black uppercase tracking-wider">ATK</span>
        </div>
      )}

      {/* Targetable crosshair */}
      {isTargetable && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
          <span className="material-symbols-outlined text-red-500 text-xl drop-shadow-[0_0_8px_rgba(255,84,73,0.8)]">
            target
          </span>
        </div>
      )}
    </div>
  )
}

export default GameCard
