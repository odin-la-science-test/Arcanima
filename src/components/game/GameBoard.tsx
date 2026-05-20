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
    <div className="w-full h-full flex flex-col relative bg-[url('https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px]"></div>

      {/* Top HUD */}
      <div className="relative z-20 flex items-center justify-between px-4 py-2 bg-black/40 border-b border-outline/20">
        <button onClick={onReturnToLobby} className="flex items-center gap-1 text-outline hover:text-primary transition-colors text-xs uppercase tracking-widest font-bold">
          <span className="material-symbols-outlined text-sm">arrow_back</span> Quitter
        </button>
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-widest transition-all
            ${activePlayer === 'player' ? 'bg-secondary/20 border-secondary text-secondary' : 'bg-error/20 border-error text-error animate-pulse'}`}>
            {activePlayer === 'player' ? '⚡ Votre Tour' : '⏳ Tour Adversaire...'}
          </div>
          <div className="text-tertiary text-xs font-bold bg-black/50 border border-tertiary/30 px-3 py-1 rounded-full">Tour {turn}</div>
        </div>
        <button onClick={() => setShowLog(!showLog)} className="flex items-center gap-1 text-outline hover:text-tertiary transition-colors text-xs uppercase tracking-widest font-bold">
          <span className="material-symbols-outlined text-sm">history</span> Log
        </button>
      </div>

      {/* Attack mode hint */}
      {isTargetMode && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-error/20 border border-error text-error px-6 py-2 rounded-full text-sm font-bold tracking-widest uppercase animate-pulse shadow-[0_0_20px_rgba(255,84,73,0.4)]">
          ⚔️ Choisissez une cible — Créature ou Dieu Adverse
        </div>
      )}

      {/* Combat Log Panel */}
      {showLog && (
        <div className="absolute top-16 right-4 z-40 w-80 bg-[#0a0a0a]/95 border border-outline/30 rounded-xl shadow-2xl overflow-hidden">
          <div className="px-3 py-2 bg-surface-container border-b border-outline/20 flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Journal de Combat</span>
            <button onClick={() => setShowLog(false)} className="text-outline hover:text-primary material-symbols-outlined text-sm">close</button>
          </div>
          <div className="h-64 overflow-y-auto p-2 space-y-1">
            {combatLog.map((entry, i) => (
              <div key={i} className="flex items-start gap-2 text-[11px] leading-relaxed">
                <span className="shrink-0 mt-0.5">{logIconMap[entry.type]}</span>
                <span className={`${entry.type === 'death' ? 'text-error' : entry.type === 'ai' ? 'text-secondary/70' : entry.type === 'attack' ? 'text-tertiary' : 'text-on-surface-variant'}`}>
                  {entry.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Opponent Zone (Top — rotated for symmetry) */}
      <div className={`flex-1 w-full flex items-start justify-center px-4 pb-2 pt-2 rotate-180 z-10 transition-all duration-300 ${isTargetMode ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <PlayerZone
          isOpponent={true}
          state={opponent}
          isTargetMode={isTargetMode}
          onCardClick={handleOpponentCardClick}
          onAttackGod={isTargetMode ? handleAttackGod : undefined}
        />
      </div>

      {/* Divider */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-outline/40 to-transparent z-10 relative shrink-0" />

      {/* Player Zone (Bottom) */}
      <div className={`flex-1 w-full flex items-end justify-center px-4 pt-2 pb-2 z-10 transition-opacity duration-500 ${activePlayer === 'opponent' ? 'opacity-60 pointer-events-none' : ''}`}>
        <PlayerZone
          isOpponent={false}
          state={player}
          selectedSlot={selectedAttackerSlot}
          onCardClick={handlePlayerCardClick}
          onPlayCard={(idx) => { if (attackPhase === 'select-attacker') playCard(idx, 'player'); }}
        />
      </div>

      {/* Right Side Buttons */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
        {/* End Turn */}
        <button
          onClick={handleEndTurn}
          disabled={activePlayer === 'opponent'}
          className={`px-4 py-8 rounded-lg font-bold tracking-widest uppercase transition-all text-xs
            ${activePlayer === 'player'
              ? 'bg-primary/20 hover:bg-primary/40 border border-primary text-primary shadow-[0_0_15px_rgba(221,183,255,0.2)] hover:shadow-[0_0_20px_rgba(221,183,255,0.4)] cursor-pointer'
              : 'bg-surface-container border border-outline text-outline opacity-40 cursor-not-allowed'}`}
          style={{ writingMode: 'vertical-rl' }}
        >
          Fin de Tour
        </button>

        {/* Cancel Attack */}
        {isTargetMode && (
          <button
            onClick={() => { setSelectedAttackerSlot(null); setAttackPhase('select-attacker'); }}
            className="px-4 py-6 rounded-lg font-bold tracking-widest uppercase bg-error/20 hover:bg-error/40 border border-error text-error text-xs transition-all"
            style={{ writingMode: 'vertical-rl' }}
          >
            Annuler
          </button>
        )}
      </div>

      {/* Game Over Overlay */}
      {isGameOver && (
        <div className="absolute inset-0 z-50 bg-black/85 flex flex-col items-center justify-center gap-6 backdrop-blur-sm">
          <div className="text-8xl">{player.health <= 0 ? '💀' : '🏆'}</div>
          <h2 className={`text-5xl font-bold tracking-widest uppercase drop-shadow-2xl ${player.health <= 0 ? 'text-error' : 'text-secondary'}`}>
            {player.health <= 0 ? 'Défaite !' : 'Victoire !'}
          </h2>
          <p className="text-on-surface-variant">
            {player.health <= 0 ? 'Votre Dieu a été terrassé après ' : 'Vous avez anéanti le Dieu adverse en '}
            <strong className="text-tertiary">{turn} tours</strong>.
          </p>
          <div className="flex gap-4 mt-2">
            <button onClick={onReturnToLobby} className="bg-surface-container border border-outline text-on-surface px-6 py-3 rounded-lg font-bold uppercase tracking-widest transition-all hover:border-primary hover:text-primary">
              Menu
            </button>
            <button onClick={() => { engine.restart(); }} className="bg-primary/20 hover:bg-primary/40 border border-primary text-primary px-8 py-3 rounded-lg font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(221,183,255,0.2)]">
              Rejouer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GameBoard
