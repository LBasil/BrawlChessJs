<template>
  <div class="grid grid-cols-8 gap-0 w-full max-w-[90vw] mx-auto">
    <ChessSquare
      v-for="(square, index) in 64"
      :key="index"
      :isBlack="(Math.floor(index / 8) + index) % 2 === 1"
      :index="index"
      :triangleColor="trianglePositions[index]"
      @click="$emit('square-click', index)"
    />
  </div>
</template>

<script>
import ChessSquare from './ChessSquare.vue';

export default {
  name: 'ChessBoard',
  components: {
    ChessSquare
  },
  props: {
    trianglePositions: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['square-click']
}
</script>