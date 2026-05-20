import React from 'react'

interface TopAppBarProps {
  title: string
  activePage?: 'home' | 'library' | 'decks' | 'market' | 'card-detail' | 'profile' | 'play'
  onNavigate?: (page: 'home' | 'library' | 'decks' | 'market' | 'profile' | 'play') => void
  onBack?: () => void
  showEssence?: boolean
  gold?: number
  gems?: number
  onAddResources?: () => void
  avatarSrc?: string
  theme?: 'light' | 'dark'
  onToggleTheme?: () => void
}

export const TopAppBar: React.FC<TopAppBarProps> = ({ 
  title, 
  activePage,
  onNavigate,
  onBack, 
  showEssence = true, 
  gold = 3000,
  gems = 200,
  onAddResources,
  avatarSrc = "https://lh3.googleusercontent.com/aida-public/AB6AXuAn_jA-IjWvpOZdDTuenCy_iwIdLgNcQxlSIzqKcJwyUDO3NTTDs-wRm_zBN5b7PYhhz8R2TxKD9ebPDwIrnrlsxheAsJ7_6eEJmN9XYzKkl3cSzEh8B4yIC6v6hTICV-Ah30cIf-Rqofb-glgB4kF_RhvPIbIuGlHefVktbCODUMHOtk7nk2GxjFWzChd9JeyUNBSpgB1TAu7W-WVqX_rO_ZpRm5Ig2aSMgTa-fRBUh2CgEkUOalbtORZpCClagculhSyDupxq2sc",
  theme,
  onToggleTheme
}) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-md shadow-[0_0_20px_rgba(221,183,255,0.15)] border-b border-outline-variant">
      <div className="flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
        <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="ARCANIMA Logo" className="w-12 h-12 object-contain drop-shadow-[0_0_8px_rgba(221,183,255,0.8)] invert-0 dark:invert transition-all duration-500" />
          <div className="text-title-md font-title-md font-bold tracking-widest text-primary uppercase">
            ARCANIMA
          </div>
        </div>
        
        {onNavigate && !onBack && (
          <nav className="hidden md:flex gap-6">
            <button
              onClick={() => onNavigate('home')}
              className={`font-label-sm text-label-sm hover:text-tertiary hover:drop-shadow-[0_0_8px_rgba(233,195,73,0.6)] transition-all duration-300 ${activePage === 'home' ? 'text-tertiary border-b-2 border-tertiary pb-1 font-bold' : 'text-on-surface-variant hover:text-primary'}`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('library')}
              className={`font-label-sm text-label-sm hover:text-tertiary hover:drop-shadow-[0_0_8px_rgba(233,195,73,0.6)] transition-all duration-300 ${activePage === 'library' ? 'text-tertiary border-b-2 border-tertiary pb-1 font-bold' : 'text-on-surface-variant hover:text-primary'}`}
            >
              Library
            </button>
            <button
              onClick={() => onNavigate('decks')}
              className={`font-label-sm text-label-sm hover:text-tertiary hover:drop-shadow-[0_0_8px_rgba(233,195,73,0.6)] transition-all duration-300 ${activePage === 'decks' ? 'text-tertiary border-b-2 border-tertiary pb-1 font-bold' : 'text-on-surface-variant hover:text-primary'}`}
            >
              Deck Builder
            </button>
            <button
              onClick={() => onNavigate('market')}
              className={`font-label-sm text-label-sm hover:text-tertiary hover:drop-shadow-[0_0_8px_rgba(233,195,73,0.6)] transition-all duration-300 ${activePage === 'market' ? 'text-tertiary border-b-2 border-tertiary pb-1 font-bold' : 'text-on-surface-variant hover:text-primary'}`}
            >
              Marketplace
            </button>
            <button
              onClick={() => onNavigate('play')}
              className={`font-label-sm text-label-sm flex items-center gap-1 hover:text-error hover:drop-shadow-[0_0_8px_rgba(255,84,73,0.6)] transition-all duration-300 ${activePage === 'play' ? 'text-error border-b-2 border-error pb-1 font-bold' : 'text-on-surface-variant hover:text-error/80'}`}
            >
              <span className="material-symbols-outlined text-[16px]">swords</span>
              Battle
            </button>
          </nav>
        )}
      </div>

      <div className="flex items-center gap-6">
        {/* Currency Display (Desktop) */}
        {showEssence && (
          <div 
            onClick={onAddResources}
            title={onAddResources ? "Tricher : Ajouter +1000 Or & +100 Joyaux" : undefined}
            className={`hidden md:flex items-center gap-4 bg-surface-container-high px-4 py-1 rounded border border-outline-variant ${onAddResources ? 'cursor-pointer hover:border-tertiary active:scale-95 transition-all' : ''}`}
          >
            <div className="flex items-center gap-1 text-tertiary select-none">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>toll</span>
              <span className="text-label-sm font-label-sm">{gold.toLocaleString()} Gold</span>
            </div>
            <div className="w-px h-4 bg-outline-variant"></div>
            <div className="flex items-center gap-1 text-primary select-none">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
              <span className="text-label-sm font-label-sm">{gems.toLocaleString()} Gems</span>
            </div>
          </div>
        )}

        {/* User Actions */}
        <div className="flex items-center gap-4 text-primary">
          {onToggleTheme && (
            <button 
              onClick={onToggleTheme} 
              title={theme === 'dark' ? "Passer au thème clair" : "Passer au thème sombre"}
              className="hover:text-tertiary transition-colors flex items-center justify-center"
            >
              <span className="material-symbols-outlined">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
            </button>
          )}
          {onBack && (
            <button onClick={onBack} className="hover:text-tertiary transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          )}
          <button 
            onClick={onAddResources} 
            title={onAddResources ? "Dev Cheat: Ajouter ressources" : undefined}
            className="hover:text-tertiary transition-colors"
          >
            <span className="material-symbols-outlined">account_balance_wallet</span>
          </button>
          <button 
            onClick={() => onNavigate?.('profile')}
            className={`relative w-8 h-8 rounded-full border overflow-hidden transition-all duration-300 hover:shadow-[0_0_8px_rgba(233,195,73,0.6)] focus:outline-none flex items-center justify-center cursor-pointer ${activePage === 'profile' ? 'border-tertiary shadow-[0_0_8px_rgba(233,195,73,0.6)]' : 'border-outline'}`}
          >
            <img 
              src={avatarSrc} 
              alt="Avatar de l'Aventurier" 
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
      </div>
    </header>
  )
}

