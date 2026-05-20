import React, { useState } from 'react'
import PlayerZone from './PlayerZone'
import { useGameEngine } from '../../hooks/useGameEngine'

interface GameBoardProps {
  engine: ReturnType<typeof useGameEngine>
  onReturnToLobby: () => void
}

const GameBoard: React.FC<GameBoardProps> = ({ engine, onReturnToLobby }) => {
  const { turn, activePlayer, player, opponent, endTurn, playCard, attack, combatLog } = engine;

  const [selectedAttackerSlot, setSelectedAttackerSlot] = useState<number | null>(null);
  const [attackPhase, setAttackPhase] = useState<'select-attacker' | 'select-target'>('select-attacker');
  const [showLog, setShowLog] = useState(false);

  const handlePlayerCardClick = (slotIndex: number) => {
    const card = player.board[slotIndex];
    if (!card || activePlayer !== 'player') return;

    if (attackPhase === 'select-attacker') {
      if (card.canAttack && !card.isEngaged) {
        setSelectedAttackerSlot(slotIndex);
        setAttackPhase('select-target');
      }
    } else {
      if (slotIndex === selectedAttackerSlot) {
        setSelectedAttackerSlot(null);
        setAttackPhase('select-attacker');
      }
    }
  };

  const handleOpponentCardClick = (slotIndex: number) => {
    if (attackPhase === 'select-target' && selectedAttackerSlot !== null) {
      attack(selectedAttackerSlot, 'card', slotIndex);
      setSelectedAttackerSlot(null);
      setAttackPhase('select-attacker');
    }
  };

  const handleAttackGod = () => {
    if (attackPhase === 'select-target' && selectedAttackerSlot !== null) {
      attack(selectedAttackerSlot, 'god');
      setSelectedAttackerSlot(null);
      setAttackPhase('select-attacker');
    }
  };

  const handleEndTurn = () => {
    setSelectedAttackerSlot(null);
    setAttackPhase('select-attacker');
    endTurn();
  };

  const isTargetMode = attackPhase === 'select-target';
  const isGameOver = player.health <= 0 || opponent.health <= 0;

  const logIconMap = { attack: '⚔️', death: '💀', play: '🃏', draw: '📖', ai: '🤖', info: 'ℹ️' };

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a080d 0%, #1a1625 50%, #0a080d 100%)',
      }}>
      
      {/* Background ambient effects */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle at 50% 0%, rgba(255,84,73,0.3) 0%, transparent 50%),
                          radial-gradient(circle at 50% 100%, rgba(78,222,163,0.3) 0%, transparent 50%)`,
      }} />
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />

      {/* Top HUD */}
      <div className="relative z-40 flex items-center justify-between px-6 py-3"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
        
        {/* Left: Quit Button */}
        <button onClick={onReturnToLobby} 
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all group"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <span className="material-symbols-outlined text-sm text-on-surface dark:text-white/50 group-hover:text-on-surface dark:text-white transition-colors">arrow_back</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface dark:text-white/50 group-hover:text-on-surface dark:text-white transition-colors">Abandonner</span>
        </button>

        {/* Center: Turn Info */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-on-surface dark:text-white/40">Tour Actuel</span>
            <span className="text-xl font-black text-on-surface dark:text-white/90 leading-none">{turn}</span>
          </div>
          
          <div className="h-8 w-px bg-white/10 mx-2" />
          
          <div className={`px-6 py-2 rounded-full border flex items-center gap-2 transition-all duration-500
            ${activePlayer === 'player' 
              ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
              : 'bg-red-500/10 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]'}`}>
            <div className={`w-2 h-2 rounded-full ${activePlayer === 'player' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400 animate-pulse'}`} />
            <span className={`text-xs font-bold uppercase tracking-[0.2em] ${activePlayer === 'player' ? 'text-emerald-400' : 'text-red-400'}`}>
              {activePlayer === 'player' ? 'Votre Tour' : 'Tour Adverse'}
            </span>
          </div>
        </div>

        {/* Right: Log Button */}
        <button onClick={() => setShowLog(!showLog)} 
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all group relative"
          style={{ 
            background: showLog ? 'rgba(233,195,73,0.1)' : 'rgba(255,255,255,0.03)', 
            border: `1px solid ${showLog ? 'rgba(233,195,73,0.3)' : 'rgba(255,255,255,0.1)'}` 
          }}>
          <span className="material-symbols-outlined text-sm transition-colors" style={{ color: showLog ? '#e9c349' : 'rgba(255,255,255,0.5)' }}>history</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] transition-colors" style={{ color: showLog ? '#e9c349' : 'rgba(255,255,255,0.5)' }}>Logs</span>
          {combatLog.length > 0 && !showLog && (
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-500 rounded-full animate-pulse" />
          )}
        </button>
      </div>

      {/* Target Mode Banner */}
      <div className={`absolute top-20 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 transform
        ${isTargetMode ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className="flex items-center gap-3 px-6 py-2.5 rounded-full"
          style={{
            background: 'rgba(255,84,73,0.15)',
            border: '1px solid rgba(255,84,73,0.5)',
            boxShadow: '0 0 30px rgba(255,84,73,0.3), inset 0 0 20px rgba(255,84,73,0.2)',
            backdropFilter: 'blur(10px)',
          }}>
          <span className="material-symbols-outlined text-red-400 animate-pulse">my_location</span>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-red-400">Sélectionnez une Cible</span>
        </div>
      </div>

      {/* Combat Log Drawer */}
      <div className={`absolute top-20 right-6 bottom-20 w-80 z-50 transition-all duration-500 transform
        ${showLog ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0 pointer-events-none'}`}>
        <div className="h-full rounded-2xl flex flex-col overflow-hidden"
          style={{
            background: 'rgba(13,11,16,0.95)',
            border: '1px solid rgba(233,195,73,0.2)',
            boxShadow: '-10px 0 50px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(20px)',
          }}>
          <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#e9c349] text-sm">scrollable_header</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e9c349]">Registre des Combats</span>
            </div>
            <button onClick={() => setShowLog(false)} className="text-on-surface dark:text-white/40 hover:text-on-surface dark:text-white transition-colors">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {combatLog.map((entry, i) => (
              <div key={i} className="flex gap-3 text-sm p-3 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-lg shrink-0 drop-shadow-md">{logIconMap[entry.type]}</span>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-on-surface dark:text-white/30">Tour {entry.turn}</span>
                  <span className={`text-xs leading-relaxed
                    ${entry.type === 'death' ? 'text-red-400 font-bold' 
                    : entry.type === 'ai' ? 'text-blue-300' 
                    : entry.type === 'attack' ? 'text-yellow-400' 
                    : 'text-on-surface dark:text-white/80'}`}>
                    {entry.message}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Battlefield Area */}
      <div className="flex-1 flex flex-col relative z-10 px-8">
        
        {/* Opponent Zone */}
        <div className={`flex-1 flex items-start justify-center pt-6 transition-all duration-500
          ${isTargetMode ? 'scale-105 pointer-events-auto filter drop-shadow-[0_10px_30px_rgba(255,84,73,0.2)]' : 'pointer-events-none opacity-90'}`}>
          <PlayerZone
            isOpponent={true}
            state={opponent}
            isTargetMode={isTargetMode}
            onCardClick={handleOpponentCardClick}
            onAttackGod={isTargetMode ? handleAttackGod : undefined}
          />
        </div>

        {/* Central Divider */}
        <div className="relative h-px w-full my-4 flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>

        {/* Player Zone */}
        <div className={`flex-1 flex items-end justify-center pb-6 transition-all duration-500
          ${activePlayer === 'opponent' ? 'opacity-60 scale-95 pointer-events-none grayscale-[20%]' : ''}
          ${isTargetMode ? 'opacity-50' : ''}`}>
          <PlayerZone
            isOpponent={false}
            state={player}
            selectedSlot={selectedAttackerSlot}
            onCardClick={handlePlayerCardClick}
            onPlayCard={(idx) => { if (attackPhase === 'select-attacker') playCard(idx, 'player'); }}
          />
        </div>
      </div>

      {/* Action Buttons (Right Center) */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-4">
        
        {/* End Turn */}
        <button
          onClick={handleEndTurn}
          disabled={activePlayer === 'opponent'}
          className={`relative group w-14 h-40 rounded-full flex items-center justify-center transition-all duration-500
            ${activePlayer === 'player'
              ? 'cursor-pointer hover:scale-105 hover:shadow-[0_0_30px_rgba(78,222,163,0.4)]'
              : 'opacity-30 cursor-not-allowed'}`}
          style={{
            background: activePlayer === 'player' 
              ? 'linear-gradient(180deg, rgba(78,222,163,0.1) 0%, rgba(78,222,163,0.2) 100%)'
              : 'rgba(255,255,255,0.05)',
            border: activePlayer === 'player'
              ? '1px solid rgba(78,222,163,0.5)'
              : '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
          }}>
          {activePlayer === 'player' && (
            <div className="absolute inset-0 rounded-full pointer-events-none group-hover:animate-pulse"
              style={{ boxShadow: 'inset 0 0 20px rgba(78,222,163,0.2)' }} />
          )}
          <span className="text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap rotate-180" 
            style={{ 
              writingMode: 'vertical-rl',
              color: activePlayer === 'player' ? '#4edea3' : 'rgba(255,255,255,0.5)',
              textShadow: activePlayer === 'player' ? '0 0 10px rgba(78,222,163,0.5)' : 'none',
            }}>
            Fin de Tour
          </span>
        </button>

        {/* Cancel Attack */}
        {isTargetMode && (
          <button
            onClick={() => { setSelectedAttackerSlot(null); setAttackPhase('select-attacker'); }}
            className="w-14 h-32 rounded-full flex items-center justify-center transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,84,73,0.4)]"
            style={{
              background: 'linear-gradient(180deg, rgba(255,84,73,0.1) 0%, rgba(255,84,73,0.2) 100%)',
              border: '1px solid rgba(255,84,73,0.5)',
              backdropFilter: 'blur(10px)',
            }}>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap rotate-180 text-red-400" 
              style={{ writingMode: 'vertical-rl' }}>
              Annuler
            </span>
          </button>
        )}
      </div>

      {/* Game Over Screen */}
      {isGameOver && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center p-8 backdrop-blur-md"
          style={{ background: 'rgba(0,0,0,0.85)' }}>
          
          <div className="max-w-2xl w-full flex flex-col items-center p-12 rounded-3xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(26,22,37,0.9) 0%, rgba(13,11,16,0.95) 100%)',
              border: `2px solid ${player.health <= 0 ? 'rgba(255,84,73,0.5)' : 'rgba(233,195,73,0.5)'}`,
              boxShadow: `0 30px 60px rgba(0,0,0,0.8), inset 0 0 50px ${player.health <= 0 ? 'rgba(255,84,73,0.1)' : 'rgba(233,195,73,0.1)'}`,
            }}>
            
            {/* Background rays */}
            <div className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                background: `repeating-conic-gradient(from 0deg, transparent 0deg, ${player.health <= 0 ? 'rgba(255,84,73,0.2)' : 'rgba(233,195,73,0.2)'} 10deg, transparent 20deg)`,
                animation: 'spin 20s linear infinite',
              }} />

            <div className="relative z-10 flex flex-col items-center text-center">
              <span className="text-8xl mb-6 filter drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                {player.health <= 0 ? '💀' : '🏆'}
              </span>
              
              <h2 className="text-5xl font-black uppercase tracking-[0.2em] mb-4"
                style={{
                  color: player.health <= 0 ? '#ff5449' : '#e9c349',
                  textShadow: `0 0 30px ${player.health <= 0 ? 'rgba(255,84,73,0.5)' : 'rgba(233,195,73,0.5)'}`,
                }}>
                {player.health <= 0 ? 'Défaite' : 'Victoire'}
              </h2>
              
              <div className="text-on-surface dark:text-white/60 mb-12 text-lg">
                <p>{player.health <= 0 ? 'Votre Dieu a succombé aux assauts ennemis.' : 'Le Dieu adverse a été anéanti par votre puissance.'}</p>
                <p className="mt-2 text-sm uppercase tracking-widest text-on-surface dark:text-white/40">Durée du combat : <span className="text-on-surface dark:text-white font-bold">{turn} tours</span></p>
              </div>

              <div className="flex gap-6">
                <button onClick={onReturnToLobby} 
                  className="px-8 py-4 rounded-xl font-bold uppercase tracking-[0.15em] transition-all hover:bg-white/10"
                  style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
                  Quitter
                </button>
                <button onClick={() => engine.restart()} 
                  className="px-10 py-4 rounded-xl font-black uppercase tracking-[0.15em] transition-all hover:scale-105"
                  style={{
                    background: player.health <= 0 
                      ? 'linear-gradient(90deg, rgba(255,84,73,0.2), rgba(255,84,73,0.3))' 
                      : 'linear-gradient(90deg, rgba(233,195,73,0.2), rgba(233,195,73,0.3))',
                    border: `1px solid ${player.health <= 0 ? '#ff5449' : '#e9c349'}`,
                    color: player.health <= 0 ? '#ff5449' : '#e9c349',
                    boxShadow: `0 0 30px ${player.health <= 0 ? 'rgba(255,84,73,0.3)' : 'rgba(233,195,73,0.3)'}`,
                  }}>
                  Revanche
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GameBoard
