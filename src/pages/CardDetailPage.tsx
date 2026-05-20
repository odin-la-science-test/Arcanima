import React, { useState, useMemo } from 'react'
import { TopAppBar } from '../components/Navigation'
import { Footer } from '../components/Footer'
import { CARDS_DATABASE, CardData } from '../data/cards'

interface CardDetailPageProps {
  onNavigate: (page: 'home' | 'library' | 'decks' | 'market' | 'card-detail', cardId?: string) => void
  cardId?: string
  gold?: number
  gems?: number
  ownedCards?: Record<string, number>
  onAddResources?: () => void
}

export const CardDetailPage: React.FC<CardDetailPageProps> = ({ onNavigate, cardId, gold, gems, ownedCards, onAddResources }) => {
  const [isFavorited, setIsFavorited] = useState(false)

  // Find the selected card, fallback to weaver, then to first card in database
  const card = useMemo(() => {
    return CARDS_DATABASE.find(c => c.id === cardId) || 
           CARDS_DATABASE.find(c => c.id === 'weaver') || 
           CARDS_DATABASE[0]
  }, [cardId])

  // Get related cards (cards of the same faction, excluding the current card)
  const relatedCards = useMemo(() => {
    const sameFaction = CARDS_DATABASE.filter(c => c.faction === card.faction && c.id !== card.id)
    if (sameFaction.length > 0) return sameFaction.slice(0, 4)
    // Fallback if no same faction cards
    return CARDS_DATABASE.filter(c => c.id !== card.id).slice(0, 4)
  }, [card])

  const handleBack = () => {
    onNavigate('library')
  }

  // Helper to generate dynamic passive based on faction
  const getPassiveAbility = (faction: string) => {
    switch (faction) {
      case 'Diptera':
        return {
          title: 'Regard Infectieux',
          desc: 'Chaque fois qu\'une unité adverse meurt, inflige 5 dégâts de poison au joueur ennemi.'
        }
      case 'Formica':
        return {
          title: 'Esprit de la Ruche',
          desc: 'Cette unité gagne +5 DEF pour chaque autre unité Formica sur le terrain.'
        }
      case 'Arachnida':
        return {
          title: 'Toile Piège',
          desc: 'Les unités ennemies perdent leur capacité de Provocation lorsqu\'elles attaquent cette créature.'
        }
      case 'Coleoptera':
        return {
          title: 'Carapace Renforcée',
          desc: 'Réduit tous les dégâts de sort subis de 10 points.'
        }
      case 'Void Faction':
        return {
          title: 'Tisseur d\'Ombres',
          desc: 'Chaque fois qu\'une carte du Néant est jouée, cette créature gagne +10 DEF.'
        }
      default:
        return {
          title: 'Harmonie Naturelle',
          desc: 'Soigne de 5 points de vie au début de chaque tour si aucune créature adverse n\'est adjacente.'
        }
    }
  }

  const passive = getPassiveAbility(card.faction)

  // Calculate yield (simulated stat)
  const yieldValue = Math.max(1, Math.round(card.cost / 2))

  // Mapping rarity to design glow classes
  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'mythic': return 'bg-primary-container/20 shadow-[0_0_40px_rgba(168,85,247,0.4)]'
      case 'rare': return 'bg-tertiary-container/20 shadow-[0_0_40px_rgba(233,195,73,0.3)]'
      default: return 'bg-secondary-container/10 shadow-[0_0_30px_rgba(78,222,163,0.2)]'
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-body-md text-body-md antialiased selection:bg-primary-container selection:text-on-primary-container bg-background">
      {/* TopNavBar */}
      <TopAppBar 
        title="" 
        onBack={handleBack} 
        showEssence={true} 
        activePage="card-detail" 
        gold={gold}
        gems={gems}
        onAddResources={onAddResources}
      />

      {/* Main Content Canvas */}
      <main className="flex-grow pt-24 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full relative z-10">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-8 text-on-surface-variant font-label-sm text-label-sm px-1">
          <button onClick={() => onNavigate('library')} className="hover:text-tertiary transition-colors">
            Grimoire
          </button>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface-variant">{card.faction}</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-primary">{card.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter px-1">
          
          {/* Left Side: Card Visual */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end items-start relative group mb-8 lg:mb-0">
            {/* Ambient background glow behind card */}
            <div className={`absolute inset-0 blur-[100px] rounded-full z-0 pointer-events-none w-3/4 h-3/4 m-auto ${getRarityGlow(card.rarity)}`}></div>
            
            {card.image.startsWith('/') ? (
              <div className="relative z-10 w-full max-w-sm aspect-[2.5/3.5] bg-background border border-outline-variant/30 rounded-lg p-1 shadow-2xl card-glow transition-transform duration-500 hover:scale-[1.02]">
                <img 
                  alt={card.title} 
                  className="w-full h-full object-contain rounded-lg" 
                  src={card.image}
                />
              </div>
            ) : (
              <div className="relative z-10 w-full max-w-sm aspect-[2.5/3.5] bg-surface-container border border-outline-variant rounded-lg p-unit shadow-2xl card-glow transition-transform duration-500 hover:scale-[1.02]">
                <div className="w-full h-full metallic-border relative overflow-hidden bg-surface-container-lowest flex flex-col justify-between">
                  
                  {/* Artwork */}
                  <div className="w-full h-[55%] relative overflow-hidden">
                    <img 
                      alt={card.title} 
                      className="w-full h-full object-cover opacity-90 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700" 
                      src={card.image}
                    />
                    {/* Cost Rune inside Card Artwork */}
                    <div className="absolute top-2 right-2 w-8 h-8 bg-surface-container-lowest border border-tertiary rounded-full flex items-center justify-center font-title-md text-title-md text-tertiary shadow-[0_0_10px_rgba(233,195,73,0.5)]">
                      {card.cost}
                    </div>
                  </div>

                  {/* In-card text area imitating parchment/stone */}
                  <div className="w-full h-[45%] bg-gradient-to-t from-surface-container-lowest to-surface-container p-4 border-t border-tertiary/30 flex flex-col justify-between">
                    <div>
                      <h2 className="font-title-md text-title-md text-primary mb-1 line-clamp-1">{card.title}</h2>
                      <p className="font-label-sm text-label-sm text-tertiary mb-2 uppercase tracking-widest truncate">{card.type}</p>
                    </div>
                    <p className="font-body-md text-[13px] leading-snug text-on-surface-variant italic border-l-2 border-primary/50 pl-2 line-clamp-3">
                      "{card.lore || 'Un artefact baigné d\'essences spectrales provenant des limbes d\'Arcanima.'}"
                    </p>
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* Right Side: Details & Actions */}
          <div className="lg:col-span-7 flex flex-col gap-8 lg:pl-12">
            <header>
              <h1 className="font-display-lg text-display-lg text-inverse-surface mb-2 tracking-tight">
                {card.title}
              </h1>
              <div className="flex flex-wrap gap-3">
                <span className="rune-chip px-3 py-1 font-label-sm text-label-sm text-tertiary rounded-full uppercase tracking-wider">
                  {card.rarity}
                </span>
                <span className="rune-chip px-3 py-1 font-label-sm text-label-sm text-primary rounded-full uppercase tracking-wider">
                  {card.faction}
                </span>
                <span className="rune-chip px-3 py-1 font-label-sm text-label-sm text-secondary rounded-full uppercase tracking-wider">
                  Set: Éveil
                </span>
              </div>
            </header>

            {/* Stats Bento Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* ATK */}
              <div className="bg-surface-container p-4 border border-outline-variant/50 rounded flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="material-symbols-outlined text-error mb-2 text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>swords</span>
                <span className="font-headline-lg text-headline-lg text-inverse-surface">{card.atk}</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">ATK</span>
              </div>

              {/* DEF */}
              <div className="bg-surface-container p-4 border border-outline-variant/50 rounded flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="material-symbols-outlined text-secondary mb-2 text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
                <span className="font-headline-lg text-headline-lg text-inverse-surface">{card.def}</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">DEF</span>
              </div>

              {/* Cost */}
              <div className="bg-surface-container p-4 border border-outline-variant/50 rounded flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-tertiary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="material-symbols-outlined text-tertiary mb-2 text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                <span className="font-headline-lg text-headline-lg text-inverse-surface">{card.cost}</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Coût</span>
              </div>

              {/* Yield */}
              <div className="bg-surface-container p-4 border border-outline-variant/50 rounded flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="material-symbols-outlined text-primary mb-2 text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <span className="font-headline-lg text-headline-lg text-inverse-surface">{yieldValue}</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Gains</span>
              </div>
            </div>

            {/* Abilities & Lore Panel */}
            <div className="bg-surface-container-low border border-outline-variant/30 p-6 relative">
              {/* Decorative Corner Ornaments */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-tertiary/50"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-tertiary/50"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-tertiary/50"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-tertiary/50"></div>

              {/* Abilities */}
              <div className="mb-6">
                <h3 className="font-title-md text-title-md text-primary mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">psychology</span>
                  Pouvoirs Mystiques
                </h3>
                <div className="space-y-4">
                  {/* Active Ability */}
                  <div className="bg-surface p-4 rounded border-l-2 border-primary">
                    <strong className="text-inverse-surface block mb-1">
                      {card.abilityTitle || 'Sort Actif'} [Actif]
                    </strong>
                    <p className="text-on-surface-variant text-sm">
                      {card.abilityDescription}
                    </p>
                  </div>
                  {/* Passive Ability */}
                  <div className="bg-surface p-4 rounded border-l-2 border-secondary">
                    <strong className="text-inverse-surface block mb-1">
                      {passive.title} [Passif]
                    </strong>
                    <p className="text-on-surface-variant text-sm">
                      {passive.desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Lore */}
              <div>
                <h3 className="font-title-md text-title-md text-tertiary mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">menu_book</span>
                  Récit des Anciens
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed columns-1 md:columns-2 gap-8 text-justify opacity-80 text-sm">
                  {card.lore || 'Aucun grimoire n\'a encore consigné l\'origine exacte de cet arcane. Il est dit que quiconque tente d\'en percer le mystère s\'expose aux murmures insidieux du grand Néant.'}
                  {' '}{card.lore && "Les écrits sacrés du Haut Conseil de l'Arcanima stipulent que cette entité a traversé les failles stellaires bien avant l'avènement du grand calendrier des tisseurs, devenant une pièce capitale dans l'équilibre des forces de la nature."}
                </p>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap gap-4 mt-4">
              <button className="action-button px-8 py-4 flex-1 min-w-[200px] flex items-center justify-center gap-3">
                <div className="action-button-content flex items-center gap-2 text-inverse-surface font-title-md text-[16px] tracking-wider uppercase">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add_box</span>
                  Ajouter au Deck
                </div>
              </button>
              
              <button 
                onClick={() => onNavigate('market')}
                className="action-button px-8 py-4 flex-1 min-w-[150px] flex items-center justify-center gap-3" 
                style={{ background: 'linear-gradient(135deg, #1b1b1e, #2a2a2d)', borderColor: '#988d9f' }}
              >
                <div className="action-button-content flex items-center gap-2 text-on-surface-variant font-title-md text-[16px] tracking-wider uppercase">
                  <span className="material-symbols-outlined">swap_horiz</span>
                  Échanger (Marché)
                </div>
              </button>

              <button 
                onClick={() => setIsFavorited(!isFavorited)}
                className="action-button px-8 py-4 flex-none w-[80px] flex items-center justify-center" 
                style={{ background: 'linear-gradient(135deg, #1b1b1e, #2a2a2d)', borderColor: '#988d9f' }}
              >
                <div className={`action-button-content flex items-center justify-center transition-colors ${isFavorited ? 'text-error animate-pulse' : 'text-on-surface-variant'}`}>
                  <span className="material-symbols-outlined" style={isFavorited ? { fontVariationSettings: "'FILL' 1" } : {}}>favorite</span>
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Section: Related Cards */}
        <section className="mt-24 border-t border-outline-variant/30 pt-12">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-8 text-center flex items-center justify-center gap-4">
            <span className="w-12 h-px bg-gradient-to-r from-transparent to-primary/50"></span>
            Créatures Apparentées ({card.faction})
            <span className="w-12 h-px bg-gradient-to-l from-transparent to-primary/50"></span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedCards.map((relatedCard) => (
              <div 
                key={relatedCard.id} 
                onClick={() => onNavigate('card-detail', relatedCard.id)}
                className="group block relative cursor-pointer"
              >
                <div className="aspect-[2.5/3.5] bg-surface-container border border-outline-variant rounded p-1 shadow-lg transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_10px_20px_rgba(168,85,247,0.2)] group-hover:border-primary/50">
                  <div className="w-full h-full metallic-border relative overflow-hidden bg-surface-container-lowest">
                    <img 
                      alt={relatedCard.title} 
                      className="w-full h-full object-cover mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-500" 
                      src={relatedCard.image}
                    />
                    <div className="absolute bottom-0 w-full bg-surface-container/90 backdrop-blur-sm p-2 border-t border-tertiary/30">
                      <p className="font-label-sm text-label-sm text-primary truncate text-center">
                        {relatedCard.title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default CardDetailPage
