<template>
  <div class="navbar">
    <button :class="{ active: selectedTab === 'Boutique' }" @click="select('Boutique')">💎</button>
    <button :class="{ active: selectedTab === 'Collection' }" @click="select('Collection')">📦</button>
    <button :class="{ active: selectedTab === 'Jouer' }" @click="select('Jouer')">⚔️</button>
    <button :class="{ active: selectedTab === 'Social' }" @click="select('Social')">💬</button>
    <button :class="{ active: selectedTab === 'Classement' }" @click="select('Classement')">👑</button>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  props: ["selectedTab"],
  methods: {
    select(tab) {
      this.$emit('select', tab);
    }
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 64px;
  background: #181c24;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 100;
  box-shadow: 0 -2px 8px #0002;
}

.navbar button {
  background: none;
  border: none;
  color: #fff;
  font-size: 2rem;
  flex: 1 1 0;
  height: 100%;
  transition: background 0.2s, color 0.2s, border-radius 0.2s;
  border-radius: 1.5rem;
  outline: none;
  margin: 0 0.2rem;
  box-shadow: none;
}

.navbar button.active {
  background: #ffb300;
  color: #222;
  font-weight: bold;
  box-shadow: 0 2px 8px #0001;
}

.navbar button.play {
  font-size: 2.3rem;
}

@media (max-width: 600px) {
  .navbar {
    height: 56px;
  }
  .navbar button {
    font-size: 1.5rem;
  }
  .navbar button.play {
    font-size: 1.8rem;
  }
}
</style>