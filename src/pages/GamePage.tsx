import React, { useState } from 'react'
import { TopAppBar } from '../components/Navigation'
import GameBoard from '../components/game/GameBoard'
import { useGameEngine } from '../hooks/useGameEngine'
import { CARDS_DATABASE } from '../data/cards'
import { STARTER_DECK, STARTER_DECK_NAME, STARTER_DECK_DESCRIPTION } from '../data/starterDeck'

interface GamePageProps {
  onNavigate: (page: 'home' | 'library' | 'decks' | 'market' | 'profile' | 'play') => void
}

type GameScreen = 'lobby' | 'playing'

const GamePage: React.FC<GamePageProps> = ({ onNavigate }) => {
  const [screen, setScreen] = useState<GameScreen>('lobby')
  const [selectedDeckType, setSelectedDeckType] = useState<'saved' | 'starter'>('starter')

  const engine = useGameEngine()

  // Check if player has a saved custom deck
  const savedDeck = (() => {
    try {
      const raw = localStorage.getItem('arcanima_deck')
      if (!raw) return null
      const parsed = JSON.parse(raw) as { id: string; count: number; name: string }[]
      const total = parsed.reduce((acc, c) => acc + c.count, 0)
      return total > 0 ? { cards: parsed, total } : null
    } catch { return null }
  })()

  // Calculate starter deck stats
  const starterTotal = STARTER_DECK.reduce((acc, c) => acc + c.count, 0)
  const starterAvgCost = (() => {
    let totalCost = 0, totalCards = 0
    STARTER_DECK.forEach(entry => {
      const card = CARDS_DATABASE.find(c => c.id === entry.id)
      if (card) { totalCost += card.cost * entry.count; totalCards += entry.count }
    })
    return totalCards > 0 ? (totalCost / totalCards).toFixed(1) : '0'
  })()

  const handleStartGame = () => {
    if (selectedDeckType === 'starter') {
      // Write starter deck to localStorage so engine can load it
      localStorage.setItem('arcanima_deck', JSON.stringify(STARTER_DECK))
    }
    engine.restart()
    setScreen('playing')
  }

  if (screen === 'playing') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-on-background dark pb-20 md:pb-0 pt-16 flex flex-col">
        <TopAppBar
          title="Arcanima Battle"
          activePage="play"
          onNavigate={onNavigate}
          showEssence={false}
        />
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-[1400px] h-full min-h-[80vh] bg-[#111] border border-outline/20 rounded-xl overflow-hidden shadow-2xl relative">
            {!engine.isInitialized ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-primary">
                <span className="material-symbols-outlined text-5xl animate-spin">auto_awesome</span>
                <p className="tracking-widest uppercase text-sm">Chargement du Grimoire...</p>
              </div>
            ) : (
              <GameBoard engine={engine} onReturnToLobby={() => setScreen('lobby')} />
            )}
          </div>
        </main>
      </div>
    )
  }

  // Lobby Screen
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-on-background dark pb-20 md:pb-0 pt-16 flex flex-col">
      <TopAppBar
        title="Arcanima Battle"
        activePage="play"
        onNavigate={onNavigate}
        showEssence={false}
      />

      <main className="flex-grow flex flex-col items-center justify-start p-4 pt-8 gap-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary tracking-widest uppercase drop-shadow-[0_0_20px_rgba(221,183,255,0.5)]">
            ⚔️ Zone de Combat
          </h1>
          <p className="text-on-surface-variant mt-2 text-sm tracking-wider">
            Choisissez votre Grimoire et partez à la bataille !
          </p>
        </div>

        {/* Deck Selection */}
        <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Starter Deck Card */}
          <button
            onClick={() => setSelectedDeckType('starter')}
            className={`relative text-left p-5 rounded-xl border-2 transition-all duration-300 ${
              selectedDeckType === 'starter'
                ? 'border-secondary bg-secondary/10 shadow-[0_0_20px_rgba(78,222,163,0.3)]'
                : 'border-outline/30 bg-surface-container/30 hover:border-outline/60'
            }`}
          >
            {selectedDeckType === 'starter' && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-black text-sm">check</span>
              </div>
            )}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-secondary/20 border border-secondary/50 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary">auto_stories</span>
              </div>
              <div>
                <h3 className="font-bold text-secondary text-sm uppercase tracking-widest">{STARTER_DECK_NAME}</h3>
                <p className="text-[10px] text-on-surface-variant">Deck de Base</p>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">{STARTER_DECK_DESCRIPTION}</p>
            <div className="flex gap-3 text-xs">
              <div className="bg-black/40 px-2 py-1 rounded border border-secondary/20 text-secondary">
                <span className="font-bold">{starterTotal}</span> cartes
              </div>
              <div className="bg-black/40 px-2 py-1 rounded border border-tertiary/20 text-tertiary">
                Moy. <span className="font-bold">{starterAvgCost}</span> énergie
              </div>
              <div className="bg-black/40 px-2 py-1 rounded border border-primary/20 text-primary">
                Équilibré
              </div>
            </div>
          </button>

          {/* Custom Deck Card */}
          <button
            onClick={() => savedDeck && setSelectedDeckType('saved')}
            disabled={!savedDeck}
            className={`relative text-left p-5 rounded-xl border-2 transition-all duration-300 ${
              !savedDeck
                ? 'border-outline/20 bg-surface-container/10 opacity-50 cursor-not-allowed'
                : selectedDeckType === 'saved'
                  ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(221,183,255,0.3)]'
                  : 'border-outline/30 bg-surface-container/30 hover:border-outline/60'
            }`}
          >
            {selectedDeckType === 'saved' && savedDeck && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-black text-sm">check</span>
              </div>
            )}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/20 border border-primary/50 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">style</span>
              </div>
              <div>
                <h3 className="font-bold text-primary text-sm uppercase tracking-widest">Mon Grimoire</h3>
                <p className="text-[10px] text-on-surface-variant">Deck Personnalisé</p>
              </div>
            </div>
            {savedDeck ? (
              <>
                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                  Votre deck personnalisé, construit dans le Deck Builder.
                </p>
                <div className="flex gap-3 text-xs">
                  <div className="bg-black/40 px-2 py-1 rounded border border-primary/20 text-primary">
                    <span className="font-bold">{savedDeck.total}</span> cartes
                  </div>
                  <div className="bg-black/40 px-2 py-1 rounded border border-tertiary/20 text-tertiary">
                    Personnalisé
                  </div>
                </div>
              </>
            ) : (
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Aucun deck sauvegardé. Créez-en un dans l'onglet <strong className="text-primary">Decks</strong>.
              </p>
            )}
          </button>
        </div>

        {/* Matchup Info */}
        <div className="w-full max-w-2xl bg-surface-container/20 border border-outline/20 rounded-xl p-5">
          <h3 className="text-xs uppercase tracking-widest text-on-surface-variant mb-4 font-bold">Format de la Partie</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl mb-1">👤</div>
              <div className="text-xs text-primary font-bold uppercase tracking-widest">Joueur</div>
              <div className="text-[10px] text-on-surface-variant mt-1">Votre Grimoire</div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-3xl text-error font-bold">VS</div>
            </div>
            <div>
              <div className="text-2xl mb-1">🤖</div>
              <div className="text-xs text-error font-bold uppercase tracking-widest">IA Adversaire</div>
              <div className="text-[10px] text-on-surface-variant mt-1">Deck Aléatoire</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4 text-xs text-on-surface-variant">
            <div className="flex items-center gap-2"><span className="text-secondary">✓</span> Dieu à 1200 PV chacun</div>
            <div className="flex items-center gap-2"><span className="text-secondary">✓</span> 7 cartes en main au départ</div>
            <div className="flex items-center gap-2"><span className="text-secondary">✓</span> Énergie +1 par tour (max 10)</div>
            <div className="flex items-center gap-2"><span className="text-secondary">✓</span> Mal d'invocation (1 tour)</div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartGame}
          className="w-full max-w-2xl py-4 bg-gradient-to-r from-primary/80 to-secondary/80 hover:from-primary hover:to-secondary border border-primary/50 text-white font-bold text-lg rounded-xl uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(221,183,255,0.3)] hover:shadow-[0_0_30px_rgba(221,183,255,0.5)] flex items-center justify-center gap-3"
        >
          <span className="material-symbols-outlined">swords</span>
          Commencer la Bataille !
        </button>
      </main>
    </div>
  )
}

export default GamePage
