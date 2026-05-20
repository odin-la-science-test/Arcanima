import React, { useState, useMemo } from 'react'
import { TopAppBar, BottomNavBar } from '../components/Navigation'
import { Footer } from '../components/Footer'
import { CARDS_DATABASE, CardData } from '../data/cards'

interface LibraryPageProps {
  onNavigate: (page: 'home' | 'library' | 'decks' | 'market' | 'card-detail' | 'profile' | 'play', cardId?: string) => void
  gold?: number
  gems?: number
  ownedCards?: Record<string, number>
  onAddResources?: () => void
}

export const LibraryPage: React.FC<LibraryPageProps> = ({ onNavigate, gold, gems, ownedCards = {}, onAddResources }) => {
  const [activeNav, setActiveNav] = useState<'home' | 'library' | 'decks' | 'market' | 'card-detail' | 'profile' | 'play'>('library')
  
  // Filtering States
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null)
  const [selectedCost, setSelectedCost] = useState<number | string | null>(null)
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>('newest')
  const [hideUnowned, setHideUnowned] = useState(false)

  const handleNavigation = (page: 'home' | 'library' | 'decks' | 'market' | 'profile' | 'play') => {
    setActiveNav(page as 'home' | 'library' | 'decks' | 'market' | 'card-detail' | 'profile' | 'play')
    onNavigate(page)
  }

  // Factions list derived from database
  const factionsList = useMemo(() => {
    return ['Diptera', 'Formica', 'Arachnida', 'Coleoptera', 'Void Faction', 'Nature', 'Oiseau', 'Poisson']
  }, [])

  // Filtering Logic
  const filteredCards = useMemo(() => {
    return CARDS_DATABASE.filter(card => {
      // Hide unowned cards if filter is active
      if (hideUnowned && (ownedCards[card.id] || 0) === 0) {
        return false
      }

      // Search Query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const titleMatch = card.title.toLowerCase().includes(query)
        const typeMatch = card.type.toLowerCase().includes(query)
        const descMatch = card.abilityDescription.toLowerCase().includes(query)
        const factionMatch = card.faction.toLowerCase().includes(query)
        if (!titleMatch && !typeMatch && !descMatch && !factionMatch) return false
      }

      // Faction Filter
      if (selectedFaction && card.faction !== selectedFaction) {
        return false
      }

      // Cost Filter
      if (selectedCost !== null) {
        if (selectedCost === '5+') {
          if (card.cost < 5) return false
        } else {
          if (card.cost !== Number(selectedCost)) return false
        }
      }

      // Rarity Filter
      if (selectedRarity && card.rarity !== selectedRarity) {
        return false
      }

      // Type Filter
      if (selectedType) {
        const typeQuery = selectedType.toLowerCase()
        if (!card.type.toLowerCase().includes(typeQuery)) return false
      }

      return true
    }).sort((a, b) => {
      if (sortBy === 'power') {
        return b.atk - a.atk
      }
      if (sortBy === 'cost') {
        return a.cost - b.cost
      }
      // 'newest' / default fallback sorting
      return a.title.localeCompare(b.title)
    })
  }, [searchQuery, selectedFaction, selectedCost, selectedRarity, selectedType, sortBy, hideUnowned, ownedCards])

  const resetFilters = () => {
    setSelectedFaction(null)
    setSelectedCost(null)
    setSelectedRarity(null)
    setSelectedType(null)
    setSearchQuery('')
    setHideUnowned(false)
  }

  // Mapping rarity to design glow classes
  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'mythic': return 'group-hover:opacity-100 bg-primary/20'
      case 'rare': return 'group-hover:opacity-100 bg-tertiary/20'
      default: return 'group-hover:opacity-60 bg-secondary/10'
    }
  }

  // Mapping rarity to text color
  const getRarityTextColor = (rarity: string) => {
    switch (rarity) {
      case 'mythic': return 'text-primary'
      case 'rare': return 'text-secondary'
      default: return 'text-tertiary-fixed-dim'
    }
  }

  return (
    <div className="bg-background text-on-background font-body-md text-body-md min-h-screen flex flex-col antialiased selection:bg-primary-container selection:text-on-primary-container">
      {/* TopNavBar */}
      <TopAppBar 
        title="" 
        activePage="library" 
        onNavigate={handleNavigation} 
        gold={gold}
        gems={gems}
        onAddResources={onAddResources}
      />

      {/* Main Content Stage */}
      <main className="flex-1 pt-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-8 pb-24 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-surface-container-highest pb-6">
          <div>
            <h1 className="font-display-lg text-display-lg text-primary tracking-tight" style={{ textShadow: '0 0 30px rgba(221,183,255,0.2)' }}>
              Votre Grimoire
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              Dévoilez les secrets enfouis dans votre collection.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative group flex-1 sm:flex-none">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">
                search
              </span>
              <input 
                className="recessed-input w-full sm:w-64 bg-surface-container-low border-y border-x border-surface-container-highest rounded text-on-surface font-body-md text-body-md pl-10 pr-4 py-2 focus:outline-none focus:border-primary/50 transition-colors placeholder:text-outline-variant" 
                placeholder="Rechercher des sortilèges..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Sort */}
            <div className="relative group flex-1 sm:flex-none">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-tertiary transition-colors">
                sort
              </span>
              <select 
                className="recessed-input w-full sm:w-48 appearance-none bg-surface-container-low border-y border-x border-surface-container-highest rounded text-on-surface font-body-md text-body-md pl-10 pr-10 py-2 focus:outline-none focus:border-tertiary/50 transition-colors cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Ordre Alphabétique</option>
                <option value="power">Puissance Brute</option>
                <option value="cost">Coût en Essence</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Filter Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0 bg-surface-container-lowest border border-surface-container-highest rounded-lg p-6 space-y-8 lg:sticky lg:top-24">
            
            {/* Collection Status */}
            <div>
              <div className="flex justify-between items-center mb-4 border-b border-surface-container-highest pb-2">
                <h3 className="font-title-md text-title-md text-tertiary">Ma Collection</h3>
                {(selectedFaction || selectedCost || selectedRarity || selectedType || searchQuery || hideUnowned) && (
                  <button onClick={resetFilters} className="text-xs text-primary hover:underline uppercase tracking-wider">Réinitialiser</button>
                )}
              </div>
              <label className="flex items-center gap-3 cursor-pointer group select-none">
                <div 
                  onClick={() => setHideUnowned(!hideUnowned)}
                  className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-colors ${hideUnowned ? 'border-primary bg-primary/20' : 'border-outline group-hover:border-primary'}`}
                >
                  {hideUnowned && (
                    <span className="material-symbols-outlined text-[12px] text-primary font-bold">check</span>
                  )}
                </div>
                <span className={`font-label-sm text-label-sm transition-colors ${hideUnowned ? 'text-primary font-bold' : 'text-on-surface-variant group-hover:text-primary'}`}>
                  Masquer non possédées
                </span>
              </label>
            </div>

            {/* Faction */}
            <div>
              <div className="flex justify-between items-center mb-4 border-b border-surface-container-highest pb-2">
                <h3 className="font-title-md text-title-md text-tertiary">Faction</h3>
              </div>
              <div className="flex flex-col gap-3">
                {factionsList.map(faction => (
                  <label key={faction} className="flex items-center gap-3 cursor-pointer group">
                    <div 
                      onClick={() => setSelectedFaction(selectedFaction === faction ? null : faction)}
                      className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-colors ${selectedFaction === faction ? 'border-primary bg-primary/20' : 'border-outline group-hover:border-primary'}`}
                    >
                      {selectedFaction === faction && (
                        <span className="material-symbols-outlined text-[12px] text-primary font-bold">check</span>
                      )}
                    </div>
                    <span className={`font-label-sm text-label-sm transition-colors ${selectedFaction === faction ? 'text-primary font-bold' : 'text-on-surface-variant group-hover:text-primary'}`}>
                      {faction}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Cost */}
            <div>
              <h3 className="font-title-md text-title-md text-tertiary mb-4 border-b border-surface-container-highest pb-2">Coût en Mana</h3>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, '5+'].map((cost) => (
                  <button 
                    key={cost}
                    onClick={() => setSelectedCost(selectedCost === cost ? null : cost)}
                    className={`w-8 h-8 rounded flex items-center justify-center font-label-sm text-label-sm border transition-colors ${selectedCost === cost ? 'bg-primary/20 text-primary border-primary' : 'bg-surface-container text-on-surface border-outline-variant hover:border-tertiary hover:text-tertiary'}`}
                  >
                    {cost}
                  </button>
                ))}
              </div>
            </div>

            {/* Rarity */}
            <div>
              <h3 className="font-title-md text-title-md text-tertiary mb-4 border-b border-surface-container-highest pb-2">Rareté</h3>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setSelectedRarity(selectedRarity === 'common' ? null : 'common')}
                  className={`px-4 py-2 rounded-full border font-label-sm text-label-sm flex items-center justify-between transition-all w-full text-left ${selectedRarity === 'common' ? 'border-outline text-on-surface bg-surface-container-high shadow-[0_0_8px_rgba(152,141,159,0.2)]' : 'border-outline-variant text-on-surface-variant hover:border-outline hover:text-on-surface bg-surface-container-lowest'}`}
                >
                  <span>Commune</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-outline-variant shadow-[0_0_4px_rgba(152,141,159,0.5)]"></span>
                </button>
                <button 
                  onClick={() => setSelectedRarity(selectedRarity === 'rare' ? null : 'rare')}
                  className={`px-4 py-2 rounded-full border font-label-sm text-label-sm flex items-center justify-between transition-all w-full text-left ${selectedRarity === 'rare' ? 'border-secondary text-secondary bg-secondary/10 shadow-[0_0_12px_rgba(78,222,163,0.3)]' : 'border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary bg-surface-container-lowest'}`}
                >
                  <span>Rare</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(78,222,163,0.8)]"></span>
                </button>
                <button 
                  onClick={() => setSelectedRarity(selectedRarity === 'mythic' ? null : 'mythic')}
                  className={`px-4 py-2 rounded-full border font-label-sm text-label-sm flex items-center justify-between transition-all w-full text-left ${selectedRarity === 'mythic' ? 'border-tertiary text-tertiary bg-tertiary/10 shadow-[0_0_12px_rgba(233,195,73,0.3)]' : 'border-outline-variant text-on-surface-variant hover:border-tertiary hover:text-tertiary bg-surface-container-lowest'}`}
                >
                  <span>Mythique</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary shadow-[0_0_10px_#e9c349]"></span>
                </button>
              </div>
            </div>

            {/* Type */}
            <div>
              <h3 className="font-title-md text-title-md text-tertiary mb-4 border-b border-surface-container-highest pb-2">Type</h3>
              <div className="flex flex-col gap-2">
                {['Créature', 'Sortilège', 'Artefact', 'Terrain'].map((type) => (
                  <button 
                    key={type}
                    onClick={() => setSelectedType(selectedType === type ? null : type)}
                    className={`text-left font-body-md text-body-md py-1 transition-colors ${selectedType === type ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Card Grid Area */}
          <div className="flex-1 w-full">
            
            {/* Stats count */}
            <div className="flex justify-between items-center text-xs text-on-surface-variant px-1 mb-4">
              <p>{filteredCards.length} Cartes Trouvées</p>
              {filteredCards.length === 0 && (
                <button onClick={resetFilters} className="text-primary hover:underline">Effacer les filtres</button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCards.map((card) => {
                const isCompleteVisual = card.image.startsWith('/');
                const count = ownedCards[card.id] || 0;
                const isUnowned = count === 0;
                return (
                  <article 
                    key={card.id}
                    className={`bg-[#0F0F12] p-1 rounded-xl shadow-2xl group relative overflow-hidden transition-transform duration-300 hover:-translate-y-2 h-[450px] ${isUnowned ? 'opacity-40 grayscale-[30%] brightness-75' : ''}`}
                  >
                    {/* Glow effect behind card */}
                    {!isUnowned && <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 blur-xl rounded-xl ${getRarityGlow(card.rarity)}`}></div>}
                    
                    {/* Locked Card Padlock Overlay */}
                    {isUnowned && (
                      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[1px] pointer-events-none rounded-xl">
                        <span className="material-symbols-outlined text-tertiary text-4xl drop-shadow-[0_0_10px_rgba(233,195,73,0.8)] animate-pulse mb-2">lock</span>
                        <span className="text-[10px] text-tertiary font-label-sm tracking-widest uppercase bg-[#16121A]/95 px-3 py-1 border border-tertiary/30 rounded-full">
                          Verrouillé
                        </span>
                      </div>
                    )}

                    {/* Quantity Badge */}
                    <div className="absolute top-3 left-3 z-30 bg-[#16121A]/95 backdrop-blur border border-outline-variant/80 px-2.5 py-1 rounded text-[11px] font-bold font-label-sm shadow-xl flex items-center gap-1 select-none">
                      {isUnowned ? (
                        <span className="text-outline-variant uppercase text-[9px] tracking-wide">Bloqué</span>
                      ) : (
                        <span className="text-secondary font-bold">x{count}</span>
                      )}
                    </div>
                    
                    {isCompleteVisual ? (
                      <div 
                        onClick={() => onNavigate('card-detail', card.id)}
                        className="h-full w-full relative z-10 flex flex-col justify-between p-1 cursor-pointer"
                      >
                        <div className="flex-1 w-full h-full overflow-hidden rounded-lg relative">
                          <img 
                            className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-500" 
                            alt={card.title} 
                            src={card.image}
                          />
                        </div>
                        {/* Hover Overlay Button */}
                        <div className="absolute inset-0 bg-[#0F0F12]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center rounded-lg z-20 gap-3">
                          <h4 className={`font-title-md text-title-md truncate px-4 ${getRarityTextColor(card.rarity)}`}>
                            {card.title}
                          </h4>
                          <button 
                            className="clip-octagon px-4 py-2 bg-gradient-to-r from-primary to-inverse-primary text-on-primary-container font-label-sm text-label-sm hover:from-primary/20 hover:to-primary/20 hover:border-primary border border-outline-variant transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                            Visionner
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="card-frame h-full w-full rounded-lg p-2 flex flex-col relative z-10">
                        {/* Image Area */}
                        <div className="h-[48%] w-full rounded-t overflow-hidden relative border-b border-surface-container-highest">
                          <img 
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105" 
                            alt={card.title} 
                            src={card.image}
                          />
                          {/* Cost Rune */}
                          <div className="absolute top-2 right-2 w-8 h-8 bg-surface-container-lowest border border-tertiary rounded-full flex items-center justify-center font-title-md text-title-md text-tertiary shadow-[0_0_10px_rgba(233,195,73,0.5)]">
                            {card.cost}
                          </div>
                        </div>

                        {/* Text Area */}
                        <div className="p-4 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] bg-[#16121A] flex-grow flex flex-col justify-between">
                          <div>
                            <h4 className={`font-title-md text-title-md mb-1 truncate ${getRarityTextColor(card.rarity)}`}>
                              {card.title}
                            </h4>
                            <p className="font-label-sm text-label-sm text-tertiary mb-3 uppercase tracking-wider">
                              {card.type} - {card.rarity}
                            </p>
                            <p className="font-body-md text-on-surface-variant text-sm line-clamp-3 mb-4 opacity-80 italic">
                              "{card.abilityDescription}"
                            </p>
                          </div>
                          
                          {/* Action */}
                          <button 
                            onClick={() => onNavigate('card-detail', card.id)}
                            className="clip-octagon w-full py-2 bg-gradient-to-r from-surface-container-low via-surface-container to-surface-container-low border border-outline-variant text-on-surface font-label-sm text-label-sm hover:from-primary/20 hover:to-primary/20 hover:border-primary hover:text-primary transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                            Visionner
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* BottomNavBar for Mobile */}
      <BottomNavBar activePage={activeNav} onNavigate={handleNavigation} />
    </div>
  )
}

export default LibraryPage
