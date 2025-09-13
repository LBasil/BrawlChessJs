import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());

// Charge les pions depuis le fichier JSON
const pawns = JSON.parse(fs.readFileSync('./pawns.json', 'utf-8'));

function generatePlayerPawns(player) {
  return pawns.map(p => ({
    ...p,
    id: `${player}_${p.id}`,
    owner: player
  }));
}

app.post('/start', (req, res) => {
  const player1Pawns = generatePlayerPawns('player1');
  const player2Pawns = generatePlayerPawns('player2');
  console.log('Game started with pawns:', { player1Pawns, player2Pawns });

  res.json({
    status: 'ok',
    player1Pawns,
    player2Pawns
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});