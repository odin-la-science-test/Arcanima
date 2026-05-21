import { useState, useEffect, useCallback } from 'react'

declare global {
  interface ImportMeta {
    env: Record<string, string | undefined>
  }
}

export interface User {
  id: string | number
  username: string
  email: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isLoggedIn: boolean
}

const CURRENT_USER_KEY = 'arcanima_current_user'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Check if API is available
let apiAvailable = true

const testAPI = async () => {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2000)
    const response = await fetch(`${API_URL}/health`, { signal: controller.signal })
    clearTimeout(timeoutId)
    apiAvailable = response.ok
    return response.ok
  } catch (error) {
    apiAvailable = false
    return false
  }
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    const currentUserJson = localStorage.getItem(CURRENT_USER_KEY)
    if (currentUserJson) {
      try {
        setUser(JSON.parse(currentUserJson))
      } catch (e) {
        console.error('Failed to restore user session:', e)
      }
    }
    setIsLoading(false)
    
    // Test API availability on startup
    testAPI()
  }, [])

  const register = useCallback(async (username: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Try API first
      if (apiAvailable || await testAPI()) {
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        })

        const data = await response.json()
        if (data.success) {
          const newUser: User = data.user
          setUser(newUser)
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser))
          // Initialize user data on server
          initializeUserDataLocal(String(newUser.id))
          return { success: true }
        } else {
          return { success: false, error: data.error }
        }
      } else {
        throw new Error('API unavailable')
      }
    } catch (error) {
      console.warn('API unavailable, using localStorage fallback')
      // Fallback to localStorage
      const result = registerLocal(username, email, password)
      if (result.success && result.user) {
        setUser(result.user)
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(result.user))
      }
      return { success: result.success, error: result.error }
    }
  }, [])

  const login = useCallback(async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Try API first
      if (apiAvailable || await testAPI()) {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        })

        const data = await response.json()
        if (data.success) {
          const loggedInUser: User = data.user
          setUser(loggedInUser)
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(loggedInUser))
          return { success: true }
        } else {
          return { success: false, error: data.error }
        }
      } else {
        throw new Error('API unavailable')
      }
    } catch (error) {
      console.warn('API unavailable, using localStorage fallback')
      // Fallback to localStorage
      const result = loginLocal(username, password)
      if (result.success && result.user) {
        setUser(result.user)
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(result.user))
      }
      return { success: result.success, error: result.error }
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(CURRENT_USER_KEY)
  }, [])

  const updateUserData = useCallback(async (key: string, value: any) => {
    if (!user) return

    // Always update locally first
    updateUserDataLocal(String(user.id), key, value)

    // Try to sync with API
    if (apiAvailable || await testAPI()) {
      try {
        await fetch(`${API_URL}/auth/user/${user.id}/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value })
        })
      } catch (error) {
        console.warn('Failed to sync with backend:', error)
      }
    }
  }, [user])

  const updateUserDataBulk = useCallback(async (updates: Record<string, any>) => {
    if (!user) return

    // Always update locally first
    updateUserDataBulkLocal(String(user.id), updates)

    // Try to sync with API
    if (apiAvailable || await testAPI()) {
      try {
        await fetch(`${API_URL}/auth/user/${user.id}/update-bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        })
      } catch (error) {
        console.warn('Failed to sync with backend:', error)
      }
    }
  }, [user])

  const getUserData = useCallback(async (key?: string, defaultValue: any = null) => {
    if (!user) return defaultValue

    // Try API first, but gracefully handle failures
    try {
      const response = await fetch(`${API_URL}/auth/user/${user.id}`, { signal: AbortSignal.timeout(3000) })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          // Sync API data to localStorage
          syncUserDataToLocal(String(user.id), data.data)
          
          if (key) {
            return data.data[key] ?? defaultValue
          }
          return data.data
        }
      } else if (response.status === 404) {
        // User doesn't exist on API, use localStorage
        return getUserDataLocal(String(user.id), key, defaultValue)
      }
    } catch (error) {
      // Network error or timeout, use localStorage
      console.warn('API unavailable, using localStorage')
    }

    // Fallback to localStorage
    return getUserDataLocal(String(user.id), key, defaultValue)
  }, [user])

  const getAllUserData = useCallback(async () => {
    if (!user) return null

    // Try API first
    if (apiAvailable || await testAPI()) {
      try {
        const response = await fetch(`${API_URL}/auth/user/${user.id}`)
        const data = await response.json()

        if (data.success && data.data) {
          // Sync API data to localStorage
          syncUserDataToLocal(String(user.id), data.data)
          return data.data
        }
      } catch (error) {
        console.warn('Failed to fetch from API, using localStorage')
      }
    }

    // Fallback to localStorage
    return getAllUserDataLocal(String(user.id))
  }, [user])

  return {
    user,
    isLoading,
    isLoggedIn: user !== null,
    register,
    login,
    logout,
    updateUserData,
    updateUserDataBulk,
    getUserData,
    getAllUserData
  }
}

