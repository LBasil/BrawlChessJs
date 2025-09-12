// Mock game state (in-memory for local testing)
const games = {}; // { gameId: { board: 8x8 array, allEnemiesEliminated: bool, mainPawnDefeated: bool } }

function initGame() {
    const gameId = Date.now().toString();
    games[gameId] = {
        board: Array(8).fill().map(() => Array(8).fill(null)),
        allEnemiesEliminated: false,
        mainPawnDefeated: false
    };
    // Mock initial setup (player at row 6-7, opponent at 0-1)
    games[gameId].board[6][0] = { type: 'mainPawn', hp: 20, passive: 'kingShield', active: 'command', special: 'immortal' }; // Main pawn (king)
    games[gameId].board[0][0] = { type: 'oppMainPawn', hp: 20, passive: 'kingShield', active: 'command', special: 'immortal' };
    return gameId;
}

function makeMove(gameId, from, to) {
    if (games[gameId]) {
        const piece = games[gameId].board[from.row][from.col];
        if (piece) {
            games[gameId].board[to.row][to.col] = piece;
            games[gameId].board[from.row][from.col] = null;
            // Mock victory check
            if (to.row === 0 && to.col === 0) { // Attacked opp main
                games[gameId].mainPawnDefeated = true;
            }
        }
    }
}

function getState(gameId) {
    return games[gameId] || { board: [], allEnemiesEliminated: false, mainPawnDefeated: false };
}

module.exports = { initGame, makeMove, getState };