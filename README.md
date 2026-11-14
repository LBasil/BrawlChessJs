# Brawl Chess (version JavaScript)

Prototype de jeu de combat d'échecs sur un plateau 8x8 : le joueur (bleu) affronte une IA simple (rouge). Client en Vue.js (`client/`), serveur Node.js + Express (`server/`). Il n'y a pas encore de mode multijoueur.

## Lancer

```bash
cd server && npm install && npm start
cd client && npm install && npm run serve
```

Le serveur écoute sur http://localhost:3000 (variable `PORT` pour changer).

## API du serveur

| Route | Rôle |
| --- | --- |
| `GET /board` | plateau, decks et joueur courant |
| `POST /place-player1` | pose une carte (`cardType` : `turret` ou `sniper`, `toIndex` : 40 à 63) |
| `POST /move` | déplace une pièce bleue mobile (`fromIndex`, `toIndex`) ; le sniper reste sur sa ligne, la tourelle ne bouge pas |
| `POST /reset` | recommence la partie |

Après chaque action du joueur, l'IA joue (pose ou déplace une pièce rouge). Les entrées invalides renvoient une erreur 400 avec un message.

## Tests

```bash
cd server && npm test
```

Les tests lancent le serveur sur un port libre et appellent l'API : placements, déplacements, refus (zone interdite, case occupée, indice non entier), limite des decks et réinitialisation. L'IA reçoit un générateur aléatoire fixe pour que les parties soient reproductibles.

Le prototype d'origine (Love2D) est dans [Brawl-Chess](https://github.com/LBasil/Brawl-Chess).
