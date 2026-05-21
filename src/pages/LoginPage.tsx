import React, { useState } from 'react'

interface LoginPageProps {
  onLoginSuccess: () => void
  onRegister: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  onLogin: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onRegister, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (isLogin) {
        const result = await onLogin(username, password)
        if (result.success) {
          onLoginSuccess()
        } else {
          setError(result.error || 'Erreur de connexion')
        }
      } else {
        if (password !== confirmPassword) {
          setError('Les mots de passe ne correspondent pas')
          setIsLoading(false)
          return
        }
        const result = await onRegister(username, email, password)
        if (result.success) {
          onLoginSuccess()
        } else {
          setError(result.error || 'Erreur d\'inscription')
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a080d] via-[#1a1625] to-[#0a080d] p-4">
      {/* Ambient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/10 rounded-full filter blur-3xl opacity-50" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <img src="/logo.png" alt="ARCANIMA Logo" className="w-20 h-20 object-contain drop-shadow-[0_0_20px_rgba(221,183,255,0.6)]" />
          </div>
          <h1 className="text-5xl font-black tracking-widest text-primary uppercase mb-2">ARCANIMA</h1>
          <p className="text-on-surface-variant text-sm tracking-wide">Grimoire Éternel</p>
        </div>

        {/* Card Container */}
        <div className="rounded-2xl p-8 border border-outline-variant/30 backdrop-blur-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(26,22,37,0.6) 0%, rgba(13,11,16,0.8) 100%)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.1)'
          }}>

          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6 p-1 rounded-lg border border-outline-variant/20 bg-black/30">
            <button
              onClick={() => {
                setIsLogin(true)
                setError(null)
                setUsername('')
                setPassword('')
                setEmail('')
                setConfirmPassword('')
              }}
              className={`flex-1 py-2 px-4 rounded-md font-semibold uppercase text-xs tracking-wider transition-all ${
                isLogin
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}>
              Connexion
            </button>
            <button
              onClick={() => {
                setIsLogin(false)
                setError(null)
                setUsername('')
                setPassword('')
                setEmail('')
                setConfirmPassword('')
              }}
              className={`flex-1 py-2 px-4 rounded-md font-semibold uppercase text-xs tracking-wider transition-all ${
                !isLogin
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}>
              Inscription
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-primary mb-2 uppercase tracking-wider">
                Pseudo
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Archimède l'Éveillé"
                disabled={isLoading}
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-outline-variant/30 text-white placeholder-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all disabled:opacity-50"
              />
            </div>

            {/* Email (Register only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-primary mb-2 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemple@arcanima.com"
                  disabled={isLoading}
                  className="w-full px-4 py-2 rounded-lg bg-black/50 border border-outline-variant/30 text-white placeholder-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all disabled:opacity-50"
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-primary mb-2 uppercase tracking-wider">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-outline-variant/30 text-white placeholder-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all disabled:opacity-50"
              />
            </div>

            {/* Confirm Password (Register only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-primary mb-2 uppercase tracking-wider">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full px-4 py-2 rounded-lg bg-black/50 border border-outline-variant/30 text-white placeholder-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all disabled:opacity-50"
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg font-black uppercase tracking-[0.15em] text-on-primary transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #842bd2 0%, #5a1e8c 100%)',
                boxShadow: '0 4px 15px rgba(132,43,210,0.3)'
              }}>
              {isLoading ? 'Chargement...' : isLogin ? 'Se Connecter' : "S'Inscrire"}
            </button>
          </form>

          {/* Info Text */}
          <p className="text-center text-xs text-on-surface-variant mt-6 tracking-wide">
            {isLogin
              ? "Vous n'avez pas de compte ? Créez-en un pour sauvegarder votre progression."
              : "Vous avez déjà un compte ? Connectez-vous pour continuer votre aventure."}
          </p>
        </div>
      </div>
    </div>
  )
}
