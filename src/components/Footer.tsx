import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer className="w-full px-margin-mobile md:px-margin-desktop py-12 flex flex-col md:flex-row justify-between items-center gap-gutter bg-surface-container-lowest border-t border-outline-variant mt-24">
      <div className="flex items-center gap-2 mb-4 md:mb-0">
        <img src="/logo.png" alt="ARCANIMA Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(221,183,255,0.8)] invert-0 dark:invert transition-all duration-500" />
        <div className="text-title-md font-title-md text-primary">
          ARCANIMA
        </div>
      </div>
      <nav className="flex flex-wrap justify-center gap-6 mb-4 md:mb-0">
        <a href="#" className="text-body-md font-body-md text-on-surface-variant hover:text-tertiary-fixed underline decoration-tertiary/30 hover:opacity-80 transition-opacity duration-200">The Ancient Lore</a>
        <a href="#" className="text-body-md font-body-md text-on-surface-variant hover:text-tertiary-fixed underline decoration-tertiary/30 hover:opacity-80 transition-opacity duration-200">Card Legality</a>
        <a href="#" className="text-body-md font-body-md text-on-surface-variant hover:text-tertiary-fixed underline decoration-tertiary/30 hover:opacity-80 transition-opacity duration-200">Trading Rites</a>
        <a href="#" className="text-body-md font-body-md text-on-surface-variant hover:text-tertiary-fixed underline decoration-tertiary/30 hover:opacity-80 transition-opacity duration-200">Privacy Sigil</a>
      </nav>
      <div className="text-label-sm font-label-sm text-on-surface-variant text-center md:text-right">
        © 2024 ARCANIMA. All rights reserved by the High Council.
      </div>
    </footer>
  )
}
