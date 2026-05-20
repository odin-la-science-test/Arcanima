import React from 'react'
import GameCard from './GameCard'
import { PlayerState } from '../../hooks/useGameEngine'

interface PlayerZoneProps {
  isOpponent?: boolean;
  state: PlayerState;
  onPlayCard?: (index: number) => void;
  onCardClick?: (slotIndex: number) => void;
  onAttackGod?: () => void;
  selectedSlot?: number | null;
  isTargetMode?: boolean;
}

const PlayerZone: React.FC<PlayerZoneProps> = ({ 
  isOpponent = false, 
  state, 
  onPlayCard, 
  onCardClick,
  onAttackGod,
  selectedSlot,
  isTargetMode = false
}) => {
  const energyArray = Array.from({ length: 10 }, (_, i) => i < state.energy);
  const maxEnergyArray = Array.from({ length: 10 }, (_, i) => i < state.maxEnergy);
  const healthPercent = Math.max(0, (state.health / 1200) * 100);
  const isLowHealth = state.health <= 400;
  const isCriticalHealth = state.health <= 200;

  return (
    <div className={`w-full max-w-[1300px] flex gap-3 ${isOpponent ? 'flex-row-reverse' : 'flex-row'}`}
      style={{ height: isOpponent ? '280px' : '340px' }}>
      
      {/* Left Column: Deck, Discard, Limbo */}
      <div className="w-[7rem] flex flex-col gap-2 py-1 shrink-0">
        {/* Deck */}
        <div className="flex-1 flex flex-col items-center justify-center relative group">
          <div className="absolute -top-0 left-0 right-0 flex justify-center z-10">
            <span className="text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded-b"
              style={{ background: 'rgba(233,195,73,0.15)', color: '#e9c349', border: '1px solid rgba(233,195,73,0.2)', borderTop: 'none' }}>
              Pioche
            </span>
          </div>
          <div className={`w-[5rem] h-[6.5rem] rounded-xl flex items-center justify-center relative overflow-hidden transition-all
            ${state.deck.length === 0 ? 'opacity-30' : 'group-hover:shadow-[0_0_15px_rgba(233,195,73,0.2)]'}`}
            style={{
              background: 'linear-gradient(145deg, #1a1625 0%, #0d0b10 50%, #1a1625 100%)',
              border: '1.5px solid rgba(233,195,73,0.3)',
            }}>
            {/* Card back pattern */}
            <div className="absolute inset-2 rounded-lg opacity-30" style={{
              background: `repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(233,195,73,0.08) 4px, rgba(233,195,73,0.08) 5px)`,
              border: '1px solid rgba(233,195,73,0.15)',
            }} />
            <div className="relative flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-2xl" style={{ color: '#e9c349', opacity: 0.7 }}>style</span>
              <span className="text-sm font-black" style={{ color: '#e9c349' }}>{state.deck.length}</span>
            </div>
          </div>
        </div>

        {/* Discard */}
        <div className="flex-1 flex flex-col items-center justify-center relative group">
          <div className="w-[5rem] h-[5.5rem] rounded-xl flex items-center justify-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #1a1215 0%, #0d0b10 100%)',
              border: '1.5px solid rgba(255,84,73,0.2)',
            }}>
            {state.discard.length > 0 ? (
              <>
                <img src={state.discard[state.discard.length - 1].image} 
                  className="absolute inset-0 w-full h-full object-cover opacity-25 rounded-xl" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent rounded-xl" />
              </>
            ) : null}
            <div className="relative flex flex-col items-center gap-0.5">
              <span className="material-symbols-outlined text-lg" style={{ color: 'rgba(255,84,73,0.5)' }}>delete</span>
              <span className="text-[10px] font-bold" style={{ color: 'rgba(255,84,73,0.7)' }}>{state.discard.length}</span>
            </div>
          </div>
          <span className="text-[8px] font-bold tracking-[0.12em] uppercase mt-1" style={{ color: 'rgba(255,84,73,0.5)' }}>
            Défausse
          </span>
        </div>

        {/* Limbo */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-[5rem] h-[3.5rem] rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(145deg, #15121a 0%, #0d0b10 100%)',
              border: '1px solid rgba(221,183,255,0.15)',
            }}>
            <span className="material-symbols-outlined text-sm" style={{ color: 'rgba(221,183,255,0.4)' }}>cyclone</span>
            <span className="text-[10px] font-bold ml-1" style={{ color: 'rgba(221,183,255,0.5)' }}>{state.limbo.length}</span>
          </div>
          <span className="text-[7px] font-bold tracking-[0.12em] uppercase mt-0.5" style={{ color: 'rgba(221,183,255,0.4)' }}>
            Limbes
          </span>
        </div>
      </div>

      {/* Center Column: Battlefield + Hand */}
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        
        {/* Battlefield */}
        <div className="flex-1 rounded-2xl relative overflow-hidden flex items-center justify-center gap-2 px-4"
          style={{
            background: 'linear-gradient(180deg, rgba(13,11,16,0.6) 0%, rgba(26,22,37,0.4) 50%, rgba(13,11,16,0.6) 100%)',
            border: '1px solid rgba(152,141,159,0.12)',
            backdropFilter: 'blur(8px)',
          }}>
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(circle, rgba(221,183,255,0.8) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }} />
          
          {/* Label */}
          <div className="absolute top-2 left-4 flex items-center gap-1.5 z-10">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: isOpponent ? '#ff5449' : '#4edea3' }} />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em]" 
              style={{ color: isOpponent ? 'rgba(255,84,73,0.5)' : 'rgba(78,222,163,0.5)' }}>
              {isOpponent ? 'Zone Adverse' : 'Votre Zone'}
            </span>
          </div>

          {/* Board slots */}
          <div className="relative z-10 flex items-center justify-center gap-2">
            {state.board.map((card, index) => (
              card ? (
                <GameCard 
                  key={`board-${index}`} 
                  card={card} 
                  isPlayed={true}
                  isSelected={!isOpponent && selectedSlot === index}
                  isTargetable={isOpponent && isTargetMode}
                  isEngaged={card.isEngaged}
                  canAttack={!isOpponent && card.canAttack && !card.isEngaged}
                  onClick={() => onCardClick?.(index)}
                  size="sm"
                />
              ) : (
                <div key={`empty-${index}`} 
                  className="w-[5.5rem] h-[7.5rem] rounded-xl flex items-center justify-center transition-all"
                  style={{
                    border: '2px dashed rgba(152,141,159,0.12)',
                    background: 'rgba(152,141,159,0.02)',
                  }}>
                  <span className="text-[10px] font-bold" style={{ color: 'rgba(152,141,159,0.15)' }}>{index + 1}</span>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Hand Row (only for player) */}
        {!isOpponent && (
          <div className="h-[9.5rem] rounded-2xl relative overflow-visible flex items-end justify-center pb-1 px-4"
            style={{
              background: 'linear-gradient(180deg, rgba(13,11,16,0.3) 0%, rgba(26,22,37,0.5) 100%)',
              border: '1px solid rgba(152,141,159,0.08)',
            }}>
            {/* Hand label */}
            <div className="absolute top-2 left-4 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xs" style={{ color: 'rgba(221,183,255,0.3)' }}>back_hand</span>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(221,183,255,0.3)' }}>
                Main ({state.hand.length})
              </span>
            </div>
            
            <div className="flex items-end justify-center" style={{ perspective: '800px' }}>
              {state.hand.map((card, index) => {
                const isPlayable = state.energy >= card.cost && !isTargetMode;
                const total = state.hand.length;
                const mid = (total - 1) / 2;
                const offset = index - mid;
                const rotation = offset * 3;
                const translateY = Math.abs(offset) * 4;

                return (
                  <div 
                    key={`hand-${card.id}-${index}`}
                    className="transition-all duration-300 hover:-translate-y-5 hover:!rotate-0 hover:z-50 relative"
                    style={{ 
                      marginLeft: index > 0 ? '-1rem' : '0',
                      transform: `rotate(${rotation}deg) translateY(${translateY}px)`,
                      zIndex: index,
                    }}
                  >
                    <GameCard 
                      card={card} 
                      playable={isPlayable}
                      isInHand={true}
                      onClick={() => isPlayable ? onPlayCard?.(index) : undefined}
                    />
                    {/* Unplayable cost indicator */}
                    {!isPlayable && !isTargetMode && (
                      <div className="absolute inset-0 rounded-xl bg-surface-container-highest dark:bg-black/40 flex items-center justify-center pointer-events-none z-40">
                        <span className="material-symbols-outlined text-red-500/60 text-lg">block</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: God, Terrain, Energy */}
      <div className="w-[11rem] flex gap-2 shrink-0">
        {/* God + Terrain */}
        <div className="w-[7rem] flex flex-col gap-2">
          {/* God card */}
          <div 
            onClick={isOpponent && isTargetMode && onAttackGod ? onAttackGod : undefined}
            className={`flex-1 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center transition-all ${
              isOpponent && isTargetMode ? 'cursor-pointer' : ''
            }`}
            style={{
              background: 'linear-gradient(145deg, #1a1625 0%, #0d0b10 50%, #1a1625 100%)',
              border: isOpponent && isTargetMode 
                ? '2px solid rgba(255,84,73,0.8)' 
                : isCriticalHealth 
                  ? '1.5px solid rgba(255,84,73,0.6)' 
                  : '1.5px solid rgba(221,183,255,0.25)',
              boxShadow: isOpponent && isTargetMode
                ? '0 0 25px rgba(255,84,73,0.4), inset 0 0 20px rgba(255,84,73,0.1)'
                : isCriticalHealth
                  ? '0 0 20px rgba(255,84,73,0.3)'
                  : '0 0 15px rgba(221,183,255,0.1)',
            }}
          >
            {/* God background */}
            <div className="absolute inset-0 opacity-30" style={{
              background: `radial-gradient(ellipse at center, ${isOpponent ? 'rgba(255,84,73,0.15)' : 'rgba(221,183,255,0.15)'} 0%, transparent 70%)`,
            }} />

            {/* Target overlay */}
            {isOpponent && isTargetMode && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-red-500/10 animate-pulse rounded-2xl">
                <span className="material-symbols-outlined text-red-500 text-4xl drop-shadow-[0_0_15px_rgba(255,84,73,0.8)]">
                  target
                </span>
              </div>
            )}

            {/* God label */}
            <div className="absolute top-2 z-20 px-2 py-0.5 rounded-full"
              style={{ 
                background: 'rgba(0,0,0,0.7)', 
                border: '1px solid rgba(221,183,255,0.3)',
              }}>
              <span className="text-[8px] font-bold uppercase tracking-[0.2em]" style={{ color: '#ddb7ff' }}>
                {isOpponent ? '⚔ Dieu Adverse' : '🛡 Votre Dieu'}
              </span>
            </div>

            {/* God icon */}
            <div className="relative z-10 mt-2">
              <span className="material-symbols-outlined text-5xl"
                style={{ 
                  color: isOpponent ? 'rgba(255,84,73,0.6)' : 'rgba(221,183,255,0.5)',
                  filter: `drop-shadow(0 0 10px ${isOpponent ? 'rgba(255,84,73,0.4)' : 'rgba(221,183,255,0.3)'})`
                }}>
                {isOpponent ? 'skull' : 'shield_with_heart'}
              </span>
            </div>

            {/* Health display */}
            <div className="relative z-10 mt-2 w-full px-3">
              {/* HP number */}
              <div className="text-center mb-1">
                <span className={`text-xl font-black tabular-nums ${
                  isCriticalHealth ? 'text-red-400 animate-pulse' : isLowHealth ? 'text-orange-400' : 'text-emerald-400'
                }`}>
                  {state.health}
                </span>
                <span className="text-[10px] text-on-surface dark:text-white/30 ml-0.5">PV</span>
              </div>
              {/* Health bar */}
              <div className="w-full h-2 rounded-full overflow-hidden relative"
                style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(152,141,159,0.15)' }}>
                <div className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${healthPercent}%`,
                    background: isCriticalHealth 
                      ? 'linear-gradient(90deg, #ef4444, #f87171)'
                      : isLowHealth 
                        ? 'linear-gradient(90deg, #f97316, #fb923c)' 
                        : 'linear-gradient(90deg, #10b981, #34d399)',
                    boxShadow: `0 0 8px ${isCriticalHealth ? 'rgba(239,68,68,0.5)' : isLowHealth ? 'rgba(249,115,22,0.5)' : 'rgba(16,185,129,0.5)'}`,
                  }} />
              </div>
            </div>
          </div>

          {/* Terrain slot */}
          <div className="h-[5rem] rounded-xl flex flex-col items-center justify-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #12151a 0%, #0d0b10 100%)',
              border: '1px solid rgba(78,222,163,0.15)',
            }}>
            <span className="text-[8px] font-bold uppercase tracking-[0.15em] absolute top-1.5"
              style={{ color: 'rgba(78,222,163,0.4)' }}>
              Terrain
            </span>
            {state.terrain ? (
              <>
                <img src={state.terrain.image} className="absolute inset-0 w-full h-full object-cover opacity-40 rounded-xl" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <span className="relative z-10 text-[9px] font-bold text-emerald-300 mt-3 text-center px-1 line-clamp-2">
                  {state.terrain.title}
                </span>
              </>
            ) : (
              <span className="material-symbols-outlined text-lg mt-2" style={{ color: 'rgba(78,222,163,0.2)' }}>landscape</span>
            )}
          </div>
        </div>

        {/* Energy column */}
        <div className="w-[3.5rem] rounded-2xl flex flex-col items-center py-2 gap-0.5 relative overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(233,195,73,0.03) 0%, rgba(13,11,16,0.8) 50%, rgba(233,195,73,0.03) 100%)',
            border: '1px solid rgba(233,195,73,0.12)',
          }}>
          {/* Energy label */}
          <span className="text-[7px] font-bold tracking-[0.15em] uppercase mb-1" style={{ color: 'rgba(233,195,73,0.5)' }}>
            ⚡ {state.energy}/{state.maxEnergy}
          </span>
          
          {maxEnergyArray.map((isMax, index) => {
            const isActive = energyArray[index];
            return (
              <div key={index}
                className={`transition-all duration-300 ${isActive ? '' : isMax ? 'opacity-25' : 'opacity-10'}`}
                style={{
                  width: '1.8rem', height: '1.5rem',
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  background: isActive 
                    ? 'linear-gradient(180deg, #e9c349, #c4a02e)'
                    : 'linear-gradient(180deg, #2a2535, #1a1625)',
                  boxShadow: isActive ? '0 0 8px rgba(233,195,73,0.5)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                <span className="material-symbols-outlined" 
                  style={{ fontSize: '10px', color: isActive ? '#0d0b10' : 'rgba(233,195,73,0.3)' }}>
                  bolt
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default PlayerZone
