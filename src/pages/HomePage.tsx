import React, { useState } from 'react'
import { TopAppBar, BottomNavBar } from '../components/Navigation'
import { Footer } from '../components/Footer'

interface HomePageProps {
  onNavigate: (page: 'home' | 'library' | 'decks' | 'market' | 'card-detail' | 'profile', cardId?: string) => void
  gold?: number
  gems?: number
  onAddResources?: () => void
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, gold, gems, onAddResources }) => {
  const [activeNav, setActiveNav] = useState<'home' | 'library' | 'decks' | 'market' | 'card-detail' | 'profile' | 'play'>('home')

  const handleNavigation = (page: 'home' | 'library' | 'decks' | 'market' | 'profile' | 'play') => {
    setActiveNav(page)
    onNavigate(page)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0F12] relative overflow-x-hidden antialiased">
      {/* TopNavBar */}
      <TopAppBar 
        title="" 
        activePage="home" 
        onNavigate={handleNavigation} 
        gold={gold}
        gems={gems}
        onAddResources={onAddResources}
      />

      {/* Main Content */}
      <main className="flex-grow pt-16 md:pt-24 pb-24 md:pb-0">
        
        {/* Hero Section */}
        <section className="relative w-full min-h-[716px] flex items-center justify-center overflow-hidden mb-24">
          <div className="absolute inset-0 z-0">
            <img 
              alt="Mystical Background" 
              className="w-full h-full object-cover opacity-30" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyF8VyuYmLbw6i721nNXrBU4-D4_Qrqxvz4m9OjmgWZkaXXo7UmK_gMhgBDcypIMBHhBDsQu25L0LCkGAAwHZysSNKJsQBeNB-FWjiz9hb6j3NJd8uhZrrhQhtJZFEb13Pr9x0ocKKriOvhx6bjAPYl657HxRQ5a4NHzrVHxUkkB10c1mVSgwZJjDaN9ZgeecVwG8NAf49X9iprI2jPeyXPZ8RFXFjRm84Z6XKsuxad82tLtSnBRzHDNwLss8dcbwC4eINOhajV-g"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0F0F12]"></div>
          </div>
          <div className="relative z-10 text-center px-gutter max-w-4xl mx-auto flex flex-col items-center gap-8">
            <h1 className="text-display-lg font-display-lg text-primary drop-shadow-[0_0_30px_rgba(221,183,255,0.8)] px-4">
              Entrez dans l'Archive Éternelle
            </h1>
            <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl px-4">
              Découvrez les secrets anciens, collectionnez les artefacts de pouvoir et forgez votre destinée dans le grand registre d'Aether.
            </p>
            <button 
              onClick={() => handleNavigation('library')}
              className="mt-8 px-8 py-4 bg-gradient-to-r from-primary-container to-inverse-primary text-on-primary-container text-title-md font-title-md font-bold rounded-DEFAULT border border-tertiary pulse-hover transition-all duration-300 flex items-center gap-2"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              Commencer la Collection
            </button>
          </div>
        </section>

        {/* Featured Section: Legendary Cards */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-32">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px bg-gradient-to-r from-transparent to-tertiary flex-grow"></div>
            <h2 className="text-headline-lg font-headline-lg text-tertiary whitespace-nowrap">Cartes Légendaires de la Semaine</h2>
            <div className="h-px bg-gradient-to-l from-transparent to-tertiary flex-grow"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 - Behemoth */}
            <div 
              onClick={() => onNavigate('card-detail', 'behemoth')}
              className="relative group cursor-pointer"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-tertiary to-primary opacity-50 blur-lg group-hover:opacity-100 transition duration-500 rounded-xl"></div>
              <div className="relative bg-[#16121A] p-2 border border-tertiary/50 rounded-xl h-[450px] flex flex-col card-glow">
                <div className="h-2/3 bg-surface-container-high rounded-t-lg overflow-hidden border-b border-tertiary/30">
                  <img 
                    alt="Béhémoth d'Obsidienne" 
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-700" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSwod1whO0baYFzL3FdO0-oDw83Jl126PDnyvxLJWgqNI81_OF1dtEXA3jG7FAXHu_A9xE2tMCcW-R13imUqwRHE6jAqG6Rm9USG7LY61HoKDvEonApo0yFDFP95Qc8JPNrltDZRB0B1cL7mjIhL6Bq1sa9P-rDlUOcofA8deJCAVF4nrXAz72OzB3fGv4MR1un4bGevgxQeAZ3VXlDyoRE20d4YYSKXC-bujSHpBW65HU4Ggtt4PiY_u5xkdq_8qOUbbnk17uWGQ"
                  />
                </div>
                <div className="flex-grow parchment-bg rounded-b-lg p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-title-md font-title-md text-primary mb-1">Béhémoth d'Obsidienne</h3>
                    <p className="text-label-sm font-label-sm text-tertiary uppercase tracking-widest">Créature Mythique</p>
                  </div>
                  <div className="text-body-md font-body-md text-on-surface-variant text-sm">
                    Frappe avec la force des âges oubliés.
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 - Astrolabe */}
            <div 
              onClick={() => onNavigate('card-detail', 'astrolabe')}
              className="relative group cursor-pointer md:-translate-y-8"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-inverse-primary opacity-70 blur-lg group-hover:opacity-100 transition duration-500 rounded-xl"></div>
              <div className="relative bg-[#16121A] p-2 border border-primary/50 rounded-xl h-[450px] flex flex-col card-glow z-10">
                <div className="h-2/3 bg-surface-container-high rounded-t-lg overflow-hidden border-b border-primary/30">
                  <img 
                    alt="Astrolabe du Néant" 
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-700" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgxUQEza9LlgAfiXJdEzk3S17MlkSKxcubCFt3jUJoCmXhFe3UJQ3W_Zob7jFGncYo-Y6YNuI32lv1n2L_TKLVLaV2AWKxs6Ce_bou3qC9tea_jl2OCEHedLUd6wswuy4VWdflfos0_4hEnl8Qsy3YLMdH9Z8oVQx6UXCWCVhD4elW8RYS_eM3qMIFQ5EIGXfptd0zj6MKsuxunaUUtynCQ12jXhypEz85yOdxFaXQs6w3VzXPsuKUTu_fuRAp76PMoZerqgU0eeA"
                  />
                </div>
                <div className="flex-grow parchment-bg rounded-b-lg p-4 flex flex-col justify-between border-t-primary/30">
                  <div>
                    <h3 className="text-title-md font-title-md text-tertiary mb-1">Astrolabe du Néant</h3>
                    <p className="text-label-sm font-label-sm text-primary uppercase tracking-widest">Artefact Ancien</p>
                  </div>
                  <div className="text-body-md font-body-md text-on-surface-variant text-sm">
                    Manipule les fils du temps et de l'espace aethérique.
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 - Sylve Corrompue */}
            <div 
              onClick={() => onNavigate('card-detail', 'sylve')}
              className="relative group cursor-pointer"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-secondary-container to-tertiary opacity-50 blur-lg group-hover:opacity-100 transition duration-500 rounded-xl"></div>
              <div className="relative bg-[#16121A] p-2 border border-tertiary/50 rounded-xl h-[450px] flex flex-col card-glow">
                <div className="h-2/3 bg-surface-container-high rounded-t-lg overflow-hidden border-b border-tertiary/30">
                  <img 
                    alt="Sylve Corrompue" 
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-700" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDng9v7a71ko-cvtjTNTDvzRf4vJ2ulK9_uyJimnUBzJ--3I7XJGzzcb4suC5ATXhxkgjsjFPwOyOgjyaZ0AGYsJ4QAP9FFlUUcHk0K_lH5EnE8o3Mr-sXHePnPrfV_xJWFaqSAanUdUwYxAlBhLlW-WOJxZbkkK9i2uc6QtwyDuMc0pbdN3HgCqu41ze6jwGMnEyLmLa5QKxyWqGjE9QAALWzr795G8DUyQ7ik7lYQb6FO9-sCPbVqGHgYjWm_k7nx4f1cuBoaToE"
                  />
                </div>
                <div className="flex-grow parchment-bg rounded-b-lg p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-title-md font-title-md text-primary mb-1">Sylve Corrompue</h3>
                    <p className="text-label-sm font-label-sm text-tertiary uppercase tracking-widest">Terrain Maudit</p>
                  </div>
                  <div className="text-body-md font-body-md text-on-surface-variant text-sm">
                    Un lieu où la nature a dévoré la magie ancienne.
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* BottomNavBar for Mobile */}
      <BottomNavBar activePage={activeNav} onNavigate={handleNavigation} />
    </div>
  )
}

export default HomePage
