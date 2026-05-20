import React, { useState } from 'react'
import { TopAppBar, BottomNavBar } from '../components/Navigation'
import { CARDS_DATABASE } from '../data/cards'

interface DeckBuilderPageProps {
  onNavigate: (page: 'home' | 'library' | 'decks' | 'market' | 'card-detail' | 'profile', cardId?: string) => void
  gold?: number
  gems?: number
  ownedCards?: Record<string, number>
  onAddResources?: () => void
}

export const DeckBuilderPage: React.FC<DeckBuilderPageProps> = ({ 
  onNavigate, 
  gold, 
  gems, 
  ownedCards = {}, 
  onAddResources 
}) => {
  const [activeNav, setActiveNav] = useState<'home' | 'library' | 'decks' | 'market' | 'profile'>('decks')
  
  // Use real cards from database for the collection
  const collectionCards = CARDS_DATABASE

  // Persistent deck loader
  const [deckCards, setDeckCards] = useState<{ id: string; name: string; cost: number; count: number; type: string }[]>(() => {
    const saved = localStorage.getItem('arcanima_deck')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Clean out any cards that the user no longer owns enough copies of (due to profile resets etc)
        return parsed.filter((c: any) => (ownedCards[c.id] || 0) >= c.count)
      } catch (e) {
        console.error("Failed to parse deck from localStorage", e)
      }
    }
    // Safe starter deck using common cards (which are owned by default x2)
    return [
      { id: 'gorilla', name: 'Gorilla Beringei', cost: 2, count: 2, type: 'Créature - Animal' },
      { id: 'fourmi_ouvriere_majeure', name: 'Ouvrière Majeure', cost: 3, count: 2, type: 'Créature - Formica Ouvrière' },
      { id: 'fourmi_eclaireuse', name: 'Éclaireuse de la Ruche', cost: 2, count: 2, type: 'Créature - Formica Éclaireuse' }
    ]
  })

  const handleNavigation = (page: 'home' | 'library' | 'decks' | 'market' | 'profile') => {
    setActiveNav(page)
    onNavigate(page)
  }

  const addCardToDeck = (card: typeof CARDS_DATABASE[0]) => {
    const ownedCount = ownedCards[card.id] || 0
    
    // Check if owned at all
    if (ownedCount === 0) {
      alert(`Vous ne possédez pas "${card.title}" ! Visitez la boutique pour acheter cette carte ou ouvrir des boosters.`)
      return
    }

    const existing = deckCards.find(c => c.id === card.id)
    const currentCount = existing ? existing.count : 0

    // Check if we exceed the user's collection count
    if (currentCount >= ownedCount) {
      alert(`Vous ne possédez que ${ownedCount} exemplaire(s) de "${card.title}". Ouvrez des boosters pour en obtenir davantage !`)
      return
    }

    // Limit standard de 4 exemplaires max d'une même carte par deck
    if (currentCount >= 4) {
      alert("Vous ne pouvez pas ajouter plus de 4 exemplaires identiques dans un deck.")
      return
    }

    // Check total deck size (standard max 40)
    if (totalCards >= 40) {
      alert("Votre deck contient déjà la limite maximum de 40 cartes !")
      return
    }

    if (existing) {
      setDeckCards(deckCards.map(c => c.id === card.id ? { ...c, count: c.count + 1 } : c))
    } else {
      setDeckCards([...deckCards, { id: card.id, name: card.title, cost: card.cost, count: 1, type: card.type }])
    }
  }

  const removeCardFromDeck = (id: string) => {
    const existing = deckCards.find(c => c.id === id)
    if (existing && existing.count > 1) {
      setDeckCards(deckCards.map(c => c.id === id ? { ...c, count: c.count - 1 } : c))
    } else {
      setDeckCards(deckCards.filter(c => c.id !== id))
    }
  }

  const saveDeck = () => {
    localStorage.setItem('arcanima_deck', JSON.stringify(deckCards))
    alert("Votre Grimoire de combat a été sauvegardé avec succès !")
  }

  // Calculate deck size and average cost
  const totalCards = deckCards.reduce((acc, c) => acc + c.count, 0)
  const avgCost = totalCards > 0 
    ? (deckCards.reduce((acc, c) => acc + (c.cost * c.count), 0) / totalCards).toFixed(1)
    : '0.0'

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0F12]">
      <div className="texture-overlay absolute inset-0 z-0 opacity-50"></div>

      <TopAppBar 
        title="Aether Grimoire" 
        showEssence={true} 
        activePage="decks" 
        onNavigate={handleNavigation} 
        gold={gold}
        gems={gems}
        onAddResources={onAddResources}
      />

      <main className="flex-grow pt-16 flex flex-col h-[calc(100vh-64px)] pb-16 md:pb-0 overflow-hidden w-full max-w-container-max mx-auto relative z-10">
        
        {/* Top Half: Card Selection (Horizontal Scroll) */}
        <section className="h-1/2 bg-[#0F0F12] border-b border-outline-variant/30 flex flex-col relative z-20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="px-4 py-3 flex justify-between items-center bg-[#16121A]/80 backdrop-blur-sm border-b border-outline-variant/20">
            <h2 className="font-title-md text-lg text-secondary-fixed flex items-center gap-2">
              <span className="material-symbols-outlined text-xl">auto_awesome_mosaic</span>
              Collection de combat
            </h2>
            <div className="flex items-center gap-2 bg-[#1C1822] px-3 py-1.5 rounded-full border border-secondary-fixed/30 cursor-default select-none">
              <span className="material-symbols-outlined text-secondary-fixed-dim text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>filter_list</span>
              <span className="font-label-sm text-xs text-secondary-fixed-dim">Cartes disponibles ({collectionCards.length})</span>
            </div>
          </div>

          {/* Collection Cards Scroll */}
          <div className="flex-grow overflow-x-auto horizontal-scroll flex items-center gap-4 px-4 py-4 snap-x snap-mandatory">
            {collectionCards.map((card) => {
              const isCompleteVisual = card.image.startsWith('/');
              const ownedCount = ownedCards[card.id] || 0;
              const inDeck = deckCards.find(c => c.id === card.id);
              const countInDeck = inDeck ? inDeck.count : 0;
              const isUnowned = ownedCount === 0;
              const isMaxedOut = countInDeck >= ownedCount;

              return (
                <div 
                  key={card.id} 
                  className={`snap-center shrink-0 w-40 relative group cursor-pointer transition-transform duration-300 hover:-translate-y-2 ${isUnowned ? 'opacity-40 grayscale brightness-75' : ''}`}
                >
                  <div 
                    onClick={() => addCardToDeck(card)}
                    className={`card-frame h-52 rounded-lg p-1 flex flex-col relative overflow-hidden transition-all duration-300 shadow-lg ${isUnowned ? 'border-outline-variant/40' : isMaxedOut ? 'border-outline-variant shadow-inner' : 'group-hover:shadow-[0_0_20px_rgba(78,222,163,0.3)] group-hover:border-secondary-fixed-dim'}`}
                  >
                    {/* Quantity Badge in Deck Builder */}
                    <div className="absolute top-1.5 right-1.5 bg-[#16121A]/95 backdrop-blur border border-outline-variant/80 px-2 py-0.5 rounded text-[9px] font-bold font-label-sm shadow-md z-20 select-none">
                      {isUnowned ? (
                        <span className="text-outline-variant">Locked</span>
                      ) : (
                        <span className={`${isMaxedOut ? 'text-outline-variant' : 'text-primary'} font-bold`}>{countInDeck}/{ownedCount}</span>
                      )}
                    </div>

                    {isCompleteVisual ? (
                      <div className="flex-1 w-full h-full overflow-hidden rounded relative">
                        <img 
                          alt={card.title} 
                          className="w-full h-full object-contain opacity-95 group-hover:scale-105 transition-transform duration-500" 
                          src={card.image}
                        />
                      </div>
                    ) : (
                      <>
                        <div className="absolute top-1.5 left-1.5 bg-[#16121A] rounded-full w-6 h-6 flex items-center justify-center border border-secondary-fixed/50 z-10 text-xs font-bold text-secondary-fixed shadow-md">
                          {card.cost}
                        </div>
                        <div className="h-[55%] w-full bg-[#1C1822] mb-1 overflow-hidden rounded-t">
                          <img 
                            alt={card.title} 
                            className="w-full h-full object-cover opacity-90 group-hover:scale-115 transition-transform duration-500" 
                            src={card.image}
                          />
                        </div>
                        <div className="flex-1 bg-gradient-to-b from-[#1C1822] to-[#0F0F12] rounded-b p-2 flex flex-col justify-between border border-outline-variant/20">
                          <div className="text-center font-bold text-primary-fixed-dim text-[10px] leading-tight uppercase truncate tracking-wider">
                            {card.title}
                          </div>
                          <div className="flex justify-between items-end mt-1 border-t border-outline-variant/30 pt-1">
                            <div className="flex flex-col items-center">
                              <span className="text-[7px] text-outline">ATK</span>
                              <span className="text-[9px] text-error font-bold">{card.atk}</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-[7px] text-outline">DEF</span>
                              <span className="text-[9px] text-secondary font-bold">{card.def}</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  {/* Add to deck overlay */}
                  <div className="absolute inset-0 bg-[#0F0F12]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg backdrop-blur-[1px] z-30 pointer-events-none">
                    {isUnowned ? (
                      <span className="material-symbols-outlined text-tertiary text-3xl drop-shadow-[0_0_10px_rgba(233,195,73,0.8)]">lock</span>
                    ) : isMaxedOut ? (
                      <span className="material-symbols-outlined text-outline text-3xl">block</span>
                    ) : (
                      <span className="material-symbols-outlined text-secondary-fixed text-4xl drop-shadow-[0_0_10px_rgba(78,222,163,0.8)] animate-pulse">add_circle</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom Half: Deck List & Stats */}
        <section className="h-1/2 flex flex-col bg-[#16121A] overflow-hidden relative z-10">
          <div className="px-4 py-3 border-b border-outline-variant/20 flex justify-between items-end bg-[#1C1822]">
            <div>
              <h2 className="font-headline-lg-mobile text-xl text-primary drop-shadow-[0_0_10px_rgba(221,183,255,0.2)]">Deck Actuel</h2>
              <div className="flex items-center gap-2 mt-1">
                <p className="font-label-sm text-xs text-outline bg-[#0F0F12] px-2 py-0.5 rounded border border-outline-variant/30">
                  {totalCards}/40 Cartes
                </p>
                <span className="font-label-sm text-xs text-tertiary-fixed-dim">Moy. Coût : {avgCost}</span>
              </div>
            </div>
            {/* Mana Curve Graph */}
            <div className="flex items-end gap-1 h-10 w-32 border-b border-l border-outline-variant/50 p-1 bg-[#0F0F12]/50 rounded-bl">
              {[20, 50, 80, 100, 40, 10, 5].map((height, i) => (
                <div 
                  key={i} 
                  className="w-full rounded-t-sm hover:bg-primary transition-colors cursor-help relative group" 
                  style={{ height: `${height}%`, backgroundColor: `rgba(221, 183, 255, ${0.3 + height/200})` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#0F0F12] border border-outline-variant px-1.5 py-0.5 rounded text-[8px] text-on-surface opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    {Math.round(height/10)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deck List Scroll */}
          <div className="flex-grow overflow-y-auto vertical-scroll px-2 py-3 space-y-2">
            {deckCards.length === 0 ? (
              <div className="h-full flex items-center justify-center text-on-surface-variant font-label-sm text-xs py-12">
                Aucune carte dans le deck. Touchez une carte de la collection pour l'ajouter.
              </div>
            ) : (
              deckCards.map((card) => (
                <div 
                  key={card.id} 
                  className="flex items-center justify-between bg-[#1C1822] rounded-lg border border-outline-variant/30 p-2 group hover:bg-[#25202B] hover:border-primary/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-[#0F0F12] rounded-full w-8 h-8 flex items-center justify-center border border-primary/50 font-label-sm text-primary shadow-[inset_0_0_8px_rgba(168,85,247,0.2)]">
                      {card.cost}
                    </div>
                    <div>
                      <div className="font-body-md text-sm text-on-surface group-hover:text-primary-fixed transition-colors">{card.name}</div>
                      <div className="font-label-sm text-[10px] text-outline">{card.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-tertiary-fixed-dim font-title-md text-sm bg-[#0F0F12] px-2 py-0.5 rounded border border-tertiary-fixed-dim/30">x{card.count}</span>
                    <button 
                      onClick={() => removeCardFromDeck(card.id)}
                      className="material-symbols-outlined text-outline hover:text-error hover:scale-110 transition-all p-1"
                    >
                      remove_circle_outline
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Action Button */}
          <div className="p-3 bg-[#1C1822] border-t border-outline-variant/30">
            <button 
              onClick={saveDeck}
              className="w-full py-3 bg-gradient-to-r from-primary-container to-inverse-primary text-on-primary-container font-title-md rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all flex justify-center items-center gap-2 font-bold"
            >
              <span className="material-symbols-outlined">save</span>
              Sauvegarder le Grimoire de combat
            </button>
          </div>
        </section>
      </main>

      {/* BottomNavBar for Mobile */}
      <BottomNavBar activePage="decks" onNavigate={handleNavigation} />
    </div>
  )
}

export default DeckBuilderPage
