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

  return (
    <div className={`w-full max-w-[1200px] h-[350px] flex gap-4 ${isOpponent ? 'flex-row-reverse' : 'flex-row'}`}>
      
      {/* Left Panel: Pioche, Défausse, Limbes */}
      <div className="w-32 flex flex-col justify-between items-center py-2 bg-surface-container/30 border border-outline/20 rounded-xl">
        <div className="text-center w-full">
          <div className="text-[10px] text-tertiary font-bold tracking-widest uppercase mb-1">Pioche ({state.deck.length})</div>
          <div className={`w-24 h-32 bg-[url('https://images.unsplash.com/photo-1590595906931-81f04f0ccebb?auto=format&fit=crop&q=80&w=200')] bg-cover border border-tertiary/50 rounded-lg shadow-[0_0_10px_rgba(233,195,73,0.2)] flex items-center justify-center ${state.deck.length === 0 ? 'opacity-30 grayscale' : ''}`}>
             <span className="material-symbols-outlined text-tertiary/80 text-4xl">style</span>
          </div>
        </div>
        
        <div className="text-center w-full">
          <div className="text-[10px] text-error font-bold tracking-widest uppercase mb-1">Défausse</div>
          <div className="w-24 h-32 bg-surface-container-high border border-error/30 rounded-lg flex items-center justify-center relative overflow-hidden">
             {state.discard.length > 0 ? (
                 <img src={state.discard[state.discard.length - 1].image} className="w-full h-full object-cover opacity-50" />
             ) : (
                 <span className="material-symbols-outlined text-error/50">delete</span>
             )}
             <div className="absolute top-1 right-1 bg-black/80 px-1 rounded text-[10px]">{state.discard.length}</div>
          </div>
        </div>

        <div className="text-center w-full">
          <div className="text-[10px] text-primary font-bold tracking-widest uppercase mb-1">Limbes</div>
          <div className="w-24 h-32 bg-black/80 border border-primary/30 rounded-lg flex items-center justify-center relative overflow-hidden">
             {state.limbo.length > 0 ? (
                 <img src={state.limbo[state.limbo.length - 1].image} className="w-full h-full object-cover opacity-30 grayscale" />
             ) : (
                 <span className="material-symbols-outlined text-primary/50">cyclone</span>
             )}
             <div className="absolute top-1 right-1 bg-black/80 px-1 rounded text-[10px] text-primary">{state.limbo.length}</div>
          </div>
        </div>
      </div>

      {/* Center Panel: Battlefield & Hand */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Battlefield Row */}
        <div className="flex-1 border border-outline/10 bg-surface/10 rounded-xl flex items-center justify-center gap-2 p-2 relative">
           <div className="absolute top-2 left-4 text-xs text-on-surface-variant/50 uppercase tracking-widest">Champ de Bataille</div>
           
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
               />
             ) : (
               <div key={`empty-${index}`} className="w-24 h-32 border-2 border-dashed border-outline/20 rounded-lg bg-surface-container/20 flex items-center justify-center">
                  <span className="text-outline/30 text-[10px] uppercase font-bold tracking-wider">{index + 1}</span>
               </div>
             )
           ))}
        </div>

        {/* Hand Row (only for player) */}
        <div className={`h-40 border border-outline/10 bg-surface/30 rounded-xl flex items-end justify-center p-2 pb-0 overflow-hidden ${isOpponent ? 'hidden' : 'flex'}`}>
          <div className="absolute bottom-16 text-xs text-on-surface-variant/30 uppercase tracking-widest pointer-events-none">Main ({state.hand.length})</div>
          
          {state.hand.map((card, index) => {
            const isPlayable = state.energy >= card.cost && !isTargetMode;
            return (
              <div 
                key={`hand-${card.id}-${index}`} 
                className="translate-y-4 hover:-translate-y-2 transition-transform cursor-pointer hover:z-50 relative"
                style={{ marginLeft: index > 0 ? '-1.5rem' : '0' }}
              >
                <GameCard 
                  card={card} 
                  playable={isPlayable}
                  onClick={() => isPlayable ? onPlayCard?.(index) : undefined}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Panel: Dieu, Terrain, Energies */}
      <div className="w-48 flex gap-2">
        <div className="w-28 flex flex-col gap-4">
          {/* Dieu */}
          <div 
            onClick={isOpponent && isTargetMode && onAttackGod ? onAttackGod : undefined}
            className={`flex-1 bg-surface-container/30 border rounded-xl flex flex-col items-center justify-center p-2 relative transition-all
              ${isOpponent && isTargetMode 
                ? 'border-error cursor-pointer shadow-[0_0_20px_rgba(255,84,73,0.5)] animate-pulse hover:bg-error/10' 
                : 'border-primary/50 shadow-[0_0_15px_rgba(221,183,255,0.15)]'}`}
          >
            <div className="absolute top-1 text-[10px] text-primary font-bold tracking-widest uppercase z-20 bg-black/80 px-1 rounded">Dieu</div>
            
            {isOpponent && isTargetMode && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-error/10 rounded-xl">
                <span className="text-error text-3xl font-bold">⚔️</span>
              </div>
            )}

            <div className="w-full h-full object-cover rounded mt-4 opacity-80 bg-[url('https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&q=80&w=200')] bg-cover bg-center"></div>
            
            <div className="absolute bottom-2 bg-black/90 px-2 py-0.5 rounded text-xs font-bold border z-20 transition-colors"
              style={{ 
                color: state.health > 600 ? '#f87171' : '#fca5a5',
                borderColor: state.health > 600 ? 'rgba(248,113,113,0.5)' : 'rgba(252,165,165,0.5)'
              }}>
              {state.health} PV
            </div>
          </div>

          {/* Terrain */}
          <div className="h-32 bg-surface-container/30 border border-secondary/50 rounded-xl flex flex-col items-center justify-center p-2 relative overflow-hidden">
             <div className="absolute top-1 text-[10px] text-secondary font-bold tracking-widest uppercase z-20 bg-black/80 px-1 rounded">Terrain</div>
             {state.terrain ? (
                <img src={state.terrain.image} className="w-full h-full object-cover mt-4 opacity-60 rounded" />
             ) : (
                <div className="w-full h-full border border-dashed border-secondary/30 rounded mt-4 flex items-center justify-center text-secondary/30 text-xs text-center">Aucun</div>
             )}
          </div>
        </div>

        {/* Energies */}
        <div className="w-16 bg-surface-container/30 border border-tertiary/30 rounded-xl flex flex-col items-center py-2 gap-1 relative overflow-hidden">
           <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-tertiary/10 text-[10px] font-bold tracking-widest uppercase [writing-mode:vertical-rl]">Energies</span>
           </div>
           {energyArray.map((isActive, index) => (
             <div key={index} className={`w-10 h-8 flex items-center justify-center transition-all duration-300 ${isActive ? 'drop-shadow-[0_0_8px_rgba(233,195,73,0.8)]' : 'opacity-20 grayscale'}`}>
               <div className={`w-6 h-8 flex items-center justify-center bg-tertiary`} style={{clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}>
                  <span className="material-symbols-outlined text-black text-sm">bolt</span>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  )
}

export default PlayerZone
