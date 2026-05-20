import { useState, useEffect, useCallback } from 'react';
import { CARDS_DATABASE, CardData } from '../data/cards';

export interface ActiveCard extends CardData {
  currentHealth: number;
  isEngaged: boolean;
  canAttack: boolean;
  instanceId: string;
}

export interface CombatLogEntry {
  turn: number;
  message: string;
  type: 'attack' | 'death' | 'play' | 'draw' | 'ai' | 'info';
}

export interface PlayerState {
  health: number;
  energy: number;
  maxEnergy: number;
  deck: CardData[];
  hand: CardData[];
  board: (ActiveCard | null)[];
  discard: CardData[];
  limbo: CardData[];
  god: CardData | null;
  terrain: CardData | null;
}

const shuffle = <T,>(array: T[]): T[] => {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const toActiveCard = (card: CardData, prefix = ''): ActiveCard => ({
  ...card,
  instanceId: `${prefix}${card.id}-${Date.now()}-${Math.random()}`,
  currentHealth: card.def,
  isEngaged: false,
  canAttack: false,
});

const initialPlayerState = (): PlayerState => ({
  health: 1200,
  energy: 1,
  maxEnergy: 1,
  deck: [],
  hand: [],
  board: [null, null, null, null, null],
  discard: [],
  limbo: [],
  god: null,
  terrain: null,
});

const buildDeck = (): CardData[] => {
  const savedDeck = localStorage.getItem('arcanima_deck');
  let cards: CardData[] = [];
  if (savedDeck) {
    try {
      const parsed = JSON.parse(savedDeck) as { id: string; count: number }[];
      parsed.forEach(item => {
        const base = CARDS_DATABASE.find(c => c.id === item.id);
        if (base) {
          for (let i = 0; i < item.count; i++) {
            cards.push({ ...base, id: `${base.id}-${i}-${Date.now()}-${Math.random()}` });
          }
        }
      });
    } catch { /* ignore */ }
  }
  if (cards.length === 0) {
    cards = CARDS_DATABASE.slice(0, 15).flatMap(c => [
      { ...c, id: `${c.id}-0` },
      { ...c, id: `${c.id}-1` },
    ]);
  }
  return cards;
};

const buildAIDeck = (): CardData[] => {
  const pool = [...CARDS_DATABASE].filter(c => c.rarity !== 'mythic');
  const picked = shuffle(pool).slice(0, 20);
  return picked.flatMap(c => [
    { ...c, id: `ai-${c.id}-0-${Date.now()}` },
    { ...c, id: `ai-${c.id}-1-${Date.now()}` },
  ]);
};

export const useGameEngine = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [turn, setTurn] = useState(1);
  const [activePlayer, setActivePlayer] = useState<'player' | 'opponent'>('player');
  const [player, setPlayer] = useState<PlayerState>(initialPlayerState());
  const [opponent, setOpponent] = useState<PlayerState>(initialPlayerState());
  const [combatLog, setCombatLog] = useState<CombatLogEntry[]>([]);

  const addLog = (message: string, type: CombatLogEntry['type'], currentTurn?: number) => {
    setCombatLog(prev => [{ turn: currentTurn ?? 1, message, type }, ...prev].slice(0, 50));
  };

  const initGame = useCallback(() => {
    const playerDeck = shuffle(buildDeck());
    const playerHand = playerDeck.splice(0, 7);

    const aiDeck = shuffle(buildAIDeck());
    const aiHand = aiDeck.splice(0, 7);

    setPlayer({ ...initialPlayerState(), deck: playerDeck, hand: playerHand });
    setOpponent({ ...initialPlayerState(), deck: aiDeck, hand: aiHand });
    setTurn(1);
    setActivePlayer('player');
    setCombatLog([{ turn: 1, message: 'La bataille commence ! Bonne chance !', type: 'info' }]);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) initGame();
  }, [isInitialized, initGame]);

  const restart = useCallback(() => {
    setIsInitialized(false);
  }, []);

  const playCard = useCallback((cardIndex: number, playerType: 'player' | 'opponent') => {
    const setState = playerType === 'player' ? setPlayer : setOpponent;

    setState(prev => {
      const card = prev.hand[cardIndex];
      if (!card || prev.energy < card.cost) return prev;

      const slot = prev.board.findIndex(s => s === null);
      if (slot === -1) return prev;

      const active = toActiveCard(card, playerType === 'opponent' ? 'ai-' : '');
      const newHand = [...prev.hand];
      newHand.splice(cardIndex, 1);
      const newBoard = [...prev.board];
      newBoard[slot] = active;

      if (playerType === 'player') {
        addLog(`Vous jouez "${card.title}" (coût ${card.cost})`, 'play', turn);
      }

      return { ...prev, energy: prev.energy - card.cost, hand: newHand, board: newBoard };
    });
  }, [turn]);

  const attack = useCallback((attackerSlot: number, targetType: 'card' | 'god', targetSlot?: number) => {
    if (activePlayer !== 'player') return false;

    setPlayer(prevPlayer => {
      const attacker = prevPlayer.board[attackerSlot];
      if (!attacker || attacker.isEngaged || !attacker.canAttack) return prevPlayer;

      if (targetType === 'god') {
        addLog(`"${attacker.title}" attaque le Dieu adverse pour ${attacker.atk} dégâts !`, 'attack', turn);
        setOpponent(prev => ({ ...prev, health: Math.max(0, prev.health - attacker.atk) }));
        const newBoard = [...prevPlayer.board];
        newBoard[attackerSlot] = { ...attacker, isEngaged: true };
        return { ...prevPlayer, board: newBoard };
      }

      if (targetType === 'card' && targetSlot !== undefined) {
        let result = prevPlayer;
        setOpponent(prevOpp => {
          const defender = prevOpp.board[targetSlot];
          if (!defender) return prevOpp;

          addLog(`"${attacker.title}" (${attacker.atk} ATK) attaque "${defender.title}" (${defender.currentHealth} PV)`, 'attack', turn);

          const defNewHP = defender.currentHealth - attacker.atk;
          const atkNewHP = attacker.currentHealth - defender.atk;

          const newOppBoard = [...prevOpp.board];
          const newOppDiscard = [...prevOpp.discard];
          if (defNewHP <= 0) {
            newOppBoard[targetSlot] = null;
            newOppDiscard.push(defender);
            addLog(`"${defender.title}" est détruit(e) !`, 'death', turn);
          } else {
            newOppBoard[targetSlot] = { ...defender, currentHealth: defNewHP };
          }

          // Update player board inside opponent setter
          const newPlrBoard = [...prevPlayer.board];
          const newPlrDiscard = [...prevPlayer.discard];
          if (atkNewHP <= 0) {
            newPlrBoard[attackerSlot] = null;
            newPlrDiscard.push(attacker);
            addLog(`"${attacker.title}" est détruit(e) en combat !`, 'death', turn);
          } else {
            newPlrBoard[attackerSlot] = { ...attacker, currentHealth: atkNewHP, isEngaged: true };
          }
          result = { ...prevPlayer, board: newPlrBoard, discard: newPlrDiscard };

          return { ...prevOpp, board: newOppBoard, discard: newOppDiscard };
        });

        // We can't use 'result' here because setOpponent is async; 
        // instead we recalculate the attacker's new state
        const defender_snapshot = opponent.board[targetSlot];
        if (!defender_snapshot) return prevPlayer;
        const atkNewHP = attacker.currentHealth - defender_snapshot.atk;
        const newPlrBoard = [...prevPlayer.board];
        const newPlrDiscard = [...prevPlayer.discard];
        if (atkNewHP <= 0) {
          newPlrBoard[attackerSlot] = null;
          newPlrDiscard.push(attacker);
        } else {
          newPlrBoard[attackerSlot] = { ...attacker, currentHealth: atkNewHP, isEngaged: true };
        }
        return { ...prevPlayer, board: newPlrBoard, discard: newPlrDiscard };
      }

      return prevPlayer;
    });

    return true;
  }, [activePlayer, opponent, turn]);

  const prepareTurn = (state: PlayerState): PlayerState => ({
    ...state,
    board: state.board.map(c => c ? { ...c, isEngaged: false, canAttack: true } : null),
  });

  const endTurn = useCallback(() => {
    if (activePlayer !== 'player') return;
    setActivePlayer('opponent');
    addLog('Vous passez votre tour.', 'info', turn);

    // AI turn (runs synchronously on state)
    setTimeout(() => {
      setOpponent(prev => {
        let state = prepareTurn(prev);

        // Draw
        const newDeck = [...state.deck];
        const newHand = [...state.hand];
        if (newDeck.length > 0) {
          const drawn = newDeck.shift()!;
          newHand.push(drawn);
        }

        const nextMax = Math.min(state.maxEnergy + 1, 10);
        let energy = nextMax;
        const newBoard = [...state.board];

        // Play cards
        for (let i = newHand.length - 1; i >= 0; i--) {
          const c = newHand[i];
          if (energy >= c.cost) {
            const slot = newBoard.findIndex(s => s === null);
            if (slot !== -1) {
              newBoard[slot] = toActiveCard(c, 'ai-');
              energy -= c.cost;
              newHand.splice(i, 1);
              addLog(`L'adversaire joue "${c.title}"`, 'ai', turn);
            }
          }
        }

        return { ...state, deck: newDeck, hand: newHand, energy, maxEnergy: nextMax, board: newBoard };
      });

      // AI attacks
      setTimeout(() => {
        setOpponent(opp => {
          setPlayer(plr => {
            let newOppBoard = [...opp.board];
            let newOppDiscard = [...opp.discard];
            let newPlrBoard = [...plr.board];
            let newPlrDiscard = [...plr.discard];
            let plrHealth = plr.health;

            newOppBoard = newOppBoard.map((aiCard, ai_i) => {
              if (!aiCard || !aiCard.canAttack || aiCard.isEngaged) return aiCard;

              const targetI = newPlrBoard.findIndex(c => c !== null);
              if (targetI !== -1) {
                const target = newPlrBoard[targetI]!;
                addLog(`L'adversaire attaque "${target.title}" avec "${aiCard.title}"`, 'ai', turn);
                const tNewHP = target.currentHealth - aiCard.atk;
                const aNewHP = aiCard.currentHealth - target.atk;

                if (tNewHP <= 0) { newPlrBoard[targetI] = null; newPlrDiscard.push(target); addLog(`"${target.title}" est détruit(e) !`, 'death', turn); }
                else newPlrBoard[targetI] = { ...target, currentHealth: tNewHP };

                if (aNewHP <= 0) { newOppBoard[ai_i] = null; newOppDiscard.push(aiCard); return null; }
                return { ...aiCard, currentHealth: aNewHP, isEngaged: true };
              } else {
                plrHealth = Math.max(0, plrHealth - aiCard.atk);
                addLog(`L'adversaire attaque votre Dieu pour ${aiCard.atk} dégâts !`, 'ai', turn);
                return { ...aiCard, isEngaged: true };
              }
            });

            return { ...plr, board: newPlrBoard, health: plrHealth, discard: newPlrDiscard };
          });
          return { ...opp, board: newOppBoard, discard: newOppDiscard };
        });

        // Start player's next turn
        setTimeout(() => {
          setTurn(t => {
            const nextTurn = t + 1;
            addLog(`--- Tour ${nextTurn} — Votre tour ---`, 'info', nextTurn);
            return nextTurn;
          });
          setPlayer(prev => {
            const state = prepareTurn(prev);
            const newDeck = [...state.deck];
            const newHand = [...state.hand];
            if (newDeck.length > 0) {
              const drawn = newDeck.shift()!;
              newHand.push(drawn);
              addLog(`Vous piochez une carte.`, 'draw', turn + 1);
            }
            const nextMax = Math.min(state.maxEnergy + 1, 10);
            return { ...state, deck: newDeck, hand: newHand, energy: nextMax, maxEnergy: nextMax };
          });
          setActivePlayer('player');
        }, 800);
      }, 800);
    }, 600);
  }, [activePlayer, turn]);

  return { isInitialized, turn, activePlayer, player, opponent, combatLog, playCard, attack, endTurn, restart };
};
