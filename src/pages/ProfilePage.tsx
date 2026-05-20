import React, { useState, useMemo, useEffect } from 'react'
import { TopAppBar, BottomNavBar } from '../components/Navigation'
import { Footer } from '../components/Footer'
import { CARDS_DATABASE } from '../data/cards'

interface ProfilePageProps {
  onNavigate: (page: 'home' | 'library' | 'decks' | 'market' | 'profile' | 'play') => void
  gold: number
  gems: number
  ownedCards: Record<string, number>
  pseudonym: string
  packsOpened: number
  onChangePseudonym: (name: string) => void
  onResetAll: () => void
  onAddResources: () => void
}

interface Particle {
  id: number
  x: number
  y: number
  color: string
  size: number
  angle: number
  speed: number
  opacity: number
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onNavigate,
  gold,
  gems,
  ownedCards,
  pseudonym,
  packsOpened,
  onChangePseudonym,
  onResetAll,
  onAddResources
}) => {
  const [activeNav, setActiveNav] = useState<'home' | 'library' | 'decks' | 'market' | 'profile' | 'play'>('profile')
  
  // Input editing states
  const [isEditingPseudo, setIsEditingPseudo] = useState(false)
  const [tempPseudo, setTempPseudo] = useState(pseudonym)
  const [pseudoMessage, setPseudoMessage] = useState<string | null>(null)

  // Meditate / XP state
  const [xp, setXp] = useState(() => {
    const savedXp = localStorage.getItem('arcanima_profile_xp')
    return savedXp ? Number(savedXp) : 4850
  })
  const [level, setLevel] = useState(() => {
    const savedLvl = localStorage.getItem('arcanima_profile_level')
    return savedLvl ? Number(savedLvl) : 14
  })
  const [showLevelUpEffect, setShowLevelUpEffect] = useState(false)

  // Audio simulation settings
  const [ambientAudio, setAmbientAudio] = useState(() => {
    const saved = localStorage.getItem('arcanima_setting_ambient')
    return saved !== 'false'
  })
  const [sfxVolume, setSfxVolume] = useState(() => {
    const saved = localStorage.getItem('arcanima_setting_sfx')
    return saved ? Number(saved) : 80
  })

  // Double confirmation reset modal
  const [showResetModal, setShowResetModal] = useState(false)
  const [resetConfirmText, setResetConfirmText] = useState('')
  const [resetError, setResetError] = useState(false)

  // Magic particle effects state for the cheat code / meditates
  const [particles, setParticles] = useState<Particle[]>([])

  // Faction Display Maps
  const FACTION_MAP: Record<string, { label: string; color: string; glow: string; icon: string }> = {
    'Formica': { label: 'Colonie Formica', color: '#e9c349', glow: 'rgba(233, 195, 73, 0.4)', icon: 'pest_control' },
    'Oiseau': { label: 'Céleste Avian', color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.4)', icon: 'flight' },
    'Poisson': { label: 'Hadès Aquatique', color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)', icon: 'water' },
    'Nature': { label: 'Sylve Sauvage', color: '#22c55e', glow: 'rgba(34, 197, 94, 0.4)', icon: 'forest' },
    'Coleoptera': { label: 'Carapace Coleoptera', color: '#fb923c', glow: 'rgba(251, 146, 60, 0.4)', icon: 'bug_report' },
    'Arachnida': { label: 'Ombre Arachnida', color: '#f43f5e', glow: 'rgba(244, 63, 94, 0.4)', icon: 'blur_on' },
    'Diptera': { label: 'Essaim Diptera', color: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)', icon: 'group_work' },
    'Void Faction': { label: 'Néant Éternel', color: '#d8b4fe', glow: 'rgba(216, 180, 254, 0.4)', icon: 'brightness_empty' }
  }

  // Calculate statistics
  const totalUniqueInDb = CARDS_DATABASE.length
  
  const ownedUniqueCount = useMemo(() => {
    return Object.keys(ownedCards).filter(id => (ownedCards[id] || 0) > 0).length
  }, [ownedCards])

  const completionPercentage = useMemo(() => {
    if (totalUniqueInDb === 0) return 0
    return Math.round((ownedUniqueCount / totalUniqueInDb) * 100)
  }, [ownedUniqueCount, totalUniqueInDb])

  // Guild Title based on collection size
  const guildTitle = useMemo(() => {
    if (ownedUniqueCount >= 30) return "Archimage de l'Aether"
    if (ownedUniqueCount >= 20) return "Seigneur du Grimoire"
    if (ownedUniqueCount >= 10) return "Maître des Runes"
    if (ownedUniqueCount >= 5) return "Apprenti Invocateur"
    return "Novice de la Source"
  }, [ownedUniqueCount])

  // Calculate Favorite Faction
  const favoriteFactionInfo = useMemo(() => {
    const factionCounts: Record<string, number> = {}
    CARDS_DATABASE.forEach(card => {
      const count = ownedCards[card.id] || 0
      if (count > 0) {
        factionCounts[card.faction] = (factionCounts[card.faction] || 0) + count
      }
    })
    
    let bestFaction = 'Aucune'
    let maxCount = 0
    
    Object.entries(factionCounts).forEach(([faction, count]) => {
      if (count > maxCount) {
        maxCount = count
        bestFaction = faction
      }
    })

    return {
      name: bestFaction,
      details: FACTION_MAP[bestFaction] || { label: 'Aucune Faction', color: '#a1a1aa', glow: 'rgba(161, 161, 170, 0.2)', icon: 'help_outline' }
    }
  }, [ownedCards])

  // Dynamic Achievements
  const achievements = useMemo(() => {
    // 1. Sceau de l'Invocateur: possess >= 10 unique cards
    const summonerUnlocked = ownedUniqueCount >= 10

    // 2. Seigneur des Cieux: possess at least one rare or mythic Avian/Oiseau card
    const avianUnlocked = CARDS_DATABASE.some(
      card => card.faction === 'Oiseau' && 
      (card.rarity === 'rare' || card.rarity === 'mythic') && 
      (ownedCards[card.id] || 0) > 0
    )

    // 3. Dominateur des Abysses: possess at least one mythic Poisson card
    const abyssUnlocked = CARDS_DATABASE.some(
      card => card.faction === 'Poisson' && 
      card.rarity === 'mythic' && 
      (ownedCards[card.id] || 0) > 0
    )

    // 4. Maître de la Ruche: possess Queen Solenopsis (fourmi_reine)
    const antQueenUnlocked = (ownedCards['fourmi_reine'] || 0) > 0

    // 5. Trésorier de l'Ordre: hold >= 5000 gold
    const treasurerUnlocked = gold >= 5000

    return [
      {
        id: 'summoner_seal',
        title: "Sceau de l'Invocateur",
        description: "Rassemblez 10 cartes uniques dans votre Grimoire.",
        icon: 'menu_book',
        unlocked: summonerUnlocked,
        glowColor: 'rgba(183, 109, 255, 0.4)',
        borderColor: '#842bd2'
      },
      {
        id: 'avian_seal',
        title: "Seigneur des Cieux",
        description: "Obtenez un Oiseau Rare ou Mythique dans votre collection.",
        icon: 'air',
        unlocked: avianUnlocked,
        glowColor: 'rgba(56, 189, 248, 0.4)',
        borderColor: '#38bdf8'
      },
      {
        id: 'abyss_seal',
        title: "Dominateur des Abysses",
        description: "Incorporez une créature Aquatique Mythique des profondeurs.",
        icon: 'waves',
        unlocked: abyssUnlocked,
        glowColor: 'rgba(6, 182, 212, 0.4)',
        borderColor: '#06b6d4'
      },
      {
        id: 'ant_queen_seal',
        title: "Maître de la Ruche",
        description: "Obtenez la légendaire Reine Fourmi Solenopsis dans votre deck.",
        icon: 'pest_control',
        unlocked: antQueenUnlocked,
        glowColor: 'rgba(233, 195, 73, 0.4)',
        borderColor: '#e9c349'
      },
      {
        id: 'treasurer_seal',
        title: "Trésorier de l'Ordre",
        description: "Accumulez plus de 5 000 pièces d'Or dans votre bourse.",
        icon: 'toll',
        unlocked: treasurerUnlocked,
        glowColor: 'rgba(244, 63, 94, 0.4)',
        borderColor: '#f43f5e'
      }
    ]
  }, [ownedUniqueCount, ownedCards, gold])

  // Sync settings and meditation variables to localStorage
  useEffect(() => {
    localStorage.setItem('arcanima_profile_xp', String(xp))
    localStorage.setItem('arcanima_profile_level', String(level))
  }, [xp, level])

  useEffect(() => {
    localStorage.setItem('arcanima_setting_ambient', String(ambientAudio))
  }, [ambientAudio])

  useEffect(() => {
    localStorage.setItem('arcanima_setting_sfx', String(sfxVolume))
  }, [sfxVolume])

  // Handle page navigation helper
  const handleNavigation = (page: 'home' | 'library' | 'decks' | 'market' | 'profile' | 'play') => {
    if (page !== 'play') {
      setActiveNav(page as 'home' | 'library' | 'decks' | 'market' | 'profile')
    }
    onNavigate(page)
  }

  // Handle pseudo change save
  const handleSavePseudo = () => {
    const trimmed = tempPseudo.trim()
    if (!trimmed) {
      setPseudoMessage("⚠️ Le pseudonyme ne peut pas être vide")
      return
    }
    if (trimmed.length > 25) {
      setPseudoMessage("⚠️ Limité à 25 caractères")
      return
    }
    onChangePseudonym(trimmed)
    setIsEditingPseudo(false)
    setPseudoMessage("✨ Pseudo gravé avec succès dans l'Aether")
    setTimeout(() => setPseudoMessage(null), 3000)
    spawnMagicParticles(15, '#e9c349')
  }

  // Meditate button click adds XP and handles level up
  const handleMeditate = () => {
    const xpToAdd = 250
    const maxBarXp = level * 300 + 2000 // Level 14: 6200 XP
    
    spawnMagicParticles(25, '#b76dff')

    setXp(prev => {
      let nextXp = prev + xpToAdd
      if (nextXp >= maxBarXp) {
        // Level up!
        nextXp = nextXp - maxBarXp
        setLevel(lvl => lvl + 1)
        setShowLevelUpEffect(true)
        spawnMagicParticles(50, '#e9c349')
      }
      return nextXp
    })
  }

  // Reset modal handlers
  const handleTriggerReset = () => {
    setResetConfirmText('')
    setResetError(false)
    setShowResetModal(true)
  }

  const handleConfirmReset = () => {
    if (resetConfirmText.toUpperCase() === 'OUBLI') {
      onResetAll()
      setShowResetModal(false)
      // Reset local states
      setXp(4850)
      setLevel(14)
    } else {
      setResetError(true)
    }
  }

  // Dev add resources trigger with custom effect
  const handleAddResourcesWithEffect = () => {
    onAddResources()
    spawnMagicParticles(30, '#e9c349')
  }

  // Magic particle animator engine
  const spawnMagicParticles = (count: number, color: string) => {
    const newParticles: Particle[] = []
    const startX = window.innerWidth / 2
    const startY = window.innerHeight / 2

    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Math.random() + i,
        x: startX + (Math.random() - 0.5) * 200,
        y: startY + (Math.random() - 0.5) * 200,
        color,
        size: Math.random() * 8 + 4,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 6 + 2,
        opacity: 1
      })
    }
    setParticles(prev => [...prev, ...newParticles])
  }

  useEffect(() => {
    if (particles.length === 0) return

    const interval = setInterval(() => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + Math.cos(p.angle) * p.speed,
            y: p.y - p.speed - (Math.random() * 2), // Move upwards
            opacity: p.opacity - 0.04
          }))
          .filter(p => p.opacity > 0)
      )
    }, 30)

    return () => clearInterval(interval)
  }, [particles])

  const maxBarXp = level * 300 + 2000
  const xpPercentage = Math.min(100, Math.max(0, (xp / maxBarXp) * 100))

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0F12] relative overflow-x-hidden antialiased select-none pb-24 md:pb-6">
      
      {/* Visual Floating Particle Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full filter blur-[1px] transition-all duration-300 ease-out"
            style={{
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              opacity: p.opacity,
              boxShadow: `0 0 10px ${p.color}, 0 0 20px ${p.color}`
            }}
          />
        ))}
      </div>

      {/* Level Up Celebration Overlay */}
      {showLevelUpEffect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md animate-fade-in">
          <div className="p-8 max-w-md w-full bg-[#16121A] border-2 border-tertiary rounded-xl card-frame text-center card-glow flex flex-col items-center gap-6">
            <span className="material-symbols-outlined text-[64px] text-tertiary animate-bounce" style={{ fontVariationSettings: "'FILL' 1" }}>
              workspace_premium
            </span>
            <h2 className="text-display-sm font-display-md text-primary drop-shadow-[0_0_20px_rgba(221,183,255,0.8)]">
              Éveil Supérieur !
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Votre maîtrise de l'Aether s'est accrue. Vous atteignez le rang spirituel de :
            </p>
            <div className="text-headline-md font-bold text-tertiary uppercase tracking-widest px-6 py-2 border border-tertiary/40 bg-surface-container-high rounded">
              Niveau {level}
            </div>
            <p className="text-label-sm text-primary/80 italic">
              "Les flux arcaniques résonnent à votre unisson."
            </p>
            <button
              onClick={() => setShowLevelUpEffect(false)}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-primary-container to-inverse-primary border border-tertiary text-on-primary-container font-bold rounded-DEFAULT active:scale-95 transition-all shadow-[0_0_15px_rgba(183,109,255,0.4)]"
            >
              Fermer le Sceau
            </button>
          </div>
        </div>
      )}

      {/* Navigation App Bar */}
      <TopAppBar
        title=""
        activePage="profile"
        onNavigate={handleNavigation}
        gold={gold}
        gems={gems}
        onAddResources={handleAddResourcesWithEffect}
      />

      <main className="flex-grow pt-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
        
        {/* Legendary Header Identity Card */}
        <section className="relative w-full mb-12 p-1 border border-outline-variant bg-[#16121A] rounded-xl overflow-hidden card-glow shadow-[0_0_40px_rgba(132,43,210,0.15)]">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-950/10 via-transparent to-yellow-950/10 z-0"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 p-6 md:p-8 parchment-bg rounded-lg">
            
            {/* Mage Avatar Frame */}
            <div className="relative group">
              {/* Spinning magic outer border */}
              <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-tertiary via-primary to-[#842bd2] opacity-75 blur-md group-hover:opacity-100 group-hover:animate-spin duration-1000"></div>
              
              <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-[#16121A] overflow-hidden bg-surface-container-high shadow-2xl flex items-center justify-center">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAn_jA-IjWvpOZdDTuenCy_iwIdLgNcQxlSIzqKcJwyUDO3NTTDs-wRm_zBN5b7PYhhz8R2TxKD9ebPDwIrnrlsxheAsJ7_6eEJmN9XYzKkl3cSzEh8B4yIC6v6hTICV-Ah30cIf-Rqofb-glgB4kF_RhvPIbIuGlHefVktbCODUMHOtk7nk2GxjFWzChd9JeyUNBSpgB1TAu7W-WVqX_rO_ZpRm5Ig2aSMgTa-fRBUh2CgEkUOalbtORZpCClagculhSyDupxq2sc" 
                  alt="Avatar Sorcière"
                  className="w-full h-full object-cover select-none scale-105 group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-tertiary border-2 border-[#16121A] flex items-center justify-center text-[#16121A] shadow-md">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
            </div>

            {/* Identity Details & Name Editor */}
            <div className="flex-grow text-center md:text-left flex flex-col gap-3 w-full">
              <div className="flex flex-col md:flex-row md:items-center gap-2 justify-center md:justify-start">
                
                {isEditingPseudo ? (
                  <div className="flex items-center gap-2 justify-center md:justify-start w-full md:w-auto">
                    <input
                      type="text"
                      value={tempPseudo}
                      onChange={(e) => setTempPseudo(e.target.value)}
                      className="bg-black/40 border border-tertiary px-3 py-1 text-headline-sm font-bold text-tertiary rounded focus:outline-none focus:ring-2 focus:ring-primary recessed-input w-full max-w-[280px]"
                      placeholder="Pseudonyme mystique"
                      maxLength={25}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSavePseudo()
                        if (e.key === 'Escape') {
                          setIsEditingPseudo(false)
                          setTempPseudo(pseudonym)
                        }
                      }}
                    />
                    <button 
                      onClick={handleSavePseudo} 
                      className="p-2 bg-primary-container text-on-primary-container border border-tertiary rounded hover:bg-primary-container/80 transition-colors"
                      title="Graver le pseudonyme"
                    >
                      <span className="material-symbols-outlined text-sm font-bold">check</span>
                    </button>
                    <button 
                      onClick={() => {
                        setIsEditingPseudo(false)
                        setTempPseudo(pseudonym)
                      }} 
                      className="p-2 bg-surface-container-high border border-outline rounded hover:bg-surface-container-high/80 transition-colors"
                      title="Annuler"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <h1 className="text-headline-lg font-bold text-primary tracking-wide drop-shadow-[0_0_15px_rgba(221,183,255,0.4)]">
                      {pseudonym}
                    </h1>
                    <button
                      onClick={() => setIsEditingPseudo(true)}
                      className="p-1 hover:text-tertiary text-on-surface-variant transition-colors"
                      title="Renommer l'Aventurier"
                    >
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Status messages */}
              {pseudoMessage && (
                <div className={`text-label-sm font-semibold transition-all duration-300 ${pseudoMessage.includes('⚠️') ? 'text-error' : 'text-tertiary'}`}>
                  {pseudoMessage}
                </div>
              )}

              {/* Guild Title Badge */}
              <div className="flex justify-center md:justify-start">
                <span className="rune-chip px-4 py-1 text-label-md font-bold text-tertiary flex items-center gap-2 rounded border border-tertiary/40 tracking-wider">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">workspace_premium</span>
                  {guildTitle}
                </span>
              </div>

              {/* Experience Level Progress Bar */}
              <div className="mt-4 w-full flex flex-col gap-2">
                <div className="flex justify-between items-end text-label-md font-bold tracking-wider">
                  <span className="text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">bolt</span>
                    NIVEAU SPIRITUEL {level}
                  </span>
                  <span className="text-on-surface-variant">
                    {xp.toLocaleString()} / {maxBarXp.toLocaleString()} XP
                  </span>
                </div>
                
                {/* Visual Brutalist Level Bar */}
                <div className="relative w-full h-5 bg-black/60 rounded border border-[#4d4354] overflow-hidden recessed-input p-[2px]">
                  <div 
                    className="h-full bg-gradient-to-r from-[#842bd2] via-[#b76dff] to-tertiary rounded-sm shadow-[0_0_10px_rgba(233,195,73,0.5)] transition-all duration-700 ease-out"
                    style={{ width: `${xpPercentage}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-tertiary font-bold tracking-widest pointer-events-none opacity-80">
                    CANALISATION D'ESSENCE AETHÉRIQUE
                  </div>
                </div>

                <div className="flex justify-center md:justify-end mt-1">
                  <button 
                    onClick={handleMeditate}
                    className="action-button px-4 py-1.5 flex items-center gap-2 text-label-sm font-bold text-tertiary rounded cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">self_improvement</span>
                    Méditer (+250 XP)
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Bento Grid Dynamic Statistics */}
        <section className="mb-12">
          <h2 className="text-headline-md font-bold text-primary mb-6 flex items-center gap-2 tracking-wide">
            <span className="material-symbols-outlined text-tertiary">analytics</span>
            Bento des Statistiques Mystiques
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Stat 1: Cards Owned */}
            <div className="card-frame p-6 flex flex-col justify-between items-start h-[170px] transition-transform duration-300 hover:scale-[1.02]">
              <div className="flex justify-between w-full">
                <span className="text-label-md font-bold text-on-surface-variant uppercase tracking-widest">Grimoire</span>
                <span className="material-symbols-outlined text-primary text-[28px]">grid_view</span>
              </div>
              <div className="flex flex-col gap-1 w-full mt-2">
                <div className="text-display-xs font-bold text-primary">
                  {ownedUniqueCount} <span className="text-label-md font-normal text-on-surface-variant">/ {totalUniqueInDb}</span>
                </div>
                <div className="text-label-sm text-tertiary font-semibold">
                  {completionPercentage}% des cartes scellées
                </div>
              </div>
              {/* Miniature completion bar */}
              <div className="w-full h-1.5 bg-black/40 rounded overflow-hidden mt-3">
                <div className="h-full bg-primary" style={{ width: `${completionPercentage}%` }}></div>
              </div>
            </div>

            {/* Stat 2: Total Wealth */}
            <div className="card-frame p-6 flex flex-col justify-between items-start h-[170px] transition-transform duration-300 hover:scale-[1.02]">
              <div className="flex justify-between w-full">
                <span className="text-label-md font-bold text-on-surface-variant uppercase tracking-widest">Trésor Cumulé</span>
                <span className="material-symbols-outlined text-tertiary text-[28px]">toll</span>
              </div>
              <div className="flex flex-col gap-2 w-full mt-2">
                <div className="flex items-center gap-1.5 text-title-lg font-bold text-tertiary">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>toll</span>
                  {gold.toLocaleString()} <span className="text-label-sm text-on-surface-variant font-normal">Or</span>
                </div>
                <div className="flex items-center gap-1.5 text-title-lg font-bold text-primary">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
                  {gems.toLocaleString()} <span className="text-label-sm text-on-surface-variant font-normal">Joyaux</span>
                </div>
              </div>
              <div className="text-[11px] text-on-surface-variant uppercase font-mono tracking-widest mt-2 border-t border-outline-variant/30 pt-1.5 w-full">
                Richesse de l'Aventurier
              </div>
            </div>

            {/* Stat 3: Favorite Faction */}
            <div 
              className="card-frame p-6 flex flex-col justify-between items-start h-[170px] transition-transform duration-300 hover:scale-[1.02]"
              style={{ boxShadow: `inset 0 0 15px ${favoriteFactionInfo.details.glow}` }}
            >
              <div className="flex justify-between w-full">
                <span className="text-label-md font-bold text-on-surface-variant uppercase tracking-widest">Affiliation Faction</span>
                <span 
                  className="material-symbols-outlined text-[28px]"
                  style={{ color: favoriteFactionInfo.details.color }}
                >
                  {favoriteFactionInfo.details.icon}
                </span>
              </div>
              <div className="flex flex-col gap-1 w-full mt-2">
                <div 
                  className="text-title-lg font-bold uppercase tracking-wider"
                  style={{ color: favoriteFactionInfo.details.color }}
                >
                  {favoriteFactionInfo.details.label}
                </div>
                <div className="text-label-sm text-on-surface-variant">
                  {favoriteFactionInfo.name === 'Aucune' ? 'Aucune carte en possession' : 'Faction dominante de vos decks'}
                </div>
              </div>
              <div className="w-full flex items-center gap-2 mt-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: favoriteFactionInfo.details.color }} />
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-mono">Alignement Spirituel</span>
              </div>
            </div>

            {/* Stat 4: Broken Seals Packs */}
            <div className="card-frame p-6 flex flex-col justify-between items-start h-[170px] transition-transform duration-300 hover:scale-[1.02]">
              <div className="flex justify-between w-full">
                <span className="text-label-md font-bold text-on-surface-variant uppercase tracking-widest">Boosters Ouverts</span>
                <span className="material-symbols-outlined text-primary text-[28px]">lock_open</span>
              </div>
              <div className="flex flex-col gap-1 w-full mt-2">
                <div className="text-display-xs font-bold text-primary">
                  {packsOpened} <span className="text-label-md font-normal text-on-surface-variant">boosters</span>
                </div>
                <div className="text-label-sm text-[#e9c349] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">stars</span>
                  {packsOpened * 5} sceaux d'aether brisés
                </div>
              </div>
              <div className="text-[10px] text-on-surface-variant font-mono tracking-widest uppercase mt-3">
                Progression des archives
              </div>
            </div>

          </div>
        </section>

        {/* Achievement Seals list */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-tertiary">military_tech</span>
            <h2 className="text-headline-md font-bold text-primary tracking-wide">
              Sceaux de Succès (Mystic Achievements)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((ach) => (
              <div 
                key={ach.id}
                className={`relative p-5 rounded-lg border-2 transition-all duration-300 ${
                  ach.unlocked 
                    ? 'bg-[#1a1523] border-[#842bd2]/70 card-glow shadow-[0_0_20px_rgba(132,43,210,0.1)]' 
                    : 'bg-[#121214]/60 border-outline-variant opacity-50'
                }`}
                style={ach.unlocked ? { 
                  borderColor: ach.borderColor,
                  boxShadow: `0 0 15px ${ach.glowColor}, inset 0 0 10px ${ach.glowColor}` 
                } : {}}
              >
                
                {/* Seal Icon */}
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded border flex items-center justify-center ${
                    ach.unlocked 
                      ? 'bg-black/40 text-tertiary border-tertiary/60' 
                      : 'bg-black/20 text-on-surface-variant border-outline-variant'
                  }`}>
                    <span className="material-symbols-outlined text-[32px]">{ach.icon}</span>
                  </div>
                  
                  <div className="flex-grow flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <h3 className={`text-title-md font-bold tracking-wide ${ach.unlocked ? 'text-primary' : 'text-on-surface-variant'}`}>
                        {ach.title}
                      </h3>
                      {ach.unlocked ? (
                        <span className="material-symbols-outlined text-tertiary text-[20px] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                          task_alt
                        </span>
                      ) : (
                        <span className="material-symbols-outlined text-on-surface-variant/70 text-[20px]">
                          lock
                        </span>
                      )}
                    </div>
                    
                    <p className="text-body-sm text-on-surface-variant leading-relaxed">
                      {ach.description}
                    </p>

                    <div className="mt-2 flex items-center justify-between w-full">
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${ach.unlocked ? 'text-tertiary' : 'text-on-surface-variant/60'}`}>
                        {ach.unlocked ? '🔮 Sceau Brisé' : '🔒 Sceau Scellé'}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </section>

        {/* Configuration and Cheat Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Audio Config Block */}
          <div className="card-frame p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-outline-variant pb-3">
              <span className="material-symbols-outlined text-tertiary">settings</span>
              <h3 className="text-title-lg font-bold text-primary tracking-wide uppercase">
                Paramètres du Grimoire
              </h3>
            </div>

            <div className="flex flex-col gap-6">
              
              {/* Ambient audio simulation */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-body-md font-bold text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[20px]">music_note</span>
                    Ambiance des Anciens
                  </span>
                  <span className="text-label-sm text-on-surface-variant">
                    Simuler la musique d'ambiance en arrière-plan
                  </span>
                </div>
                <button
                  onClick={() => setAmbientAudio(prev => !prev)}
                  className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 focus:outline-none ${ambientAudio ? 'bg-[#842bd2]' : 'bg-black/60 border border-outline'}`}
                >
                  <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${ambientAudio ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Sound effects volume bar */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-body-md font-bold text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[20px]">volume_up</span>
                    Volume des Runes & Éventails
                  </span>
                  <span className="text-label-sm font-mono font-bold text-tertiary">
                    {sfxVolume}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sfxVolume}
                  onChange={(e) => setSfxVolume(Number(e.target.value))}
                  className="w-full accent-primary bg-black/60 h-2 rounded border border-outline-variant focus:outline-none cursor-pointer"
                />
              </div>

            </div>
          </div>

          {/* Master Rites & cheats Block */}
          <div className="card-frame p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-outline-variant pb-3">
              <span className="material-symbols-outlined text-tertiary">component_exchange</span>
              <h3 className="text-title-lg font-bold text-primary tracking-wide uppercase">
                Rites d'Aether & Sortilèges
              </h3>
            </div>

            <div className="flex flex-col gap-4">
              
              {/* Cheat Bonus Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-black/40 rounded border border-outline-variant/60">
                <div className="flex flex-col text-center sm:text-left">
                  <span className="text-body-md font-bold text-[#e9c349] flex items-center gap-1.5 justify-center sm:justify-start">
                    <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                    Forger l'Aether
                  </span>
                  <span className="text-label-sm text-on-surface-variant">
                    Octroyer +1 000 pièces d'Or et +100 Joyaux
                  </span>
                </div>
                <button
                  onClick={handleAddResourcesWithEffect}
                  className="action-button px-5 py-2 text-label-md font-bold text-[#e9c349] rounded cursor-pointer whitespace-nowrap"
                >
                  Déclencher le Cheat
                </button>
              </div>

              {/* Master Reset Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-black/40 rounded border border-outline-variant/60">
                <div className="flex flex-col text-center sm:text-left">
                  <span className="text-body-md font-bold text-error flex items-center gap-1.5 justify-center sm:justify-start">
                    <span className="material-symbols-outlined text-[20px]">delete_forever</span>
                    Rite d'Oubli Absolu
                  </span>
                  <span className="text-label-sm text-on-surface-variant">
                    Réinitialiser le compte et l'aventure à zéro
                  </span>
                </div>
                <button
                  onClick={handleTriggerReset}
                  className="px-5 py-2 bg-gradient-to-r from-red-950 to-red-700 hover:from-red-900 hover:to-red-600 text-white border border-red-500 font-bold text-label-md rounded active:scale-95 transition-all cursor-pointer whitespace-nowrap shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                >
                  Rite d'Oubli
                </button>
              </div>

            </div>
          </div>

        </section>

      </main>

      {/* Double Confirmation Reset Modal Dialog */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md bg-[#16121A] border-2 border-error rounded-xl p-6 card-frame text-center card-glow flex flex-col gap-6 shadow-[0_0_50px_rgba(239,68,68,0.3)]">
            <div className="flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-[64px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                warning
              </span>
            </div>
            
            <div className="flex flex-col gap-2">
              <h3 className="text-headline-sm font-bold text-error uppercase tracking-wide">
                Rite d'Oubli Absolu
              </h3>
              <p className="text-body-md text-on-surface-variant">
                Ce rite effacera irrévocablement votre pseudonyme mystique, votre or, vos joyaux, vos decks créés et votre collection de cartes !
              </p>
            </div>

            <div className="flex flex-col gap-3 text-left">
              <label className="text-label-sm font-bold text-primary uppercase">
                Écrivez "OUBLI" pour sceller le rite :
              </label>
              <input
                type="text"
                value={resetConfirmText}
                onChange={(e) => {
                  setResetConfirmText(e.target.value)
                  setResetError(false)
                }}
                className="bg-black/60 border border-outline-variant px-3 py-2 text-title-md text-center text-error font-bold uppercase rounded focus:outline-none focus:ring-2 focus:ring-error recessed-input font-mono"
                placeholder="ÉCRIVEZ ICI..."
              />
              {resetError && (
                <span className="text-[12px] text-error font-bold text-center">
                  ⚠️ Mot de sceau incorrect. Veuillez écrire exactement "OUBLI".
                </span>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 px-4 py-2 bg-surface-container-high border border-outline text-primary font-bold rounded hover:bg-surface-container-high/80 transition-colors"
              >
                Conserver l'Âme
              </button>
              
              <button
                onClick={handleConfirmReset}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-red-800 to-red-600 border border-error text-white font-bold rounded active:scale-95 transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              >
                Brûler le Sceau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navbar */}
      <BottomNavBar activePage={activeNav} onNavigate={handleNavigation} />

    </div>
  )
}

export default ProfilePage
