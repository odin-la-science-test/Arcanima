# 🎮 Arcanima - Backend Database Setup

## Installation

### Prérequis
- Node.js 16+ installé
- npm ou yarn

### Étapes d'installation

1. **Naviguez au dossier backend** :
```bash
cd backend
```

2. **Installez les dépendances** :
```bash
npm install
```

3. **Créez le fichier .env** :
```bash
cp .env.example .env
```

### Lancement du serveur

Pour le développement (avec rechargement automatique):
```bash
npm run dev
```

Pour la production:
```bash
npm start
```

Le serveur sera disponible à `http://localhost:5000`

## Structure de la base de données

### Tables créées automatiquement :

**Table `users`** :
- `id` (INTEGER, PRIMARY KEY)
- `username` (TEXT, UNIQUE)
- `email` (TEXT, UNIQUE)
- `password` (TEXT, hashé avec bcrypt)
- `created_at` (DATETIME)

**Table `user_data`** :
- `id` (INTEGER, PRIMARY KEY)
- `user_id` (INTEGER, FOREIGN KEY)
- `gold` (INTEGER)
- `gems` (INTEGER)
- `level` (INTEGER)
- `pseudonym` (TEXT)
- `packs_opened` (INTEGER)
- `game_history` (TEXT, JSON)
- `owned_cards` (TEXT, JSON)
- `updated_at` (DATETIME)

## Endpoints API

### Authentification

**POST** `/api/auth/register`
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**POST** `/api/auth/login`
```json
{
  "username": "string",
  "password": "string"
}
```

### Données utilisateur

**GET** `/api/auth/user/:userId`
- Récupère toutes les données d'un utilisateur

**POST** `/api/auth/user/:userId/update`
```json
{
  "key": "gold|gems|level|pseudonym|packsOpened|gameHistory|ownedCards",
  "value": "any"
}
```

**POST** `/api/auth/user/:userId/update-bulk`
```json
{
  "gold": 100,
  "gems": 50,
  "level": 5
}
```

## Sécurité

- ✅ Mots de passe hashés avec bcrypt
- ✅ CORS configuré pour le frontend local
- ✅ Validation des données côté serveur
- ✅ Foreign keys activées dans SQLite

## Development

La base de données SQLite est créée automatiquement à `./db/arcanima.db`

Pour réinitialiser la base de données, supprimez simplement le fichier `db/arcanima.db` et redémarrez le serveur.

## Production

Pour déployer en production :

1. Configurez les variables d'environnement
2. Utilisez `npm start` pour lancer le serveur
3. Configurez un reverse proxy (nginx, Apache)
4. Utilisez une base de données robuste (PostgreSQL, MySQL) en lieu et place de SQLite
