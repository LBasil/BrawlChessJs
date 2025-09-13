<template>
  <div class="board-container">
    <div class="board">
      <div v-for="(row, rowIndex) in board" :key="rowIndex" class="row">
        <div v-for="(cell, colIndex) in row" :key="colIndex"
          :class="['cell', (rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark']"
          @click="onCellClick(rowIndex, colIndex)">
          <div v-if="cell" class="pawn">{{ cell.type }} (HP: {{ cell.hp }})</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChessBoard",
  props: ["board", "onCellClick"]
}
</script>

<style scoped>
.board-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  margin-top: 80px; /* espace sous le header */
  margin-bottom: 80px; /* espace au-dessus de la navbar */
}

.board {
  display: grid;
  grid-template-rows: repeat(8, 1fr);
  grid-template-columns: repeat(8, 1fr);
  width: 90vw;
  max-width: 420px;
  aspect-ratio: 1 / 1;
  background: #222;
  border-radius: 1rem;
  box-shadow: 0 4px 24px #0003;
  overflow: hidden;
}

.cell {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(1rem, 3vw, 1.5rem);
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
}

.cell.light {
  background: #f5f5f5;
}

.cell.dark {
  background: #181c24;
}

.cell:hover {
  filter: brightness(1.15);
}

.pawn {
  font-weight: bold;
  color: #ffb300;
  text-shadow: 0 1px 2px #0008;
}

@media (max-width: 600px) {
  .board {
    width: 98vw;
    max-width: 98vw;
  }
  .board-container {
    margin-top: 60px;
    margin-bottom: 60px;
  }
}
</style>