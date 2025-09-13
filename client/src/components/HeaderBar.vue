<template>
  <div class="header">
    <div class="avatar">🐼</div>
    <div class="xp-bar"><div class="xp-progress"></div></div>
    <div class="right">
      <div class="coin">💰 1000</div>
      <div class="gem">💎 50</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HeaderBar"
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 64px;
  background: #181c24;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 1.2rem;
  z-index: 101;
  box-shadow: 0 2px 8px #0002;
  min-width: 0;
  gap: 0.7rem;
}

.avatar {
  font-size: 2.2rem;
  background: #fff2cc;
  border-radius: 1.2rem;
  padding: 0.2rem 0.7rem;
  box-shadow: 0 2px 8px #0001;
  flex-shrink: 0;
}

.xp-bar {
  flex: 1 1 80px;
  min-width: 40px;
  max-width: 120px;
  height: 18px;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  background: #222;
  border-radius: 1rem;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
}

.xp-progress {
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg, #ffb300 60%, #ffd54f 100%);
  border-radius: 1rem 0 0 1rem;
  transition: width 0.3s;
}

.right {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  flex: 0 1 auto;
  min-width: 0;
}

.coin, .gem {
  font-size: 1.2rem;
  background: #23272f;
  border-radius: 1rem;
  padding: 0.2rem 0.7rem;
  color: #fff;
  display: flex;
  align-items: center;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 600px) {
  .header {
    height: 52px;
    padding: 0 0.5rem;
    gap: 0.3rem;
  }
  .avatar {
    font-size: 1.5rem;
    border-radius: 0.8rem;
    padding: 0.1rem 0.4rem;
  }
  .xp-bar {
    height: 12px;
    margin-left: 0.3rem;
    margin-right: 0.3rem;
    max-width: 60px;
  }
  .coin, .gem {
    font-size: 0.9rem;
    border-radius: 0.7rem;
    padding: 0.1rem 0.4rem;
  }
  .right {
    gap: 0.15rem;
  }
}
</style>