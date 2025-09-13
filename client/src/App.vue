<template>
  <div>
    <HeaderBar />
    <div class="content">
      <div v-if="selectedTab === 'Jouer'">
        <ChessBoard :board="board" :onCellClick="handleCellClick" />
        <BattleButton :onClick="startGame" />
      </div>
      <div v-else style="display: flex; align-items: center; justify-content: center; font-size: clamp(1.5rem, 6vw, 3rem); color: white;">
        {{ selectedTab }}
      </div>
    </div>
    <NavBar :selectedTab="selectedTab" @select="selectTab" />
  </div>
</template>

<script>
import io from 'socket.io-client'
import HeaderBar from './components/HeaderBar.vue'
import ChessBoard from './components/ChessBoard.vue'
import BattleButton from './components/BattleButton.vue'
import NavBar from './components/NavBar.vue'

export default {
  name: "App",
  components: { HeaderBar, ChessBoard, BattleButton, NavBar },
  data() {
    return {
      socket: null,
      gameId: null,
      board: Array(8).fill().map(() => Array(8).fill(null)),
      playerPawns: [],
      opponentPawns: [],
      currentTurn: 'player',
      selectedTab: 'Jouer'
    }
  },
  created() {
    this.socket = io('http://localhost:3000');
    this.socket.on('move', (data) => console.log('Move received:', data));
    this.socket.on('turn', (data) => this.currentTurn = data.turn);
    this.socket.on('victory', () => alert('Victory!'));
    this.socket.on('defeat', () => alert('Defeat!'));
  },
  methods: {
    startGame() {
      fetch('http://localhost:3000/start')
        .then(res => res.json())
        .then(data => {
          this.gameId = data.gameId;
          this.loadState();
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
  }
}
</script>

<style>
body {
  background: #1e2a44; /* Bleu foncé, modifie selon ta préférence */
  min-height: 100vh;
  margin: 0;
  font-family: 'Segoe UI', Arial, sans-serif;
}
#app {
  min-height: 100vh;
  background: transparent;
}
</style>