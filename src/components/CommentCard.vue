<template>
  <div class="card">
    <img :src="imageSrc" alt="profile" />
    <p class="no-margin q-pr-md">{{ text }}</p>
  </div>
</template>

<script setup>
defineProps({
  imageSrc: {
    type: String,
    default: "https://example.com/default-image.jpg",
  },
  text: {
    type: String,
    default: "Default text",
  },
});
</script>

<style scoped lang="scss">
.card {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: flex-start;
  background-color: #fff;
  border-radius: 4px;
  padding: 16px;
  // width: 430px;
  // height: 76px;
  overflow: hidden;
  box-shadow: 0px 4px 4px 0px #00000040;
  img {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
  }
}
</style>
