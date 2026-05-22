import { useState, useEffect } from 'react'

/**
 * Hook pour détecter si l'utilisateur accède depuis un téléphone ou PC
 * Utilise la détection de l'user-agent et les media queries
 */
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    // Check on first render
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
      const isUserAgentMobile = mobileRegex.test(userAgent.toLowerCase())
      
      const mediaQueryList = window.matchMedia('(max-width: 768px)')
      
      return isUserAgentMobile || mediaQueryList.matches
    }
    return false
  })

  useEffect(() => {
    // Détection via user-agent
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
    const isUserAgentMobile = mobileRegex.test(userAgent.toLowerCase())

    // Détection via media query (priorité aux media queries)
    const mediaQueryList = window.matchMedia('(max-width: 768px)')
    
    // Si la media query indique mobile, on considère que c'est mobile
    // Sinon on se fie à l'user agent
    const updateMobileState = () => {
      setIsMobile(mediaQueryList.matches || isUserAgentMobile)
    }
    
    updateMobileState()

    // Listener pour les changements de taille d'écran
    const handleMediaChange = () => {
      updateMobileState()
    }

    mediaQueryList.addEventListener('change', handleMediaChange)

    return () => {
      mediaQueryList.removeEventListener('change', handleMediaChange)
    }
  }, [])

  return isMobile
}
