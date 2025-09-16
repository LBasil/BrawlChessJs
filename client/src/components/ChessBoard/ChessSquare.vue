<template>
  <div
    :class="['w-full aspect-square flex items-center justify-center cursor-pointer border border-gray-300', isBlack ? 'bg-black' : 'bg-white']"
    @click="$emit('click')"
  >
    <div class="w-1/2 h-1/2 flex items-center justify-center">
      <svg v-if="triangleColor" class="w-full h-full" viewBox="0 0 100 100">
        <polygon
          points="50,10 90,90 10,90"
          :fill="triangleColor"
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
    triangleColor: {
      type: String,
      default: null
    }
  },
  emits: ['click']
}
</script>