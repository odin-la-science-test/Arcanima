# Aether Grimoire - Archive Éternelle

Une application de collection de cartes de jeu en thème fantasy sombre, construite avec **React** + **TypeScript** et stylisée avec **Tailwind CSS**.

## 🎨 Caractéristiques

✅ **5 Pages Complètes**
- 🏠 **Accueil**: Hero section avec cartes légendaires en scroll horizontal
- 📚 **Grimoire**: Bibliothèque avec filtrage par faction
- 🃏 **Constructeur de Decks**: Sélection de cartes et gestion du deck
- 🎴 **Détails de Carte**: Vue détaillée avec accordions
- 🛒 **Marché**: Boutique avec packs et essence

✅ **Design Système Complet**
- Palette de couleurs sombre et mystique (violet, or, vert)
- Typographies personnalisées (Playfair Display, Manrope, JetBrains Mono)
- Composants réutilisables (Cartes, Navigation, etc.)
- Responsive design (Mobile-first)

✅ **Fonctionnalités**
- Navigation fluide entre pages
- Cartes avec images et statistiques
- Accordions interactifs pour les détails
- Navigation inférieure pour mobile
- Scroll horizontal pour les collections

## 🛠️ Installation & Démarrage

### 1. Installer les dépendances
```bash
npm install
```

### 2. Lancer le serveur de développement
```bash
npm run dev
```

L'application s'ouvrira automatiquement sur `http://localhost:3000`

### 3. Build pour la production
```bash
npm run build
```

## 📁 Structure du Projet

```
src/
├── components/
│   ├── Navigation.tsx      # TopAppBar & BottomNavBar
│   └── Card.tsx            # Composants de cartes
├── pages/
│   ├── HomePage.tsx        # Page d'accueil
│   ├── LibraryPage.tsx     # Grimoire/Bibliothèque
│   ├── DeckBuilderPage.tsx # Constructeur de decks
│   ├── CardDetailPage.tsx  # Détails d'une carte
│   └── MarketPage.tsx      # Marché
├── App.tsx                 # Routeur principal
├── main.tsx                # Point d'entrée
└── index.css               # Styles globaux

Configuration:
├── tailwind.config.js      # Configuration Tailwind
├── tsconfig.json           # Configuration TypeScript
├── vite.config.ts          # Configuration Vite
└── index.html              # HTML principal
```

## 🎨 Design System

### Couleurs
- **Surface sombre**: #131316
- **Primaire (violet)**: #ddb7ff
- **Secondaire (vert)**: #4edea3
- **Tertiaire (or)**: #e9c349
- **Erreur (rouge)**: #ffb4ab

### Typographies
- **Display**: Playfair Display 48px
- **Headline**: Playfair Display 32px
- **Titre**: Playfair Display 20px
- **Texte**: Manrope 16px
- **Label**: JetBrains Mono 12px

## 🔧 Technologies

- **React 18** - Framework UI
- **TypeScript** - Typage statique
- **Tailwind CSS 3** - Utilitaires CSS
- **Vite** - Build tool rapide
- **Material Symbols** - Icônes

## 📱 Responsive Design

L'application est optimisée pour:
- 📱 Mobiles (320px+)
- 📱 Tablettes (768px+)
- 💻 Desktop (1440px+)

Navigation mobile avec barre inférieure, navigation desktop avec header complet.

## 🚀 Fonctionnalités à Venir

- Persistance des données (localStorage/Firebase)
- Authentification utilisateur
- Animation des cartes
- Système de parties
- Leaderboard
- Notifications en temps réel

## 📝 Notes

Tous les designs proviennent du fichier `DESIGN.md` qui contient le système de design complet (Eldritch Archive theme).

Les images utilisées sont issues de Google Images avec descriptions détaillées pour GenAI.

---

**Créé avec ❤️ pour les collectionneurs d'Aether Grimoire**
