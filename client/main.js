// Vue App Setup
const app = new Vue({
    el: '#app',
    data: {
        socket: null,
        gameId: null,
        board: Array(8).fill().map(() => Array(8).fill(null)), // 8x8 empty board
        playerPawns: [], // Player's pawns (mock)
        opponentPawns: [], // Opponent's pawns (mock)
        currentTurn: 'player', // Mock turn
        selectedTab: 'Jouer' // Default to Jouer
    },
    created() {
        this.socket = io('http://localhost:3000'); // Connect to server WS
        this.socket.on('move', (data) => console.log('Move received:', data));
        this.socket.on('turn', (data) => this.currentTurn = data.turn);
        this.socket.on('victory', () => alert('Victory!'));
        this.socket.on('defeat', () => alert('Defeat!'));
        console.log('Board initialized:', this.board); // Debug board structure
    },
    methods: {
        startGame() {
            console.log('Game started'); // Debug start
            fetch('http://localhost:3000/start')
                .then(res => res.json())
                .then(data => {
                    this.gameId = data.gameId;
                    this.loadState();
                    // Mock initial pawns (but board starts empty; add logic to place after battle)
                });
        },
        loadState() {
            fetch(`http://localhost:3000/state?gameId=${this.gameId}`)
                .then(res => res.json())
                .then(data => {
                    this.board = data.board;
                    if (data.allEnemiesEliminated || data.mainPawnDefeated) {
                        this.socket.emit('victory');
                    }
                });
        },
        makeMove(fromRow, fromCol, toRow, toCol) {
            fetch('http://localhost:3000/move', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gameId: this.gameId, from: { row: fromRow, col: fromCol }, to: { row: toRow, col: toCol } })
            }).then(() => {
                this.socket.emit('move', { from: { row: fromRow, col: fromCol }, to: { row: toRow, col: toCol } });
                this.loadState();
            });
        },
        drawPawn() {
            const newPawn = { type: 'newPawn', hp: 8, passive: 'speed', active: 'dash', special: 'evade' };
            this.playerPawns.push(newPawn);
            const emptyCol = this.board[6].findIndex(cell => !cell);
            if (emptyCol !== -1) this.board[6][emptyCol] = newPawn;
        },
        handleCellClick(row, col) {
            if (this.board[row][col] && this.currentTurn === 'player') {
                const toCol = col + 1;
                if (toCol < 8 && !this.board[row][toCol]) {
                    this.makeMove(row, col, row, toCol);
                }
            }
        },
        selectTab(tab) {
            this.selectedTab = tab;
        }
    },
    template: `
        <div>
            <div class="header">
                <div class="avatar">🐼</div>
                <div class="xp-bar"><div class="xp-progress"></div></div>
                <div class="coin">💰 1000</div>
                <div class="gem">💎 50</div>
            </div>
            <div class="content">
                <div v-if="selectedTab === 'Jouer'" class="board-container">
                    <div class="board">
                        <div v-for="(row, rowIndex) in board" :key="rowIndex" class="row">
                            <div v-for="(cell, colIndex) in row" :key="colIndex"
                                :class="['cell', (rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark']"
                                @click="handleCellClick(rowIndex, colIndex)">
                                <div v-if="cell" class="pawn">{{ cell.type }} (HP: {{ cell.hp }})</div>
                            </div>
                        </div>
                    </div>
                <button class="battle-button" @click="startGame">Battle</button>
            </div>
                <div v-else style="display: flex; align-items: center; justify-content: center; font-size: clamp(1.5rem, 6vw, 3rem); color: white;">
                    {{ selectedTab }}
                </div>
            </div>
            <div class="navbar">
                <button :class="{ active: selectedTab === 'Boutique' }" @click="selectTab('Boutique')">💎</button>
                <button :class="{ active: selectedTab === 'Collection' }" @click="selectTab('Collection')">📦</button>
                <button class="play" :class="{ active: selectedTab === 'Jouer' }" @click="selectTab('Jouer')">⚔️</button>
                <button :class="{ active: selectedTab === 'Social' }" @click="selectTab('Social')">💬</button>
                <button :class="{ active: selectedTab === 'Classement' }" @click="selectTab('Classement')">👑</button>
            </div>
        </div>
    `
});