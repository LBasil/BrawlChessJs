<template>
  <div class="flex flex-col justify-center items-center min-h-screen bg-gray-100">
    <!-- Cartes de l'adversaire (rouge) affichées de dos au-dessus -->
    <div class="flex mb-4 space-x-4">
      <div
        v-for="card in filteredEnemyDeck"
        :key="card.type"
        class="w-32 h-48 bg-gray-400 border-2 border-red-500 rounded-lg flex items-center justify-center p-2"
      >
        <div class="text-sm">Restant: {{ card.quantity }}</div>
      </div>
    </div>
    <ChessBoard
      :piecePositions="piecePositions"
      @square-click="handleSquareClick"
    />
    <!-- Cartes du joueur 1 (bleu) -->
    <div class="flex mt-4 space-x-4">
      <div
        v-for="card in filteredDeck"
        :key="card.type"
        :class="['w-32 h-48 bg-white border-2 rounded-lg flex flex-col items-center justify-center p-2 cursor-pointer', selectedCard === card.type ? 'border-blue-500' : 'border-red-500']"
        @click="selectCard(card.type)"
      >
        <div class="text-lg font-bold">{{ card.name }}</div>
        <div class="text-sm">HP: {{ card.hp }}</div>
        <div class="text-sm">Dégâts: {{ card.damage }}</div>
        <div class="text-sm">Restant: {{ card.quantity }}</div>
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
      selectedCard: null,
      piecePositions: {},
      deck: {},
      enemyDeck: {}
    };
  },
  computed: {
    filteredDeck() {
      return Object.values(this.deck).filter(card => card.quantity > 0);
    },
    filteredEnemyDeck() {
      return Object.values(this.enemyDeck).filter(card => card.quantity > 0);
    }
  },
  methods: {
    selectCard(type) {
      this.selectedCard = this.selectedCard === type ? null : type;
      this.selectedSquare = null;
    },
    async handleSquareClick(index) {
      if (this.selectedCard && !this.piecePositions[index]) {
        try {
          const response = await fetch(`http://localhost:3000/place-player1`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cardType: this.selectedCard, toIndex: index })
          });
          const data = await response.json();
          if (response.ok) {
            this.piecePositions = data.piecePositions;
            this.deck = data.player1Deck;
            this.selectedCard = null;
          } else {
            console.error(data.error);
            this.selectedCard = null;
          }
        } catch (error) {
          console.error('Erreur lors du placement:', error);
          this.selectedCard = null;
        }
      } else if (this.selectedSquare === null && this.piecePositions[index]?.startsWith('blue_')) {
        this.selectedSquare = index;
      } else if (this.selectedSquare !== null && !this.piecePositions[index]) {
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
      } else {
        this.selectedSquare = null;
      }
    },
    async fetchBoardState() {
      try {
        const response = await fetch('http://localhost:3000/board');
        const data = await response.json();
        this.piecePositions = data.piecePositions;
        this.deck = data.player1Deck;
        this.enemyDeck = data.player2Deck;
      } catch (error) {
        console.error('Erreur lors de la récupération du plateau:', error);
      }
    }
  },
  mounted() {
    this.fetchBoardState();
  }
}
</script>