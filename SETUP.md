# 🎮 ARCANIMA - Jeu de Cartes

## Architecture

L'application utilise une architecture **client-serveur** :

- **Frontend** : React + Vite (TypeScript)
- **Backend** : Express.js + SQLite3

## Installation rapide

### 1. Installer les dépendances du frontend
```bash
npm install
```

### 2. Installer et configurer le backend
```bash
cd backend
npm install
cp .env.example .env
```

## Lancement

### Option 1 : Deux terminaux séparés

**Terminal 1 - Frontend** :
```bash
npm run dev
```

**Terminal 2 - Backend** :
```bash
cd backend
npm run dev
```

### Option 2 : Avec npm-run-all (conseillé)

```bash
npm install --save-dev npm-run-all
```

Puis modifiez le `package.json` pour ajouter :
```json
"scripts": {
  "dev:all": "npm-run-all --parallel dev dev:backend",
  "dev:backend": "cd backend && npm run dev"
}
```

Lancez avec :
```bash
npm run dev:all
```

## Architecture de la base de données

Chaque utilisateur créé automatiquement :
- Démarre avec **0 cartes**, **0 or**, **0 gemmes**
- A un **niveau 1**
- Pas d'**historique de jeu**
- Données stockées dans **SQLite3**

Les données sont **persistées** sur le serveur, pas en localStorage.

## Variables d'environnement

### Frontend (.env.development)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (backend/.env)
```
PORT=5000
NODE_ENV=development
DATABASE_PATH=./db/arcanima.db
```

## Structure du projet

```
├── src/                    # Code source React
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── data/
├── backend/               # Serveur Express
│   ├── routes/
│   │   └── auth.js
│   ├── db/
│   │   ├── database.js
│   │   └── arcanima.db   (créé automatiquement)
│   └── server.js
├── public/               # Fichiers statiques
└── index.html
```

## API Backend

Voir [backend/README.md](backend/README.md) pour la documentation complète des endpoints API.

## Développement

Les modifications du frontend sont appliquées automatiquement (hot reload avec Vite).

Pour les modifications du backend, utilisez `npm run dev` qui relancera le serveur automatiquement.

## Production

1. Build le frontend : `npm run build`
2. Déployez le dossier `dist/` sur un serveur web statique
3. Déployez le backend sur un serveur Node.js
4. Configurez les variables d'environnement correctement
