import React, { useState, useEffect, useRef } from 'react'
import HomePage from './pages/HomePage'
import LibraryPage from './pages/LibraryPage'
import DeckBuilderPage from './pages/DeckBuilderPage'
import CardDetailPage from './pages/CardDetailPage'
import MarketPage from './pages/MarketPage'
import ProfilePage from './pages/ProfilePage'
import { LoginPage } from './pages/LoginPage'
import { CARDS_DATABASE } from './data/cards'
import GamePage from './pages/GamePage'
import { useAuth } from './hooks/useAuth'
import { AuthWrapper } from './components/AuthWrapper'
import { useTheme } from './contexts/ThemeContext'

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
  const auth = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [navigation, setNavigation] = useState<NavigationState>({ current: 'home' })

  // User-specific persistent states (loaded from auth)
  const [gold, setGold] = useState<number>(0)
  const [gems, setGems] = useState<number>(0)
  const [ownedCards, setOwnedCards] = useState<Record<string, number>>({})
  const [pseudonym, setPseudonym] = useState<string>('')
  const [packsOpened, setPacksOpened] = useState<number>(0)
  const [level, setLevel] = useState<number>(1)

  // Load user data when user logs in
  useEffect(() => {
    if (auth.user && auth.getAllUserData) {
      const loadUserData = async () => {
        const userData = await auth.getAllUserData()
        if (userData) {
          setGold(userData.gold || 0)
          setGems(userData.gems || 0)
          setOwnedCards(userData.ownedCards || {})
          setPseudonym(userData.pseudonym || '')
          setPacksOpened(userData.packsOpened || 0)
          setLevel(userData.level || 1)
        }
      }
      loadUserData()
    }
  }, [auth.user, auth.getAllUserData])

  // Global Audio State
  const [musicEnabled, setMusicEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('arcanima_setting_ambient')
    return saved !== 'false' // default to true, or we can default to false. Since the original ProfilePage defaulted to 'saved !== false', let's stick with that.
  })

  const toggleMusic = () => {
    setMusicEnabled(prev => {
      const next = !prev
      localStorage.setItem('arcanima_setting_ambient', String(next))
      return next
    })
  }

  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      if (musicEnabled) {
        audioRef.current.play().catch(e => console.warn("Audio autoplay blocked by browser until user interacts.", e))
      } else {
        audioRef.current.pause()
      }
    }
  }, [musicEnabled])

  // State synchronization with user's localStorage
  const updateGold = (value: number | ((prev: number) => number)) => {
    setGold(prev => {
      const next = typeof value === 'function' ? value(prev) : value
      if (auth.user) {
        auth.updateUserData('gold', next)
      }
      return next
    })
  }

  const updateGems = (value: number | ((prev: number) => number)) => {
    setGems(prev => {
      const next = typeof value === 'function' ? value(prev) : value
      if (auth.user) {
        auth.updateUserData('gems', next)
      }
      return next
    })
  }

  const updateOwnedCards = (value: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => {
    setOwnedCards(prev => {
      const next = typeof value === 'function' ? value(prev) : value
      if (auth.user) {
        auth.updateUserData('ownedCards', next)
      }
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
        if (auth.user) {
          auth.updateUserData('packsOpened', next)
        }
        return next
      })
    }
  }

  const updatePseudonym = (name: string) => {
    setPseudonym(name)
    if (auth.user) {
      auth.updateUserData('pseudonym', name)
    }
  }

  const handleResetAll = () => {
    // Reset user data to initial values (0 resources, no cards, level 1)
    setGold(0)
    setGems(0)
    setOwnedCards({})
    setPseudonym('')
    setPacksOpened(0)
    setLevel(1)
    
    // Save reset to user data
    if (auth.user) {
      auth.updateUserData('gold', 0)
      auth.updateUserData('gems', 0)
      auth.updateUserData('ownedCards', {})
      auth.updateUserData('pseudonym', '')
      auth.updateUserData('packsOpened', 0)
      auth.updateUserData('level', 1)
    }
    navigateTo('home')
  }

  const navigateTo = (page: Page, cardId?: string) => {
    setNavigation({
      current: page,
      cardDetail: cardId
    })
    window.scrollTo(0, 0)
  }

  const handleUserLogout = () => {
    // Reset local state on logout
    setGold(0)
    setGems(0)
    setOwnedCards({})
    setPseudonym('')
    setPacksOpened(0)
    setLevel(1)
  }

  return (
    <AuthWrapper onUserLogout={handleUserLogout}>
      <div className={`min-h-screen bg-background text-on-background ${theme === 'dark' ? 'dark' : ''}`}>
        {/* Global Ambient Audio */}
        <audio 
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
          loop 
          ref={audioRef}
        />

        {navigation.current === 'home' && (
        <HomePage 
          onNavigate={navigateTo} 
          gold={gold} 
          gems={gems} 
          onAddResources={devAddResources} 
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
      {navigation.current === 'library' && (
        <LibraryPage 
          onNavigate={navigateTo} 
          gold={gold} 
          gems={gems} 
          ownedCards={ownedCards} 
          onAddResources={devAddResources} 
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
      {navigation.current === 'decks' && (
        <DeckBuilderPage 
          onNavigate={navigateTo} 
          gold={gold} 
          gems={gems} 
          ownedCards={ownedCards} 
          onAddResources={devAddResources} 
          theme={theme}
          onToggleTheme={toggleTheme}
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
          theme={theme}
          onToggleTheme={toggleTheme}
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
          ambientAudio={musicEnabled}
          onToggleAmbientAudio={toggleMusic}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
      {navigation.current === 'play' && (
        <GamePage 
          onNavigate={navigateTo} 
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
      </div>
    </AuthWrapper>
  )
}

export default App

