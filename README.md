# Brawl Chess

A mobile multiplayer chess-like game inspired by Clash Royale. Client in JavaScript (Vue.js) and server in Node.js for local testing.

## Installation and Setup

All commands to execute for first installation:

1. Navigate to the server directory:
   cd server

2. Install dependencies:
   npm install

3. Start the server in development mode:
   npm run dev

4. Open the client in a browser (served by the server):
   http://localhost:3000

## Testing

- HTTP routes:
  - GET /ping → "pong"
  - GET /start → Initializes a mock game (returns game ID)
  - POST /move → Send a move (body: { gameId, from, to }) → Mock response
  - GET /state?gameId=<id> → Current mock board state

- WebSocket: Connect to ws://localhost:3000 (handled via Socket.io)
  - Events: 'move', 'turn', 'victory', 'defeat'

## Development Notes

- Client is mobile-first (portrait mode CSS).
- Server runs on http://localhost:3000.
- Customize assets in client/assets/.
- Expand game logic in server/game/mockGame.js.