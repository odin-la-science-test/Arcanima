// Starter Deck - 60 cartes équilibrées pour commencer à jouer
// Composition : 30 types distincts x2 = 60 cartes
// Coût moyen visé : ~3.0

export interface DeckEntry {
  id: string;
  count: number;
}

export const STARTER_DECK: DeckEntry[] = [
  // === Coût 1 (8 cartes) ===
  { id: 'larve_sacree', count: 2 },         // 0 atk / 10 def
  { id: 'nymphe_protectrice', count: 2 },    // 5 atk / 20 def - guérison
  { id: 'hippocampe_cristal', count: 2 },    // 5 atk / 15 def - soin héros
  { id: 'colibri_mana', count: 2 },          // 5 atk / 10 def - réduction coût sort

  // === Coût 2 (14 cartes) ===
  { id: 'gorilla', count: 2 },               // 17 atk / 12 def - provocation
  { id: 'fourmi_eclaireuse', count: 2 },     // 20 atk / 15 def - célérité
  { id: 'faucon_Arcanima', count: 2 },         // 20 atk / 15 def - célérité
  { id: 'singe_eclaireur', count: 2 },       // 22 atk / 18 def - esquive
  { id: 'corbeau_spectral', count: 2 },      // 15 atk / 20 def - immunité sorts
  { id: 'poisson_lanterne', count: 2 },      // 10 atk / 25 def - -10 atk adverse
  { id: 'acide_formique', count: 2 },        // Sort - 30 dégâts

  // === Coût 3 (16 cartes) ===
  { id: 'fourmi_ouvriere_majeure', count: 2 }, // 25 atk / 40 def - fortification
  { id: 'marmouset_mystique', count: 2 },      // 15 atk / 25 def - soin
  { id: 'piquier_reine', count: 2 },           // 40 atk / 20 def - portée
  { id: 'pheromones_rage', count: 2 },         // Sort - +15 atk Formica
  { id: 'chouette_sagesse', count: 2 },        // 15 atk / 30 def - pioche
  { id: 'dome_reine', count: 2 },              // Terrain - +15 def Formica
  { id: 'tunnel_celeste', count: 2 },          // Sort - ignore provocation
  { id: 'murene_ombre', count: 2 },            // 30 atk / 20 def - poison

  // === Coût 4 (12 cartes) ===
  { id: 'fourmi_soldat_adulte', count: 2 },  // 40 atk / 35 def - morsure acide
  { id: 'guerrier_primate', count: 2 },      // 45 atk / 30 def - embuscade
  { id: 'myrmidon_fer', count: 2 },          // 35 atk / 60 def - immunités
  { id: 'aigle_foudre', count: 2 },          // 45 atk / 35 def - foudre divine
  { id: 'arachneen', count: 2 },             // 30 atk / 15 def - paralysie
  { id: 'general_colonie', count: 2 },       // 55 atk / 45 def - +10 atk Formica

  // === Coût 5 (8 cartes) ===
  { id: 'scarabee', count: 2 },              // 12 atk / 45 def - armure
  { id: 'gorille_combat', count: 2 },        // 60 atk / 50 def - provocation
  { id: 'requin_abyssal', count: 2 },        // 60 atk / 40 def - frénésie
  { id: 'formica_vanguard', count: 2 },      // 60 atk / 40 def - piétinement

  // === Coût 3+ Mythique / Puissants (2 cartes) ===
  { id: 'behemoth', count: 2 },              // 80 atk / 60 def - Frappe Sismique
]

// Nom du deck de base
export const STARTER_DECK_NAME = "Grimoire des Anciens"

export const STARTER_DECK_DESCRIPTION = "Un deck équilibré mêlant les forces de la forêt (Formica, Primates, Oiseaux) et de l'océan (Aquatiques). Idéal pour apprendre les mécaniques du jeu."
