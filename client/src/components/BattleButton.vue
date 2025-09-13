<template>
  <button class="battle-button" @click="onClick">Battle</button>
</template>

<script>
export default {
  name: "BattleButton",
  props: ["onClick"]
}
</script>

<style scoped>
.battle-button {
  display: block;
  margin: 2rem auto 0 auto;
  padding: 1rem 2.5rem;
  font-size: 1.5rem;
  background: #ffb300;
  color: #222;
  border: none;
  border-radius: 2rem;
  font-weight: bold;
  box-shadow: 0 2px 8px #0002;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  width: 70vw;
  max-width: 320px;
  letter-spacing: 0.05em;
}

.battle-button:hover,
.battle-button:focus {
  background: #ffd54f;
  color: #181c24;
}

@media (max-width: 600px) {
  .battle-button {
    font-size: 1.1rem;
    padding: 0.7rem 1.2rem;
    width: 90vw;
    max-width: 98vw;
  }
}
</style>