// ============== LOCAL STORAGE FUNCTIONS (FALLBACK) ==============

const USERS_STORAGE_KEY = 'arcanima_users'

const getUsersDatabase = (): Record<string, { email: string; password: string; id: string }> => {
  const saved = localStorage.getItem(USERS_STORAGE_KEY)
  return saved ? JSON.parse(saved) : {}
}

const saveUsersDatabase = (users: Record<string, { email: string; password: string; id: string }>) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

const simpleHash = (str: string): string => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16)
}

const initializeUserDataLocal = (userId: string) => {
  const userDataKey = `arcanima_user_${userId}`
  const initialData = {
    gold: 0,
    gems: 0,
    ownedCards: {},
    level: 1,
    pseudonym: '',
    packsOpened: 0,
    gameHistory: []
  }
  localStorage.setItem(userDataKey, JSON.stringify(initialData))
}

const registerLocal = (username: string, email: string, password: string): { success: boolean; error?: string; user?: User } => {
  if (!username || !email || !password) {
    return { success: false, error: 'Tous les champs sont requis' }
  }

  if (username.length < 3) {
    return { success: false, error: 'Le pseudo doit avoir au moins 3 caractères' }
  }

  const users = getUsersDatabase()

  if (users[username]) {
    return { success: false, error: 'Ce pseudo est déjà pris' }
  }

  if (Object.values(users).some(u => u.email === email)) {
    return { success: false, error: 'Cet email est déjà utilisé' }
  }

  const newUserId = Math.random().toString(36).substr(2, 9)
  users[username] = { email, password: simpleHash(password), id: newUserId }
  saveUsersDatabase(users)

  const newUser: User = {
    id: newUserId,
    username,
    email
  }

  initializeUserDataLocal(newUserId)
  return { success: true, user: newUser }
}

const loginLocal = (username: string, password: string): { success: boolean; error?: string; user?: User } => {
  if (!username || !password) {
    return { success: false, error: 'Pseudo et mot de passe requis' }
  }

  const users = getUsersDatabase()
  const userRecord = users[username]

  if (!userRecord || userRecord.password !== simpleHash(password)) {
    return { success: false, error: 'Pseudo ou mot de passe incorrect' }
  }

  const user: User = {
    id: userRecord.id,
    username,
    email: userRecord.email
  }

  return { success: true, user }
}

const updateUserDataLocal = (userId: string, key: string, value: any) => {
  const userDataKey = `arcanima_user_${userId}`
  const saved = localStorage.getItem(userDataKey)

  let userData = {
    gold: 0,
    gems: 0,
    ownedCards: {},
    level: 1,
    pseudonym: '',
    packsOpened: 0,
    gameHistory: []
  }

  if (saved) {
    try {
      userData = JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse user data:', e)
    }
  }

  userData = { ...userData, [key]: value }
  localStorage.setItem(userDataKey, JSON.stringify(userData))
}

const updateUserDataBulkLocal = (userId: string, updates: Record<string, any>) => {
  const userDataKey = `arcanima_user_${userId}`
  const saved = localStorage.getItem(userDataKey)

  let userData = {
    gold: 0,
    gems: 0,
    ownedCards: {},
    level: 1,
    pseudonym: '',
    packsOpened: 0,
    gameHistory: []
  }

  if (saved) {
    try {
      userData = JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse user data:', e)
    }
  }

  Object.assign(userData, updates)
  localStorage.setItem(userDataKey, JSON.stringify(userData))
}

const getUserDataLocal = (userId: string, key?: string, defaultValue: any = null) => {
  const userDataKey = `arcanima_user_${userId}`
  const saved = localStorage.getItem(userDataKey)

  if (!saved) {
    initializeUserDataLocal(userId)
    if (!key) return null
    return defaultValue
  }

  try {
    const userData = JSON.parse(saved)
    if (key) {
      return userData[key] ?? defaultValue
    }
    return userData
  } catch {
    return key ? defaultValue : null
  }
}

const getAllUserDataLocal = (userId: string) => {
  return getUserDataLocal(userId)
}

const syncUserDataToLocal = (userId: string, apiData: any) => {
  const userDataKey = `arcanima_user_${userId}`
  localStorage.setItem(userDataKey, JSON.stringify(apiData))
}
