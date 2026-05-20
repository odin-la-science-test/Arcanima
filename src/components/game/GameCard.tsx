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
}

const GameCard: React.FC<GameCardProps> = ({ 
  card, 
  isPlayed, 
  onClick, 
  playable,
  isSelected,
  isTargetable,
  isEngaged,
  canAttack
}) => {
  const isCreature = card.type.includes('Créature') || card.type.includes('Bête');
  const activeCard = 'currentHealth' in card ? card as ActiveCard : null;
  const currentHealth = activeCard ? activeCard.currentHealth : card.def;
  const isWounded = activeCard && activeCard.currentHealth < card.def;

  const getBorderClass = () => {
    if (isSelected) return 'border-secondary shadow-[0_0_20px_rgba(78,222,163,0.8)]';
    if (isTargetable) return 'border-error shadow-[0_0_15px_rgba(255,84,73,0.6)] cursor-pointer';
    if (canAttack) return 'border-tertiary shadow-[0_0_10px_rgba(233,195,73,0.5)] cursor-pointer';
    if (isPlayed) return 'border-primary/50 shadow-[0_0_8px_rgba(221,183,255,0.2)]';
    return 'border-outline/50';
  };

  return (
    <div 
      onClick={onClick}
      className={`w-24 h-32 rounded-lg border flex flex-col overflow-hidden bg-surface-container relative transition-all duration-200
        ${getBorderClass()}
        ${isEngaged ? 'opacity-60 grayscale-[50%]' : ''}
        ${playable ? 'cursor-pointer hover:-translate-y-2 hover:shadow-[0_0_15px_rgba(78,222,163,0.5)] hover:border-secondary' : ''}
        ${isTargetable ? 'hover:scale-105 hover:shadow-[0_0_25px_rgba(255,84,73,0.8)]' : ''}
        ${canAttack ? 'hover:-translate-y-1 hover:scale-105' : ''}
      `}
    >
      {/* Cost indicator */}
      <div className="absolute top-1 right-1 w-5 h-5 bg-black/80 rounded-full flex items-center justify-center border border-tertiary text-tertiary text-[10px] font-bold z-10">
        {card.cost}
      </div>
      
      {/* Type badge */}
      <div className="absolute top-1 left-1 bg-black/80 px-1 py-0.5 rounded text-[8px] uppercase tracking-wider text-on-surface z-10 border border-outline/30 max-w-[80%] truncate">
        {card.type.split(' - ')[0]}
      </div>

      {/* Engaged Indicator */}
      {isEngaged && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 rounded-lg">
          <span className="text-outline text-xl font-bold opacity-70">⏸</span>
        </div>
      )}

      {/* Attack-ready indicator */}
      {canAttack && (
        <div className="absolute inset-0 z-5 pointer-events-none rounded-lg border-2 border-tertiary/30">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-tertiary text-black text-[8px] font-bold px-1 rounded uppercase tracking-wider">Attaque!</div>
        </div>
      )}

      {/* Targetable pulse overlay */}
      {isTargetable && (
        <div className="absolute inset-0 z-10 bg-error/20 rounded-lg pointer-events-none animate-pulse"></div>
      )}

      {/* Selected overlay */}
      {isSelected && (
        <div className="absolute inset-0 z-10 bg-secondary/20 rounded-lg pointer-events-none">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-secondary text-black text-[8px] font-bold px-1 rounded uppercase tracking-wider">Sélectionné</div>
        </div>
      )}

      {/* Image */}
      {card.image ? (
        <img src={card.image} alt={card.title} className="w-full h-1/2 object-cover bg-[#1c1822]" />
      ) : (
        <div className="w-full h-1/2 bg-[#1c1822] flex items-center justify-center">
           <span className="material-symbols-outlined text-outline">image</span>
        </div>
      )}
      
      {/* Bottom info */}
      <div className="p-1 flex-1 flex flex-col justify-between bg-gradient-to-t from-black via-surface to-surface/80">
        <h4 className="text-[10px] font-bold leading-tight text-center line-clamp-2 mt-1" title={card.title}>{card.title}</h4>
        
        {isCreature && (
          <div className="flex justify-between w-full px-1 mb-0.5 mt-auto">
            <span className="text-[10px] text-error font-bold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[10px]">swords</span> 
              {card.atk}
            </span>
            <span className={`text-[10px] font-bold flex items-center gap-0.5 ${isWounded ? 'text-error' : 'text-secondary'}`}>
              <span className="material-symbols-outlined text-[10px]">shield</span> 
              {currentHealth}/{card.def}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default GameCard
