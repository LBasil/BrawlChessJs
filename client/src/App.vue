<template>
  <div class="flex flex-col justify-center items-center min-h-screen bg-gray-100">
    <ChessBoard
      :piecePositions="piecePositions"
      @square-click="handleSquareClick"
    />
    <div class="flex mt-4 space-x-4">
      <div
        v-for="(card, idx) in deck"
        :key="idx"
        class="w-32 h-48 bg-white border-2 border-red-500 rounded-lg flex flex-col items-center justify-center p-2"
      >
        <div class="text-lg font-bold">{{ card.name }}</div>
        <div class="text-sm">HP: {{ card.hp }}</div>
        <div class="text-sm">Dégâts: {{ card.damage }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import ChessBoard from './components/ChessBoard/ChessBoard.vue';

export default {
  name: 'App',
  components: {
    ChessBoard
  },
  data() {
    return {
      selectedSquare: null,
      piecePositions: {},
      deck: []
    };
  },
  methods: {
    async handleSquareClick(index) {
      // Si aucune case n'est sélectionnée et la case cliquée a un triangle ou sniper bleu
      if (this.selectedSquare === null && this.piecePositions[index]?.startsWith('blue_')) {
        this.selectedSquare = index;
      }
      // Si une case est sélectionnée et la case cliquée est vide
      else if (this.selectedSquare !== null && !this.piecePositions[index]) {
        try {
          const response = await fetch('http://localhost:3000/move', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fromIndex: this.selectedSquare, toIndex: index })
          });
          const data = await response.json();
          if (response.ok) {
            this.piecePositions = data.piecePositions;
            this.selectedSquare = null;
          } else {
            console.error(data.error);
            this.selectedSquare = null;
          }
        } catch (error) {
          console.error('Erreur lors du déplacement:', error);
          this.selectedSquare = null;
        }
      }
      // Réinitialiser si la case cliquée n'est pas valide
      else {
        this.selectedSquare = null;
      }
    },
    async fetchBoardState() {
      try {
        const response = await fetch('http://localhost:3000/board');
        const data = await response.json();
        this.piecePositions = data.piecePositions;
        this.deck = data.deck;
      } catch (error) {
        console.error('Erreur lors de la récupération du plateau:', error);
      }
    }
  },
  mounted() {
    // Charger l'état initial du plateau et le deck
    this.fetchBoardState();
  }
}
</script>