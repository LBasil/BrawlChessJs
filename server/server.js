const express = require('express');
const cors = require('cors');

/**
 * Crée l'application Express avec son propre état de partie.
 * `random` est injectable pour rendre le comportement de l'IA reproductible dans les tests.
 */
function createApp({ random = Math.random } = {}) {
  const app = express();
  // Middleware pour parser le JSON et activer CORS
  app.use(express.json());
  app.use(cors());

  // État de la partie : plateau vide, un deck par joueur, le joueur 1 commence.
  let piecePositions = {};
  let player1Deck;
  let player2Deck;
  let currentTurn;

  const newDeck = () => ({
    turret: { type: 'turret', name: 'Tourelle', hp: 100, damage: 20, quantity: 1 },
    sniper: { type: 'sniper', name: 'Sniper', hp: 50, damage: 30, quantity: 3 }
  });

  function resetGame() {
    piecePositions = {};
    player1Deck = newDeck();
    player2Deck = newDeck();
    currentTurn = 'player1';
  }
  resetGame();

  // Fonction pour l'IA (player2) : placer une pièce ou bouger une pièce
  function aiAction() {
    // Vérifier si l'IA peut placer une pièce
    const availableCards = Object.keys(player2Deck).filter(type => player2Deck[type].quantity > 0);
    const possiblePlacementIndices = Array.from({ length: 24 }, (_, i) => i).filter(i => !piecePositions[i]);
    let placed = false;

    if (availableCards.length > 0 && possiblePlacementIndices.length > 0) {
      const cardType = availableCards[Math.floor(random() * availableCards.length)];
      const toIndex = possiblePlacementIndices[Math.floor(random() * possiblePlacementIndices.length)];
      piecePositions[toIndex] = `red_${cardType}`;
      player2Deck[cardType].quantity -= 1;
      placed = true;
    }

    // Si pas de placement ou après placement, tenter un déplacement
    if (!placed || random() < 0.5) { // 50% de chance de tenter un déplacement
      const movablePieces = Object.entries(piecePositions)
        .filter(([_, piece]) => piece && piece.startsWith('red_') && !piece.endsWith('_turret'))
        .map(([index]) => parseInt(index));
      if (movablePieces.length > 0) {
        const fromIndex = movablePieces[Math.floor(random() * movablePieces.length)];
        const possibleMoveIndices = Array.from({ length: 64 }, (_, i) => i)
          .filter(i => !piecePositions[i] && (piecePositions[fromIndex].endsWith('_sniper') ? Math.floor(fromIndex / 8) === Math.floor(i / 8) : true));
        if (possibleMoveIndices.length > 0) {
          const toIndex = possibleMoveIndices[Math.floor(random() * possibleMoveIndices.length)];
          piecePositions = {
            ...piecePositions,
            [fromIndex]: null,
            [toIndex]: piecePositions[fromIndex]
          };
        }
      }
    }
  }

  // POST : Recommencer une partie
  app.post('/reset', (req, res) => {
    resetGame();
    res.json({ piecePositions, player1Deck, player2Deck, currentTurn });
  });

  // GET : Récupérer l'état du plateau et les decks
  app.get('/board', (req, res) => {
    res.json({ piecePositions, player1Deck, player2Deck, currentTurn });
  });

  // POST : Déplacer une pièce
  app.post('/move', (req, res) => {
    const { fromIndex, toIndex } = req.body;

    if (currentTurn !== 'player1') {
      return res.status(400).json({ error: 'Ce n\'est pas votre tour' });
    }

    if (!Number.isInteger(fromIndex) || !Number.isInteger(toIndex)) {
      return res.status(400).json({ error: 'Les indices doivent être des entiers' });
    }
    if (fromIndex < 0 || fromIndex > 63 || toIndex < 0 || toIndex > 63) {
      return res.status(400).json({ error: 'Indices hors du plateau' });
    }
    if (!piecePositions[fromIndex] || !piecePositions[fromIndex].startsWith('blue_') || piecePositions[fromIndex].endsWith('_turret')) {
      return res.status(400).json({ error: 'La case source doit contenir une pièce bleue mobile (tourelle immobile)' });
    }
    if (piecePositions[toIndex]) {
      return res.status(400).json({ error: 'La case cible doit être vide' });
    }

    if (piecePositions[fromIndex].endsWith('_sniper')) {
      const fromRow = Math.floor(fromIndex / 8);
      const toRow = Math.floor(toIndex / 8);
      if (fromRow !== toRow) {
        return res.status(400).json({ error: 'Le sniper ne peut se déplacer que sur la même ligne' });
      }
    }

    piecePositions = {
      ...piecePositions,
      [fromIndex]: null,
      [toIndex]: piecePositions[fromIndex]
    };

    // Passer au tour de l'ennemi
    currentTurn = 'player2';
    // Action IA
    aiAction();
    // Retourner au tour du joueur 1
    currentTurn = 'player1';

    res.json({ message: 'Déplacement effectué', piecePositions, player2Deck, currentTurn });
  });

  // POST : Placer une pièce depuis une carte pour le joueur 1 (bleu)
  app.post('/place-player1', (req, res) => {
    const { cardType, toIndex } = req.body;

    if (currentTurn !== 'player1') {
      return res.status(400).json({ error: 'Ce n\'est pas votre tour' });
    }

    if (!['turret', 'sniper'].includes(cardType)) {
      return res.status(400).json({ error: 'Type de carte invalide' });
    }
    if (!Number.isInteger(toIndex) || toIndex < 40 || toIndex > 63) {
      return res.status(400).json({ error: 'Le placement doit être sur les trois dernières lignes (indices 40-63)' });
    }
    if (piecePositions[toIndex]) {
      return res.status(400).json({ error: 'La case cible doit être vide' });
    }
    if (player1Deck[cardType].quantity <= 0) {
      return res.status(400).json({ error: 'Plus de cartes disponibles pour ce type' });
    }

    piecePositions = {
      ...piecePositions,
      [toIndex]: `blue_${cardType}`
    };
    player1Deck[cardType].quantity -= 1;

    // Passer au tour de l'ennemi
    currentTurn = 'player2';
    // Action IA
    aiAction();
    // Retourner au tour du joueur 1
    currentTurn = 'player1';

    res.json({ message: 'Placement effectué', piecePositions, player1Deck, player2Deck, currentTurn });
  });

  // POST : Placer une pièce depuis une carte pour l'adversaire (rouge) - non utilisé pour le moment
  app.post('/place-player2', (req, res) => {
    const { cardType, toIndex } = req.body;

    if (currentTurn !== 'player2') {
      return res.status(400).json({ error: 'Ce n\'est pas le tour de l\'ennemi' });
    }

    if (!['turret', 'sniper'].includes(cardType)) {
      return res.status(400).json({ error: 'Type de carte invalide' });
    }
    if (!Number.isInteger(toIndex) || toIndex < 0 || toIndex > 23) {
      return res.status(400).json({ error: 'Le placement doit être sur les trois premières lignes (indices 0-23)' });
    }
    if (piecePositions[toIndex]) {
      return res.status(400).json({ error: 'La case cible doit être vide' });
    }
    if (player2Deck[cardType].quantity <= 0) {
      return res.status(400).json({ error: 'Plus de cartes disponibles pour ce type' });
    }

    piecePositions = {
      ...piecePositions,
      [toIndex]: `red_${cardType}`
    };
    player2Deck[cardType].quantity -= 1;

    res.json({ message: 'Placement effectué', piecePositions, player2Deck, currentTurn });
  });


  return app;
}

if (require.main === module) {
  const port = process.env.PORT || 3000;
  createApp().listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
  });
}

module.exports = { createApp };
