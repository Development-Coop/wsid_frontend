<template>
  <div class="vote-card">
    <div class="vote-content">
      <span class="vote-text">{{ votes }} Votes ({{ percentage }}%)</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  votes: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
});
</script>

<style scoped lang="scss">
.vote-card {
  width: 430px;
  height: 76px;
  background-color: #f3f3f3;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 150px;
    height: 60px;
    border-radius: 30px;
  }

  .vote-content {
    display: flex;
    align-items: center;
    justify-content: center;

    .vote-text {
      font-weight: 600;
      font-size: 18px;
      color: #333;
      text-align: center;

      @media (max-width: 768px) {
        font-size: 12px;
      }
    }
  }
}
</style>