interface BottomNavBarProps {
  activePage: 'home' | 'library' | 'decks' | 'market' | 'card-detail' | 'profile' | 'play'
  onNavigate: (page: 'home' | 'library' | 'decks' | 'market' | 'profile' | 'play') => void
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activePage, onNavigate }) => {
  const navItems = [
    { id: 'home', icon: 'auto_stories', label: 'Home' },
    { id: 'library', icon: 'grid_view', label: 'Library' },
    { id: 'decks', icon: 'style', label: 'Decks' },
    { id: 'market', icon: 'storefront', label: 'Market' },
    { id: 'play', icon: 'swords', label: 'Battle' }
  ]

  if (activePage === 'card-detail') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 border-t border-outline-variant bg-surface-container-highest/95 backdrop-blur-lg shadow-[0_-4px_20px_rgba(0,0,0,0.5)] rounded-t-full md:hidden">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id as 'home' | 'library' | 'decks' | 'market' | 'play')}
          className={
            activePage === item.id
              ? 'flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 animate-pulse scale-90 duration-200 ease-in-out'
              : 'flex flex-col items-center justify-center text-outline p-2 hover:text-secondary-fixed transition-all'
          }
        >
          <span className="material-symbols-outlined mb-1" style={activePage === item.id ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
          <span className="font-label-sm text-label-sm mt-1">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
