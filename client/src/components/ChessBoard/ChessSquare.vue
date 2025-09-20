<template>
  <div
    :class="['w-full aspect-square flex items-center justify-center cursor-pointer border border-gray-300', isBlack ? 'bg-black' : 'bg-white']"
    @click="$emit('click')"
  >
    <div class="w-1/2 h-1/2 flex items-center justify-center">
      <!-- Triangle pour triangles rouges ou bleus -->
      <svg v-if="piece === 'red_triangle' || piece === 'blue_triangle'" class="w-full h-full" viewBox="0 0 100 100">
        <polygon
          points="50,10 90,90 10,90"
          :fill="piece.startsWith('red') ? 'red' : 'blue'"
        />
      </svg>
      <!-- Carré pour tourelle rouge ou bleue -->
      <div v-else-if="piece === 'red_turret' || piece === 'blue_turret'" class="w-full h-full rounded" :style="{ backgroundColor: piece.startsWith('red') ? 'red' : 'blue' }"></div>
      <!-- Rond pour sniper rouge ou bleu -->
      <svg v-else-if="piece === 'red_sniper' || piece === 'blue_sniper'" class="w-full h-full" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="40"
          :fill="piece.startsWith('red') ? 'red' : 'blue'"
        />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChessSquare',
  props: {
    isBlack: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      required: true
    },
    piece: {
      type: String,
      default: null
    }
  },
  emits: ['click']
}
</script>