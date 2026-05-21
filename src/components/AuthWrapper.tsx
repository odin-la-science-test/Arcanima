import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { LoginPage } from '../pages/LoginPage'

interface AppWrapperProps {
  children: React.ReactNode
  onUserLogout: () => void
}

export const AuthWrapper: React.FC<AppWrapperProps> = ({ children, onUserLogout }) => {
  const { user, isLoading, isLoggedIn, login, register, logout } = useAuth()

  const handleLogout = () => {
    logout()
    onUserLogout()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a080d] via-[#1a1625] to-[#0a080d]">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl animate-spin text-primary">auto_awesome</span>
          <p className="text-primary mt-4 tracking-widest uppercase text-sm">Chargement du Grimoire...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <LoginPage
        onLoginSuccess={() => {}} // Auth state updates automatically via useAuth
        onLogin={login}
        onRegister={register}
      />
    )
  }

  return (
    <div className="relative">
      {/* User logout button in header */}
      <div className="fixed top-4 right-4 z-40 bg-black/40 backdrop-blur px-4 py-2 rounded-lg border border-outline-variant/20 flex items-center gap-2">
        <span className="text-xs text-on-surface-variant">
          {user?.username}
        </span>
        <button
          onClick={handleLogout}
          className="px-3 py-1 rounded bg-primary/20 hover:bg-primary/30 text-primary text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          Déconnexion
        </button>
      </div>
      {children}
    </div>
  )
}
