const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware pour parser le JSON et activer CORS
app.use(express.json());
app.use(cors());

// État initial du plateau
let piecePositions = {
  // Triangles rouges sur la première ligne (0-5), sniper rouge à 6, tourelle rouge à 7
  ...Object.fromEntries(Array.from({ length: 6 }, (_, i) => [i, 'red_triangle'])),
  6: 'red_sniper',
  7: 'red_turret',
  // Triangles bleus sur la dernière ligne (56-61), sniper bleu à 62, tourelle bleue à 63
  ...Object.fromEntries(Array.from({ length: 6 }, (_, i) => [56 + i, 'blue_triangle'])),
  62: 'blue_sniper',
  63: 'blue_turret'
};

// GET : Récupérer l'état du plateau
app.get('/board', (req, res) => {
  res.json(piecePositions);
});

// POST : Déplacer un triangle ou un sniper
app.post('/move', (req, res) => {
  const { fromIndex, toIndex } = req.body;

  // Vérifications de base
  if (typeof fromIndex !== 'number' || typeof toIndex !== 'number') {
    return res.status(400).json({ error: 'Les indices doivent être des nombres' });
  }
  if (fromIndex < 0 || fromIndex > 63 || toIndex < 0 || toIndex > 63) {
    return res.status(400).json({ error: 'Indices hors du plateau' });
  }
  if (!piecePositions[fromIndex] || piecePositions[fromIndex].endsWith('_turret')) {
    return res.status(400).json({ error: 'La case source doit contenir un triangle ou un sniper (tourelle immobile)' });
  }
  if (piecePositions[toIndex]) {
    return res.status(400).json({ error: 'La case cible doit être vide' });
  }

  // Vérification pour les snipers : déplacement uniquement sur la même ligne
  if (piecePositions[fromIndex].endsWith('_sniper')) {
    const fromRow = Math.floor(fromIndex / 8);
    const toRow = Math.floor(toIndex / 8);
    if (fromRow !== toRow) {
      return res.status(400).json({ error: 'Le sniper ne peut se déplacer que sur la même ligne' });
    }
  }

  // Mettre à jour l'état du plateau
  piecePositions = {
    ...piecePositions,
    [fromIndex]: null,
    [toIndex]: piecePositions[fromIndex]
  };

  res.json({ message: 'Déplacement effectué', piecePositions });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});