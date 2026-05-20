import React, { useState, useEffect } from 'react'
import HomePage from './pages/HomePage'
import LibraryPage from './pages/LibraryPage'
import DeckBuilderPage from './pages/DeckBuilderPage'
import CardDetailPage from './pages/CardDetailPage'
import MarketPage from './pages/MarketPage'
import ProfilePage from './pages/ProfilePage'
import { CARDS_DATABASE } from './data/cards'
import GamePage from './pages/GamePage'

type Page = 'home' | 'library' | 'decks' | 'market' | 'card-detail' | 'profile' | 'play'

interface NavigationState {
  current: Page
  cardDetail?: string
}

const INITIAL_GOLD = 3000
const INITIAL_GEMS = 200

const getInitialOwnedCards = () => {
  const owned: Record<string, number> = {}
  CARDS_DATABASE.forEach(card => {
    if (card.rarity === 'common') {
      owned[card.id] = 2
    } else {
      owned[card.id] = 0
    }
  })
  return owned
}

function App() {
  const [navigation, setNavigation] = useState<NavigationState>({ current: 'home' })

  // Global persistent states
  const [gold, setGold] = useState<number>(() => {
    const saved = localStorage.getItem('arcanima_gold')
    return saved ? Number(saved) : INITIAL_GOLD
  })

  const [gems, setGems] = useState<number>(() => {
    const saved = localStorage.getItem('arcanima_gems')
    return saved ? Number(saved) : INITIAL_GEMS
  })

  const [ownedCards, setOwnedCards] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('arcanima_owned_cards')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error("Error parsing owned cards from localStorage, resetting", e)
      }
    }
    return getInitialOwnedCards()
  })

  const [pseudonym, setPseudonym] = useState<string>(() => {
    return localStorage.getItem('arcanima_pseudonym') || "Archimède l'Éveillé"
  })

  const [packsOpened, setPacksOpened] = useState<number>(() => {
    const saved = localStorage.getItem('arcanima_packs_opened')
    return saved ? Number(saved) : 0
  })

  // State synchronization with localStorage
  const updateGold = (value: number | ((prev: number) => number)) => {
    setGold(prev => {
      const next = typeof value === 'function' ? value(prev) : value
      localStorage.setItem('arcanima_gold', String(next))
      return next
    })
  }

  const updateGems = (value: number | ((prev: number) => number)) => {
    setGems(prev => {
      const next = typeof value === 'function' ? value(prev) : value
      localStorage.setItem('arcanima_gems', String(next))
      return next
    })
  }

  const updateOwnedCards = (value: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => {
    setOwnedCards(prev => {
      const next = typeof value === 'function' ? value(prev) : value
      localStorage.setItem('arcanima_owned_cards', JSON.stringify(next))
      return next
    })
  }

  // Developer / Easter Egg utility to add resources
  const devAddResources = () => {
    updateGold(prev => prev + 1000)
    updateGems(prev => prev + 100)
  }

  const buyCard = (cardId: string, cost: number, currency: 'gold' | 'gems'): boolean => {
    if (currency === 'gold') {
      if (gold >= cost) {
        updateGold(prev => prev - cost)
        updateOwnedCards(prev => ({
          ...prev,
          [cardId]: (prev[cardId] || 0) + 1
        }))
        return true
      }
    } else {
      if (gems >= cost) {
        updateGems(prev => prev - cost)
        updateOwnedCards(prev => ({
          ...prev,
          [cardId]: (prev[cardId] || 0) + 1
        }))
        return true
      }
    }
    return false
  }

  const addCardsToCollection = (cardIds: string[]) => {
    updateOwnedCards(prev => {
      const next = { ...prev }
      cardIds.forEach(id => {
        next[id] = (next[id] || 0) + 1
      })
      return next
    })
    // Count pack opening when receiving a full pack of 5 cards
    if (cardIds.length === 5) {
      setPacksOpened(prev => {
        const next = prev + 1
        localStorage.setItem('arcanima_packs_opened', String(next))
        return next
      })
    }
  }

  const updatePseudonym = (name: string) => {
    setPseudonym(name)
    localStorage.setItem('arcanima_pseudonym', name)
  }

  const handleResetAll = () => {
    localStorage.removeItem('arcanima_gold')
    localStorage.removeItem('arcanima_gems')
    localStorage.removeItem('arcanima_owned_cards')
    localStorage.removeItem('arcanima_pseudonym')
    localStorage.removeItem('arcanima_packs_opened')
    setGold(INITIAL_GOLD)
    setGems(INITIAL_GEMS)
    setOwnedCards(getInitialOwnedCards())
    setPseudonym("Archimède l'Éveillé")
    setPacksOpened(0)
    navigateTo('home')
  }

  const navigateTo = (page: Page, cardId?: string) => {
    setNavigation({
      current: page,
      cardDetail: cardId
    })
    window.scrollTo(0, 0)
  }

  return (
    <div className="min-h-screen bg-background text-on-background dark">
      {navigation.current === 'home' && (
        <HomePage 
          onNavigate={navigateTo} 
          gold={gold} 
          gems={gems} 
          onAddResources={devAddResources} 
        />
      )}
      {navigation.current === 'library' && (
        <LibraryPage 
          onNavigate={navigateTo} 
          gold={gold} 
          gems={gems} 
          ownedCards={ownedCards} 
          onAddResources={devAddResources} 
        />
      )}
      {navigation.current === 'decks' && (
        <DeckBuilderPage 
          onNavigate={navigateTo} 
          gold={gold} 
          gems={gems} 
          ownedCards={ownedCards} 
          onAddResources={devAddResources} 
        />
      )}
      {navigation.current === 'market' && (
        <MarketPage 
          onNavigate={navigateTo} 
          gold={gold} 
          gems={gems} 
          ownedCards={ownedCards}
          onBuyCard={buyCard}
          onAddCards={addCardsToCollection}
          onAddResources={devAddResources}
        />
      )}
      {navigation.current === 'card-detail' && (
        <CardDetailPage 
          onNavigate={navigateTo} 
          cardId={navigation.cardDetail} 
          gold={gold} 
          gems={gems} 
          ownedCards={ownedCards} 
          onAddResources={devAddResources} 
        />
      )}
      {navigation.current === 'profile' && (
        <ProfilePage 
          onNavigate={navigateTo} 
          gold={gold} 
          gems={gems} 
          ownedCards={ownedCards} 
          pseudonym={pseudonym}
          packsOpened={packsOpened}
          onChangePseudonym={updatePseudonym}
          onResetAll={handleResetAll}
          onAddResources={devAddResources}
        />
      )}
      {navigation.current === 'play' && (
        <GamePage 
          onNavigate={navigateTo} 
        />
      )}
    </div>
  )
}

export default App

