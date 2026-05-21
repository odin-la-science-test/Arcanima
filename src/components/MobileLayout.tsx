import React from 'react'

interface MobileLayoutProps {
  htmlPath: string
  children?: React.ReactNode
}

/**
 * Composant qui charge et affiche les designs HTML mobiles
 * Charge le contenu HTML du dossier téléphone et l'affiche via dangerouslySetInnerHTML
 * Inclut aussi les styles du head pour garantir un rendu correct
 */
export const MobileLayout: React.FC<MobileLayoutProps> = ({ htmlPath, children }) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchAndInjectHtml = async () => {
      try {
        setLoading(true)
        // Fetch le fichier HTML depuis le dossier public
        const response = await fetch(htmlPath)
        if (!response.ok) {
          throw new Error(`Failed to load ${htmlPath}`)
        }
        const html = await response.text()
        
        // Parse le HTML
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        
        // Extrait les styles du head
        const headStyles = doc.head.innerHTML
        
        // Extrait le contenu du body
        const bodyContent = doc.body.innerHTML
        
        // Injecte dans le conteneur
        if (containerRef.current) {
          // Crée un wrapper avec les styles
          const wrapper = document.createElement('div')
          wrapper.innerHTML = bodyContent
          
          // Injecte les styles
          const styleWrapper = document.createElement('div')
          styleWrapper.innerHTML = headStyles
          
          // Ajoute les styles au document si nécessaire
          Array.from(styleWrapper.querySelectorAll('style, link')).forEach(el => {
            document.head.appendChild(el.cloneNode(true))
          })
          
          containerRef.current.innerHTML = ''
          containerRef.current.appendChild(wrapper)
        }
        
        setError(null)
      } catch (err) {
        console.error('Error loading mobile layout:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchAndInjectHtml()
  }, [htmlPath])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="text-on-surface">Chargement du design mobile...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="text-error text-center p-4">
          <p>Erreur lors du chargement:</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className="w-full min-h-screen"
    />
  )
}

export default MobileLayout
