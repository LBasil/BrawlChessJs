const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware pour parser le JSON et activer CORS
app.use(express.json());
app.use(cors());

// État initial du plateau
let trianglePositions = {
  // Triangles rouges sur la première ligne (0-7)
  ...Object.fromEntries(Array.from({ length: 8 }, (_, i) => [i, 'red'])),
  // Triangles bleus sur la dernière ligne (56-63)
  ...Object.fromEntries(Array.from({ length: 8 }, (_, i) => [56 + i, 'blue']))
};

// GET : Récupérer l'état du plateau
app.get('/board', (req, res) => {
  res.json(trianglePositions);
});

// POST : Déplacer un triangle bleu
app.post('/move', (req, res) => {
  const { fromIndex, toIndex } = req.body;

  // Vérifier si la requête est valide
  if (typeof fromIndex !== 'number' || typeof toIndex !== 'number') {
    return res.status(400).json({ error: 'Les indices doivent être des nombres' });
  }
  if (fromIndex < 0 || fromIndex > 63 || toIndex < 0 || toIndex > 63) {
    return res.status(400).json({ error: 'Indices hors du plateau' });
  }
  if (trianglePositions[fromIndex] !== 'blue') {
    return res.status(400).json({ error: 'La case source doit contenir un triangle bleu' });
  }
  if (trianglePositions[toIndex]) {
    return res.status(400).json({ error: 'La case cible doit être vide' });
  }

  // Mettre à jour l'état du plateau
  trianglePositions = {
    ...trianglePositions,
    [fromIndex]: null,
    [toIndex]: 'blue'
  };

  res.json({ message: 'Déplacement effectué', trianglePositions });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});