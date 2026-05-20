import React from 'react'

interface CardProps {
  id?: string
  title: string
  type: string
  image: string
  cost?: number
  atk?: number
  def?: number
  rarity?: 'common' | 'rare' | 'mythic'
  abilityDescription?: string
  onClick?: () => void
}

export const Card: React.FC<CardProps> = ({
  title,
  type,
  image,
  atk,
  def: defense,
  rarity = 'common',
  abilityDescription,
  onClick
}) => {
  const rarityIcons = {
    common: 'star',
    rare: 'eco',
    mythic: 'diamond'
  }

  const rarityColors = {
    common: 'text-tertiary-fixed-dim',
    rare: 'text-secondary-fixed',
    mythic: 'text-tertiary-fixed'
  }

  const isCompleteVisual = image.startsWith('/')

  return (
    <article 
      onClick={onClick}
      className="card-frame min-w-[280px] w-[280px] h-[400px] flex-shrink-0 snap-center relative group cursor-pointer"
    >
      {isCompleteVisual ? (
        <div className="w-full h-full p-1 bg-[#0F0F12] rounded-lg relative overflow-hidden flex flex-col justify-between">
          <div className="flex-grow w-full h-full overflow-hidden rounded">
            <img
              alt={title}
              className="w-full h-full object-contain opacity-95 group-hover:scale-[1.02] transition-transform duration-500"
              src={image}
            />
          </div>
          {/* Subtle glow layer */}
          <div className="absolute inset-0 bg-[#0F0F12]/10 group-hover:bg-transparent transition-all pointer-events-none"></div>
        </div>
      ) : (
        <>
          <div className="absolute top-2 left-2 z-10 bg-surface-dim/80 backdrop-blur-sm rounded-full p-1 border border-outline-variant">
            <span className={`material-symbols-outlined ${rarityColors[rarity]} text-sm`} style={{ fontVariationSettings: "'FILL' 1" }}>
              {rarityIcons[rarity]}
            </span>
          </div>

          <div className="h-[55%] w-full relative overflow-hidden border-b border-tertiary-container/40">
            <img
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              src={image}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#16121A] to-transparent"></div>
          </div>

          <div className="p-4 flex flex-col gap-2 h-[45%] justify-between bg-surface-container-lowest">
            <div>
              <h4 className="font-title-md text-title-md text-primary-fixed truncate">{title}</h4>
              <p className="font-label-sm text-label-sm text-tertiary-container mt-1 uppercase tracking-widest">{type}</p>
            </div>

            {atk !== undefined && defense !== undefined && atk > 0 ? (
              <div className="flex justify-between items-center bg-surface-container/50 p-2 rounded border border-outline-variant/30">
                <div className="flex flex-col items-center">
                  <span className="font-label-sm text-label-sm text-outline">ATK</span>
                  <span className="font-title-md text-title-md text-error">{atk}</span>
                </div>
                <div className="h-8 w-px bg-outline-variant/50"></div>
                <div className="flex flex-col items-center">
                  <span className="font-label-sm text-label-sm text-outline">DEF</span>
                  <span className="font-title-md text-title-md text-secondary">{defense}</span>
                </div>
              </div>
            ) : (
              <div className="bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZWFkOWQyIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] p-2 rounded border border-outline-variant/30 relative">
                <p className="font-body-md text-body-md text-on-surface-variant text-sm line-clamp-3 italic">
                  "{abilityDescription || 'Un sortilège mystique qui déforme le tissu même de la réalité...'}"
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </article>
  )
}

interface GridCardProps {
  title: string
  type: string
  image: string
  cost: number
  rarity?: 'common' | 'rare' | 'mythic'
  onClick?: () => void
}

export const GridCard: React.FC<GridCardProps> = ({ title, type, image, cost, rarity = 'common', onClick }) => {
  const rarityIcons = {
    common: 'star',
    rare: 'eco',
    mythic: 'diamond'
  }
  const rarityColors = {
    common: 'text-tertiary-fixed-dim',
    rare: 'text-secondary-fixed-dim',
    mythic: 'text-primary-fixed-dim'
  }
  
  const isCompleteVisual = image.startsWith('/')

  return (
    <div 
      onClick={onClick}
      className="card-frame rounded-lg overflow-hidden group cursor-pointer"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-surface-container-lowest">
        {isCompleteVisual ? (
          <img
            alt={title}
            className="w-full h-full object-contain opacity-95 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"
            src={image}
          />
        ) : (
          <>
            <img
              alt={title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"
              src={image}
            />
            <div className="absolute top-2 left-2 w-8 h-8 bg-[#16121A] border border-primary/50 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.3)]">
              <span className="font-headline-lg-mobile text-primary font-bold text-lg">{cost}</span>
            </div>
            <div className="absolute top-2 right-2 w-6 h-6 bg-[#16121A] border border-tertiary-fixed-dim/50 rounded flex items-center justify-center rotate-45">
              <span className={`material-symbols-outlined ${rarityColors[rarity]} text-sm -rotate-45`} style={{ fontVariationSettings: "'FILL' 1" }}>
                {rarityIcons[rarity]}
              </span>
            </div>
          </>
        )}
      </div>
      {!isCompleteVisual && (
        <div className="p-3 bg-gradient-to-t from-[#0F0F12] to-[#16121A]">
          <h3 className="font-title-md text-sm text-primary-fixed-dim truncate mb-1">{title}</h3>
          <p className="font-label-sm text-xs text-tertiary-fixed-dim tracking-widest uppercase">{type}</p>
        </div>
      )}
    </div>
  )
}
