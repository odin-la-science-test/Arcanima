import { useState, useEffect } from 'react'

/**
 * Hook pour détecter si l'utilisateur accède depuis un téléphone ou PC
 * Utilise la détection de l'user-agent et les media queries
 */
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    // Détection via user-agent
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
    const isUserAgentMobile = mobileRegex.test(userAgent.toLowerCase())

    // Détection via media query
    const mediaQueryList = window.matchMedia('(max-width: 768px)')
    
    setIsMobile(isUserAgentMobile || mediaQueryList.matches)

    // Listener pour les changements de taille d'écran
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsMobile(isUserAgentMobile || e.matches)
    }

    mediaQueryList.addEventListener('change', handleMediaChange)

    return () => {
      mediaQueryList.removeEventListener('change', handleMediaChange)
    }
  }, [])

  return isMobile
}
