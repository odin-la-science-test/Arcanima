import express from 'express'
import bcrypt from 'bcrypt'
import { getDatabase } from '../db/database.js'

const router = express.Router()

// Register new user
router.post('/register', async (req, res) => {
  try {
    const db = await getDatabase()
    const { username, email, password } = req.body

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, error: 'Tous les champs sont requis' })
    }

    if (username.length < 3) {
      return res.status(400).json({ success: false, error: 'Le pseudo doit avoir au moins 3 caractères' })
    }

    // Check if user already exists
    const existingUser = await db.get('SELECT id FROM users WHERE username = ? OR email = ?', username, email)
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Ce pseudo ou email est déjà utilisé' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const result = await db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', username, email, hashedPassword)
    const userId = result.lastID

    // Initialize user data (0 resources, level 1)
    await db.run(`
      INSERT INTO user_data (user_id, gold, gems, level, pseudonym, packs_opened, game_history, owned_cards)
      VALUES (?, 0, 0, 1, '', 0, '[]', '{}')
    `, userId)

    res.json({ 
      success: true, 
      user: { 
        id: userId, 
        username, 
        email 
      } 
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ success: false, error: 'Erreur lors de l\'inscription' })
  }
})

// Login user
router.post('/login', async (req, res) => {
  try {
    const db = await getDatabase()
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Pseudo et mot de passe requis' })
    }

    // Find user
    const user = await db.get('SELECT id, username, email, password FROM users WHERE username = ?', username)
    
    if (!user) {
      return res.status(400).json({ success: false, error: 'Pseudo ou mot de passe incorrect' })
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(400).json({ success: false, error: 'Pseudo ou mot de passe incorrect' })
    }

    res.json({ 
      success: true, 
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email 
      } 
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ success: false, error: 'Erreur lors de la connexion' })
  }
})

// Get user data
router.get('/user/:userId', async (req, res) => {
  try {
    const db = await getDatabase()
    const { userId } = req.params

    const userData = await db.get(`
      SELECT user_id, gold, gems, level, pseudonym, packs_opened, game_history, owned_cards
      FROM user_data
      WHERE user_id = ?
    `, userId)

    if (!userData) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' })
    }

    res.json({
      success: true,
      data: {
        gold: userData.gold,
        gems: userData.gems,
        level: userData.level,
        pseudonym: userData.pseudonym,
        packsOpened: userData.packs_opened,
        gameHistory: JSON.parse(userData.game_history),
        ownedCards: JSON.parse(userData.owned_cards)
      }
    })
  } catch (error) {
    console.error('Get user data error:', error)
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des données' })
  }
})

// Update user data
router.post('/user/:userId/update', async (req, res) => {
  try {
    const db = await getDatabase()
    const { userId } = req.params
    const { key, value } = req.body

    if (!key || value === undefined) {
      return res.status(400).json({ success: false, error: 'Clé et valeur requises' })
    }

    // Get current data
    const userData = await db.get('SELECT * FROM user_data WHERE user_id = ?', userId)
    
    if (!userData) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' })
    }

    // Map key to column name
    const columnMap = {
      'gold': 'gold',
      'gems': 'gems',
      'level': 'level',
      'pseudonym': 'pseudonym',
      'packsOpened': 'packs_opened',
      'gameHistory': 'game_history',
      'ownedCards': 'owned_cards'
    }

    const column = columnMap[key]
    if (!column) {
      return res.status(400).json({ success: false, error: 'Clé invalide' })
    }

    // Prepare value
    let finalValue = value
    if (typeof value === 'object') {
      finalValue = JSON.stringify(value)
    }

    // Update data
    await db.run(`UPDATE user_data SET ${column} = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`, finalValue, userId)

    res.json({ success: true })
  } catch (error) {
    console.error('Update user data error:', error)
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour' })
  }
})

// Update multiple fields at once
router.post('/user/:userId/update-bulk', async (req, res) => {
  try {
    const db = await getDatabase()
    const { userId } = req.params
    const updates = req.body

    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ success: false, error: 'Données invalides' })
    }

    const userData = await db.get('SELECT * FROM user_data WHERE user_id = ?', userId)
    
    if (!userData) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' })
    }

    const columnMap = {
      'gold': 'gold',
      'gems': 'gems',
      'level': 'level',
      'pseudonym': 'pseudonym',
      'packsOpened': 'packs_opened',
      'gameHistory': 'game_history',
      'ownedCards': 'owned_cards'
    }

    // Build dynamic update query
    const setClauses = []
    const values = []

    for (const [key, value] of Object.entries(updates)) {
      const column = columnMap[key]
      if (column) {
        let finalValue = value
        if (typeof value === 'object') {
          finalValue = JSON.stringify(value)
        }
        setClauses.push(`${column} = ?`)
        values.push(finalValue)
      }
    }

    if (setClauses.length === 0) {
      return res.status(400).json({ success: false, error: 'Aucune clé valide fournie' })
    }

    values.push(userId)
    const query = `UPDATE user_data SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`
    await db.run(query, values)

    res.json({ success: true })
  } catch (error) {
    console.error('Bulk update error:', error)
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour' })
  }
})

export default router
