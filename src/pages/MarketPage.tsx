import React, { useState, useMemo } from 'react'
import { TopAppBar, BottomNavBar } from '../components/Navigation'
import { Footer } from '../components/Footer'
import { CARDS_DATABASE, CardData } from '../data/cards'

interface MarketPageProps {
  onNavigate: (page: 'home' | 'library' | 'decks' | 'market' | 'card-detail' | 'profile' | 'play', cardId?: string) => void
  gold: number
  gems: number
  ownedCards: Record<string, number>
  onBuyCard: (cardId: string, cost: number, currency: 'gold' | 'gems') => boolean
  onAddCards: (cardIds: string[]) => void
  onAddResources: () => void
  theme?: 'light' | 'dark'
  onToggleTheme?: () => void
}

interface BoosterPackConfig {
  id: string
  name: string
  description: string
  goldCost: number
  gemCost: number
  factionKey: 'formica' | 'oiseau' | 'poisson'
  image: string
  themeColor: string
}

export const MarketPage: React.FC<MarketPageProps> = ({ 
  onNavigate, 
  gold, 
  gems, 
  ownedCards,
  onBuyCard,
  onAddCards,
  onAddResources
}) => {
  const [activeNav, setActiveNav] = useState<'home' | 'library' | 'decks' | 'market' | 'profile' | 'play'>('market')
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false)
  const [purchasedItemName, setPurchasedItemName] = useState('')

  const handleNavigation = (page: 'home' | 'library' | 'decks' | 'market' | 'profile' | 'play') => {
    if (page !== 'play') {
      setActiveNav(page as 'home' | 'library' | 'decks' | 'market' | 'profile')
    }
    onNavigate(page)
  }

  // Booster opening ritual states
  const [ritualActive, setRitualActive] = useState(false)
  const [currentPackName, setCurrentPackName] = useState('')
  const [drawnCards, setDrawnCards] = useState<CardData[]>([])
  const [flippedStatus, setFlippedStatus] = useState<boolean[]>([false, false, false, false, false])

  // 3 Booster Packs configs
  const boosterPacks: BoosterPackConfig[] = [
    {
      id: 'pack_formica',
      name: 'Booster Légions Formica',
      description: 'Développez votre armée souterraine. Contient uniquement des cartes de l\'édition Fourmi.',
      goldCost: 150,
      gemCost: 15,
      factionKey: 'formica',
      image: '/fourmie/dieux/1778245235237.png',
      themeColor: '#4edea3' // Formica green glow
    },
    {
      id: 'pack_oiseau',
      name: 'Booster Tempête des Cieux',
      description: 'Libérez la puissance céleste. Contient uniquement des cartes de l\'édition Oiseau.',
      goldCost: 150,
      gemCost: 15,
      factionKey: 'oiseau',
      image: '/oiseau/bête mythique/686952428_1471937274679834_8454975097756047307_n.jpg',
      themeColor: '#7cd2ff' // Light blue cyan glow
    },
    {
      id: 'pack_poisson',
      name: 'Booster Abysses Océaniques',
      description: 'Plongez dans les secrets du Néant aquatique. Contient uniquement des cartes de l\'édition Poisson.',
      goldCost: 150,
      gemCost: 15,
      factionKey: 'poisson',
      image: '/poisson/dieux/1778510652455.png',
      themeColor: '#3b82f6' // Ocean blue glow
    }
  ]

  // Real Card Offers (Special Offers)
  const specialOffers = useMemo(() => {
    // Pick 4 real distinct cool cards
    const offerIds = ['fourmi_reine', 'sun_wukong', 'fourmi_ouvriere_majeure', 'belzebuth']
    return offerIds.map(id => CARDS_DATABASE.find(c => c.id === id)).filter(Boolean) as CardData[]
  }, [])

  // Helper to determine cost/currency of special offers
  const getOfferCost = (cardId: string) => {
    switch (cardId) {
      case 'fourmi_reine': return { amount: 1500, currency: 'gold' as const }
      case 'sun_wukong': return { amount: 120, currency: 'gems' as const }
      case 'fourmi_ouvriere_majeure': return { amount: 200, currency: 'gold' as const }
      case 'belzebuth': return { amount: 800, currency: 'gold' as const }
      default: return { amount: 500, currency: 'gold' as const }
    }
  }

  // TCG Booster pack generation algorithm
  const generatePack = (factionKey: 'formica' | 'oiseau' | 'poisson'): CardData[] => {
    const drawn: CardData[] = []
    let candidates: CardData[] = []

    if (factionKey === 'formica') {
      candidates = CARDS_DATABASE.filter(c => c.faction === 'Formica')
    } else if (factionKey === 'oiseau') {
      candidates = CARDS_DATABASE.filter(c => c.faction === 'Oiseau')
    } else if (factionKey === 'poisson') {
      candidates = CARDS_DATABASE.filter(c => c.faction === 'Poisson')
    } else {
      candidates = CARDS_DATABASE
    }

    const drawOne = (pool: CardData[]): CardData => {
      const idx = Math.floor(Math.random() * pool.length)
      return pool[idx]
    }

    // Draw 4 cards matching the theme strictly
    for (let i = 0; i < 4; i++) {
      drawn.push(drawOne(candidates))
    }
    // Draw 1 guaranteed Rare or Mythic matching the theme strictly to make it exciting
    const excitingPool = candidates.filter(c => c.rarity === 'rare' || c.rarity === 'mythic')
    if (excitingPool.length > 0) {
      drawn.push(drawOne(excitingPool))
    } else {
      drawn.push(drawOne(candidates))
    }

    // Shuffle final 5
    return drawn.sort(() => Math.random() - 0.5)
  }

  // Buying packs
  const handleBuyPack = (pack: BoosterPackConfig, currency: 'gold' | 'gems') => {
    const cost = currency === 'gold' ? pack.goldCost : pack.gemCost
    const balance = currency === 'gold' ? gold : gems

    if (balance < cost) {
      alert(`Essence de ${currency === 'gold' ? 'Or' : 'Joyaux'} insuffisante pour ce Booster !`)
      return
    }

    // Deduct currency through onBuyCard (since we just need resource deduction, we can make it a helper or buy a dummy key, but wait: onBuyCard returns boolean! Let's pass a special transaction or execute it directly!)
    // Wait, onBuyCard can take any id, so let's pass the pack.id!
    const success = onBuyCard(pack.id, cost, currency)
    if (success) {
      // Draw cards
      const newCards = generatePack(pack.factionKey)
      setDrawnCards(newCards)
      setFlippedStatus([false, false, false, false, false])
      setCurrentPackName(pack.name)
      setRitualActive(true)
    }
  }

  // Buying single cards
  const handleBuyCard = (card: CardData) => {
    const costSpec = getOfferCost(card.id)
    const success = onBuyCard(card.id, costSpec.amount, costSpec.currency)
    
    if (success) {
      setPurchasedItemName(`${card.title} (${card.type})`)
      setShowPurchaseDialog(true)
    } else {
      alert(`Vous ne possédez pas assez de devises (${costSpec.currency === 'gold' ? 'Or' : 'Joyaux'}) pour invoquer ${card.title} !`)
    }
  }

  // Flip interactions
  const handleCardFlip = (index: number) => {
    const updated = [...flippedStatus]
    updated[index] = true
    setFlippedStatus(updated)
  }

  const handleRevealAll = () => {
    setFlippedStatus([true, true, true, true, true])
  }

  const handleClaimCollection = () => {
    // Add all 5 cards to global collection
    onAddCards(drawnCards.map(c => c.id))
    setRitualActive(false)
  }

  // Card styles mapping
  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'mythic': return 'shadow-[0_0_35px_rgba(168,85,247,0.7)] border-primary'
      case 'rare': return 'shadow-[0_0_25px_rgba(78,222,163,0.5)] border-secondary'
      default: return 'shadow-[0_0_15px_rgba(100,100,100,0.2)] border-outline-variant'
    }
  }

  const getRarityTextColor = (rarity: string) => {
    switch (rarity) {
      case 'mythic': return 'text-primary'
      case 'rare': return 'text-secondary'
      default: return 'text-tertiary-fixed-dim'
    }
  }

  return (
    <div className="antialiased min-h-screen flex flex-col selection:bg-primary selection:text-on-primary bg-background">
      
      {/* Contain custom backface classes within a standard <style> tag so it works seamlessly inside windows webapp */}
      <style dangerouslySetInnerHTML={{__html: `
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}} />

      {/* TopNavBar */}
      <TopAppBar 
        title="" 
        activePage="market" 
        onNavigate={handleNavigation} 
        gold={gold}
        gems={gems}
        onAddResources={onAddResources}
      />

      {/* Main Content Canvas */}
      <main className="flex-grow pt-24 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full relative z-10">
        
        {/* Mobile Currency Display (Hidden on Desktop) */}
        <div 
          onClick={onAddResources} 
          title="Dev Helper: Ajouter ressources"
          className="md:hidden flex justify-between items-center mb-8 bg-surface-container-high p-4 rounded border border-outline-variant shadow-md cursor-pointer hover:border-tertiary active:scale-95 transition-all"
        >
          <div className="flex items-center gap-2 text-tertiary select-none">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>toll</span>
            <span className="text-label-sm font-label-sm">{gold.toLocaleString()} Gold</span>
          </div>
          <div className="flex items-center gap-2 text-primary select-none">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
            <span className="text-label-sm font-label-sm">{gems.toLocaleString()} Gems</span>
          </div>
        </div>

        {/* Main Banner: Hades Underworld theme */}
        <section className="mb-16 relative overflow-hidden card-frame min-h-[400px] flex items-center justify-start p-8 md:p-16 group rounded-xl">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-luminosity group-hover:scale-105 transition-transform duration-700" 
            style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBfax_a3bApGp_XYO1MJslf8DyY5WQbEO6I135_Gz28wY0GabU7D-KeJBkuneJSoX7cblPZA1fh2_HE7FQ3L5q6E3Uj8qcZO3DyP1Ljy18v6TA8G9cepB9Qj6LBU-574SHuysBrNS45b5MFagzD2qpidawpzpHkRzhL5BMnd4SwVTIEvWeGovfJ26wVwn5uHaIxFTAZANPLj0y1_yW7O5Hsr5ljJgaFBk6qtm2Zjz6iDALeTD3pNIMSdzyAERDaYctFBqtYN2VpxUM')` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest via-[#0e0e11]/80 to-transparent"></div>
          
          <div className="relative z-10 max-w-xl">
            <span className="rune-tag text-[10px] font-label-sm mb-4 inline-block tracking-widest uppercase">
              NOUVELLE EXTENSION
            </span>
            <h1 className="text-display-lg font-display-lg text-primary mb-4 drop-shadow-[0_0_10px_rgba(221,183,255,0.3)] leading-tight">
              Les Profondeurs d'Hadès
            </h1>
            <p className="text-body-lg font-body-lg text-on-surface-variant mb-8 leading-relaxed">
              Découvrez les secrets enfouis dans les abysses. Ouvrez des Boosters thématiques pour invoquer des alliés divins Rares et Mythiques !
            </p>
            <button 
              onClick={() => handleBuyPack(boosterPacks[2], 'gems')}
              className="action-button px-8 py-3 text-tertiary font-label-sm text-label-sm uppercase tracking-wider flex items-center gap-2"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                Booster Abysses - 15 Gems
              </span>
            </button>
          </div>
        </section>

        {/* Rayons de la Boutique / Category Bento Grid */}
        <section className="mb-16">
          <h3 className="font-title-md text-title-md text-inverse-surface mb-6 border-b border-outline-variant pb-4 select-none">
            Rayons du Marché
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-gutter">
            {/* Boosters */}
            <div 
              onClick={() => document.getElementById('boosters-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="card-frame rounded-xl p-4 md:p-6 flex flex-col justify-end items-center md:items-start gap-2 md:gap-0 relative overflow-hidden group cursor-pointer glow-hover h-32 md:h-64 shadow-[0_0_15px_rgba(168,85,247,0.1)] hover:shadow-[0_0_25px_rgba(168,85,247,0.25)] transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface/50 to-transparent z-10"></div>
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-30 md:opacity-40 group-hover:opacity-60 transition-opacity duration-300 mix-blend-screen"
                style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCuqbxhlNGA7SOLk6ABJjlWNQ9EhQ-694mLNWWbq7q-KGaxKy7WMN5Y6vtn1mD90x5t_ZiCxBl51Dgk5LsQ85wkhG-iIitUzSZ5gKpLzK2O47nlgcl6udO7Ui0XticXh2J7D05LTl_N9kP6gUezCHYcUfxXMOayVKGzKI7VFcksI8KqAO3fl9ReC5XupNI9QYWjEfhOEetU0w8yCzwZgi5rvxU7ISFBFzpmOrldq5RY9dbBggRwZ-L5Dc7RKTMSnaRcjnbPrAsJ2x0')` }}
              ></div>
              <div className="relative z-20 flex flex-col items-center md:items-start text-center md:text-left select-none">
                <span className="material-symbols-outlined text-primary mb-1 md:mb-2 text-3xl md:text-4xl drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{ fontVariationSettings: "'FILL' 1" }}>style</span>
                <h2 className="text-title-md font-title-md text-inverse-surface">Boosters</h2>
                <p className="hidden md:block text-body-md font-body-md text-on-surface-variant mt-1">Élargissez votre collection</p>
              </div>
            </div>

            {/* Cartes à l'unité */}
            <div 
              onClick={() => document.getElementById('cards-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="card-frame rounded-xl p-4 md:p-6 flex flex-col justify-end items-center md:items-start gap-2 md:gap-0 relative overflow-hidden group cursor-pointer glow-hover h-32 md:h-64 shadow-[0_0_15px_rgba(233,195,73,0.1)] hover:shadow-[0_0_25px_rgba(233,195,73,0.25)] transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface/50 to-transparent z-10"></div>
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-30 md:opacity-40 group-hover:opacity-60 transition-opacity duration-300 mix-blend-screen"
                style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBw9fJvgEdxN8VVDQJCaUQocT4RkKSyYyaA-8uM3kM-yG20Lt_JoANhNLA0a1qyZonu3JpZvBn4uLgpSI91VyCFTby-JcPGegBHPGyGKcTKXtN2XgvJtCc7vFdyuv9EqPLsK-fID-LN6NXFifIF0UdQrhZ-1Kml2X--lFSP0HfXxE5GCQNnU73I7D-ytBPCvjxvpKxX83Y7DSloYbaAcuDpvoApqP-B1f04E_mhHbSvkFF9VCQWfALRyO689Xf3JBvh2VU338ZMbnE')` }}
              ></div>
              <div className="relative z-20 flex flex-col items-center md:items-start text-center md:text-left select-none">
                <span className="material-symbols-outlined text-tertiary mb-1 md:mb-2 text-3xl md:text-4xl drop-shadow-[0_0_10px_rgba(233,195,73,0.5)]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <h2 className="text-title-md font-title-md text-inverse-surface">Cartes à l'Unité</h2>
                <p className="hidden md:block text-body-md font-body-md text-on-surface-variant mt-1">Trouvez la pièce manquante</p>
              </div>
            </div>

            {/* Accessoires */}
            <div 
              onClick={() => alert("Les protège-cartes et tapis de combat physiques seront bientôt forgés par le Grand Conseil !")}
              className="card-frame rounded-xl p-4 md:p-6 flex flex-col justify-end items-center md:items-start gap-2 md:gap-0 relative overflow-hidden group cursor-pointer glow-hover h-24 md:h-64 col-span-2 md:col-span-1 shadow-[0_0_15px_rgba(78,222,163,0.1)] hover:shadow-[0_0_25px_rgba(78,222,163,0.25)] transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface/50 to-transparent z-10"></div>
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-30 md:opacity-40 group-hover:opacity-60 transition-opacity duration-300 mix-blend-screen"
                style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuA0qD8yAQ_LJhV4mehWu2V1lXGbOOmpnQjJv757v0Si-Nbp4NjQtQnIe8VRac0_EmgOh-ks8LQkFA4y-9Ma54rgi7G3Dz2MC9Lq2_yeQtjSZf2a4OqT-J0wkMp8tn-RL1cq3ANcxSIRyfNQEy_KDCRLlgeKEW1RSGtaQ6aTv-HHao_AnAxVzr1S3RWJm5eS6RH3kl98vY8xPUlaZvfztRXi4sdAwYWbf7q0ZuUFLLDuH56ZOvMnd-essydBF-yIYy_7W01LZ0nfi-Q')` }}
              ></div>
              <div className="relative z-20 flex flex-col md:flex-row md:items-end justify-between w-full select-none gap-2 md:gap-0">
                <div className="flex flex-col items-center md:items-start">
                  <span className="material-symbols-outlined text-secondary mb-1 md:mb-2 text-3xl md:text-4xl drop-shadow-[0_0_10px_rgba(78,222,163,0.5)]" style={{ fontVariationSettings: "'FILL' 1" }}>category</span>
                  <h2 className="text-title-md font-title-md text-inverse-surface">Accessoires</h2>
                  <p className="hidden md:block text-body-md font-body-md text-on-surface-variant mt-1">Tapis, Protège-cartes</p>
                </div>
                <span className="md:hidden text-[10px] bg-secondary/10 border border-secondary text-secondary rounded px-2.5 py-0.5 uppercase tracking-widest font-mono">Bientôt</span>
              </div>
            </div>
          </div>
        </section>

        {/* Boosters Packs Section */}
        <section id="boosters-section" className="mb-16">
          <div className="flex items-center gap-4 mb-8 border-b border-outline-variant pb-4">
            <h2 className="text-headline-lg font-headline-lg text-inverse-surface">Sceaux de Boosters</h2>
            <span className="text-xs text-on-surface-variant bg-surface-container dark:bg-[#16121A] px-3 py-1 border border-outline-variant rounded-full font-mono uppercase tracking-widest select-none">
              Invocations multiples
            </span>
          </div>

          <div className="flex md:grid md:grid-cols-3 gap-gutter overflow-x-auto md:overflow-x-visible snap-x md:snap-none pb-4 md:pb-0 scrollbar-thin scrollbar-thumb-primary scrollbar-track-surface-dim">
            {boosterPacks.map(pack => (
              <div 
                key={pack.id} 
                className="card-frame p-5 flex flex-col justify-between group hover:shadow-[0_0_20px_var(--theme-glow)] transition-shadow duration-500 rounded-xl relative overflow-hidden h-[420px] snap-center shrink-0 w-[280px] sm:w-[320px] md:w-auto animate-fade-in"
                style={{ '--theme-glow': pack.themeColor } as React.CSSProperties}
              >
                {/* Background themed glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--theme-glow-radial),_transparent_60%)] opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{ '--theme-glow-radial': pack.themeColor } as React.CSSProperties}
                ></div>

                {/* Booster Image Area */}
                <div className="aspect-[3/4] rounded-lg bg-surface-container-lowest border border-outline-variant overflow-hidden relative flex items-center justify-center">
                  <img 
                    alt={pack.name} 
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
                    src={pack.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <span className="absolute bottom-3 left-3 text-[10px] bg-surface-container dark:bg-[#16121A]/85 backdrop-blur px-2.5 py-1 border border-outline-variant rounded-full text-inverse-surface font-mono tracking-widest font-bold uppercase">
                    5 Cartes
                  </span>
                </div>

                {/* Text Description */}
                <div className="mt-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-title-md font-title-md text-on-surface group-hover:text-primary transition-colors truncate">{pack.name}</h3>
                    <p className="text-xs text-on-surface-variant line-clamp-2 mt-1 min-h-[32px] leading-relaxed">{pack.description}</p>
                  </div>

                  {/* Buy Buttons */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-outline-variant/30">
                    <button 
                      onClick={() => handleBuyPack(pack, 'gold')}
                      className="px-2 py-2 bg-surface-container-high dark:bg-[#1C1822] hover:bg-surface-container border border-outline-variant rounded font-label-sm text-[11px] text-tertiary flex items-center justify-center gap-1 transition-all uppercase font-bold"
                    >
                      <span className="material-symbols-outlined text-xs">toll</span>
                      {pack.goldCost} Or
                    </button>
                    <button 
                      onClick={() => handleBuyPack(pack, 'gems')}
                      className="px-2 py-2 bg-gradient-to-r from-primary-container to-inverse-primary hover:from-primary hover:to-primary text-on-primary-container font-label-sm text-[11px] rounded flex items-center justify-center gap-1 transition-all uppercase font-bold"
                    >
                      <span className="material-symbols-outlined text-xs">diamond</span>
                      {pack.gemCost} Joy.
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Special Offers (Real Card Acquisitions) */}
        <section id="cards-section" className="mb-16">
          <div className="flex justify-between items-end mb-8 border-b border-outline-variant pb-4">
            <h3 className="text-headline-lg font-headline-lg text-inverse-surface">Offres Spéciales à l'Unité</h3>
            <span className="text-label-sm font-label-sm text-tertiary select-none">
              Invocations Instantanées Réelles
            </span>
          </div>

          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-gutter overflow-x-auto md:overflow-x-visible snap-x md:snap-none pb-4 md:pb-0 scrollbar-thin scrollbar-thumb-primary scrollbar-track-surface-dim">
            {specialOffers.map((card) => {
              const costSpec = getOfferCost(card.id)
              const isCompleteVisual = card.image.startsWith('/')
              const ownedCount = ownedCards[card.id] || 0

              return (
                <div 
                  key={card.id} 
                  className="card-frame p-4 flex flex-col gap-4 group hover:shadow-[0_0_20px_rgba(221,183,255,0.15)] transition-shadow rounded-xl snap-center shrink-0 w-[280px] sm:w-[320px] md:w-auto"
                >
                  {/* Card Illustration */}
                  <div className="aspect-[2.5/3.5] bg-surface-container-lowest border border-outline-variant relative overflow-hidden rounded">
                    {isCompleteVisual ? (
                      <img 
                        alt={card.title} 
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                        src={card.image}
                      />
                    ) : (
                      <>
                        <div className="absolute inset-2 border border-outline-variant/50 bg-surface-container flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-surface-variant to-surface-container-lowest">
                          <img alt={card.title} className="w-full h-full object-cover opacity-80" src={card.image} />
                        </div>
                        <div className="absolute top-2 left-2 bg-surface-container-lowest/80 backdrop-blur px-2.5 py-1 border border-tertiary/30 rounded text-[9px] text-tertiary font-mono tracking-widest uppercase">
                          {card.rarity}
                        </div>
                      </>
                    )}

                    {/* Own counter display */}
                    <div className="absolute top-2 right-2 bg-black/80 backdrop-blur px-2 py-0.5 rounded text-[8px] font-mono text-secondary border border-outline-variant">
                      Possédé : x{ownedCount}
                    </div>
                  </div>

                  {/* Description & Purchase details */}
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className={`text-title-md font-title-md truncate ${getRarityTextColor(card.rarity)}`}>{card.title}</h4>
                      <p className="text-[10px] font-label-sm text-on-surface-variant uppercase tracking-wider">{card.type}</p>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-outline-variant/30">
                      {costSpec.currency === 'gold' ? (
                        <span className="text-body-md font-body-md text-tertiary font-bold flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-sm">toll</span>
                          {costSpec.amount.toLocaleString()} Or
                        </span>
                      ) : (
                        <span className="text-body-md font-body-md text-primary font-bold flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-sm">diamond</span>
                          {costSpec.amount.toLocaleString()} Joyaux
                        </span>
                      )}

                      <button 
                        onClick={() => handleBuyCard(card)}
                        className="action-button px-4 py-2 text-tertiary font-label-sm text-label-sm uppercase text-xs rounded"
                      >
                        <span className="relative z-10">Acheter</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      {/* RITUAL PACK OPENING OVERLAY STAGE */}
      {ritualActive && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
          {/* Magic pulsing circles background */}
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_rgba(45,27,64,0.35)_0%,_transparent_70%)] animate-pulse"></div>
          
          <div className="relative z-10 w-full max-w-5xl text-center flex flex-col items-center">
            <span className="rune-tag text-[11px] bg-primary/10 text-primary border-primary/40 px-4 py-1.5 rounded-full uppercase tracking-widest mb-2 animate-pulse select-none">
              Sceau Brisé : {currentPackName}
            </span>
            <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-inverse-surface mb-8 drop-shadow-[0_0_20px_rgba(221,183,255,0.4)]">
              Rituel d'Éveil de l'Arcanima
            </h2>

            {/* Drawn Cards Stage (5 Cards circular/horizontal alignment) */}
            <div className="flex flex-wrap items-center justify-center gap-6 my-10 min-h-[300px]">
              {drawnCards.map((card, index) => {
                const isFlipped = flippedStatus[index]
                const isCompleteVisual = card.image.startsWith('/')
                
                return (
                  <div 
                    key={index} 
                    onClick={() => handleCardFlip(index)}
                    className="perspective-1000 w-44 h-[264px] cursor-pointer transition-transform duration-300 hover:scale-105 snap-center relative"
                  >
                    <div className={`w-full h-full duration-700 transform-style-3d relative transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
                      
                      {/* CARD BACK */}
                      <div className="absolute inset-0 backface-hidden bg-surface-container dark:bg-[#16121A] border-2 border-tertiary rounded-xl p-3 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(233,195,73,0.3)]">
                        <div className="border border-tertiary/40 w-full h-full rounded-lg flex flex-col items-center justify-center relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2D1B40] via-[#110A1A] to-[#16121A]">
                          <span className="material-symbols-outlined text-tertiary text-4xl animate-pulse">auto_awesome</span>
                          <span className="text-[6px] tracking-widest text-tertiary/60 uppercase absolute bottom-4 font-mono">Toucher pour révéler</span>
                        </div>
                      </div>

                      {/* CARD FRONT */}
                      <div className={`absolute inset-0 backface-hidden rotate-y-180 bg-background rounded-xl overflow-hidden border ${getRarityGlow(card.rarity)} flex flex-col`}>
                        {isCompleteVisual ? (
                          <div className="h-full w-full relative z-10 flex flex-col justify-between p-0.5">
                            <div className="flex-1 w-full h-full overflow-hidden rounded-lg relative">
                              <img className="w-full h-full object-contain" alt={card.title} src={card.image} />
                            </div>
                          </div>
                        ) : (
                          <div className="h-full w-full p-2 flex flex-col relative z-10">
                            {/* Card top cost */}
                            <div className="h-[45%] w-full rounded overflow-hidden relative border-b border-surface-container-highest bg-surface-container">
                              <img className="w-full h-full object-cover" alt={card.title} src={card.image} />
                              <div className="absolute top-1 right-1 w-6 h-6 bg-surface-container-lowest border border-tertiary rounded-full flex items-center justify-center font-bold text-[10px] text-tertiary shadow-md">
                                {card.cost}
                              </div>
                            </div>
                            
                            {/* Card lore and name */}
                            <div className="p-2 bg-surface-container dark:bg-[#16121A] flex-grow flex flex-col justify-between rounded-b">
                              <div>
                                <h4 className={`text-[11px] font-bold truncate ${getRarityTextColor(card.rarity)}`}>{card.title}</h4>
                                <p className="text-[7px] text-tertiary font-mono tracking-widest uppercase mb-1">{card.type}</p>
                                <p className="text-[8px] text-on-surface-variant line-clamp-3 italic leading-tight">"{card.abilityDescription}"</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Rarity label tag */}
                        <div className="absolute bottom-1 right-1 bg-black/75 px-1.5 py-0.5 rounded text-[7px] font-mono uppercase tracking-widest font-bold border border-outline-variant z-20">
                          {card.rarity}
                        </div>
                      </div>

                    </div>
                  </div>
                )
              })}
            </div>

            {/* Opening controls */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full max-w-md">
              {!flippedStatus.every(Boolean) ? (
                <button 
                  onClick={handleRevealAll}
                  className="w-full py-3 bg-surface-container-high dark:bg-[#1C1822] hover:bg-surface-container border border-outline-variant text-inverse-surface font-title-md rounded-lg flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <span className="material-symbols-outlined">visibility</span>
                  Tout Révéler
                </button>
              ) : (
                <button 
                  onClick={handleClaimCollection}
                  className="w-full py-3 bg-gradient-to-r from-primary-container to-inverse-primary text-on-primary-container font-title-md font-bold rounded-lg shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:shadow-[0_0_35px_rgba(168,85,247,0.7)] flex items-center justify-center gap-2 uppercase tracking-wider animate-bounce"
                >
                  <span className="material-symbols-outlined">inventory_2</span>
                  Réclamer dans le Grimoire
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Individual Card Purchase Success Dialog */}
      {showPurchaseDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface-container dark:bg-[#16121A] border border-tertiary rounded-xl p-8 max-w-sm w-full text-center shadow-[0_0_30px_rgba(233,195,73,0.3)] relative">
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-tertiary"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-tertiary"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-tertiary"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-tertiary"></div>

            <span className="material-symbols-outlined text-tertiary text-6xl mb-4 animate-bounce" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            <h3 className="font-title-md text-xl text-primary mb-2">Acquisition Réussie !</h3>
            <p className="text-body-md text-on-surface-variant text-sm mb-6 leading-relaxed">
              Le pacte est scellé. La carte a rejoint votre bibliothèque de combat : <br />
              <strong className="text-inverse-surface mt-2 inline-block text-base">{purchasedItemName}</strong>
            </p>
            <button 
              onClick={() => setShowPurchaseDialog(false)}
              className="action-button w-full py-2 bg-gradient-to-r from-primary-container to-inverse-primary text-on-primary-container font-title-md text-sm uppercase font-bold"
            >
              Fermer le Sceau
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />

      {/* BottomNavBar for Mobile */}
      <BottomNavBar activePage={activeNav} onNavigate={handleNavigation} />
    </div>
  )
}

export default MarketPage
