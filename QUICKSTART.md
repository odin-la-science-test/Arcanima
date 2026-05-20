# Aether Grimoire - Guide de Démarrage Rapide

## ⚡ Démarrage en 2 minutes

### Windows PowerShell

```powershell
# 1. Ouvrir le dossier du projet
cd "C:\Users\fcb1909-user\Desktop\jeux collection cartes arcanima téléphone"

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur dev
npm run dev

# L'app s'ouvre automatiquement à http://localhost:3000 ✨
```

### Mac/Linux

```bash
cd ~/Desktop/"jeux collection cartes arcanima téléphone"
npm install
npm run dev
```

## 📂 Fichiers Créés

### Configuration de Projet
- ✅ `package.json` - Dépendances npm
- ✅ `tsconfig.json` - Configuration TypeScript
- ✅ `vite.config.ts` - Configuration Vite
- ✅ `tailwind.config.js` - Thème Tailwind
- ✅ `index.html` - HTML principal

### Code Source (src/)
- ✅ `main.tsx` - Point d'entrée React
- ✅ `App.tsx` - Routeur principal avec navigation
- ✅ `index.css` - Styles globaux

### Composants (src/components/)
- ✅ `Navigation.tsx` - TopAppBar + BottomNavBar
- ✅ `Card.tsx` - Composant Carte + GridCard

### Pages (src/pages/)
- ✅ `HomePage.tsx` - Page d'accueil
- ✅ `LibraryPage.tsx` - Bibliothèque de cartes
- ✅ `DeckBuilderPage.tsx` - Constructeur de deck
- ✅ `CardDetailPage.tsx` - Détails d'une carte
- ✅ `MarketPage.tsx` - Marché/Boutique

## 🎮 Navigation

- **Home** → Page d'accueil avec cartes en vedette
- **Library** → Toutes les cartes avec filtrage
- **Decks** → Créer et gérer des decks
- **Market** → Acheter des packs et essence
- **Clic sur une carte** → Voir les détails

## 🎨 Thème

Le design utilise le système de design **Eldritch Archive** avec:
- Couleurs sombres et mystiques
- Palette: Violet (#ddb7ff), Or (#e9c349), Vert (#4edea3)
- Typographies: Playfair Display, Manrope, JetBrains Mono
- Responsive & Mobile-first

## ✨ Fonctionnalités

✅ Navigation fluide entre pages  
✅ Cartes avec images Google Images  
✅ Accordions interactifs  
✅ BottomNavBar pour mobile  
✅ Système de design complet  
✅ Tailwind CSS pour les styles  
✅ TypeScript pour la sécurité des types  

## 🐛 Troubleshooting

**Port 3000 déjà utilisé?**
```bash
npm run dev -- --port 3001
```

**Erreur npm?**
```bash
rm -r node_modules package-lock.json
npm install
```

**Build pour production:**
```bash
npm run build
npm run preview
```

---

C'est tout! Le projet est prêt à être développé! 🚀
