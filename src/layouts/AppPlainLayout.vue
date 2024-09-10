<template>
  <router-view />
</template>

<script setup>
defineOptions({
  name: "AppPlainLayout",
});
</script>

<style scoped>
.q-page-container {
  max-width: 767px;
  margin: 0 auto;
}
</style>
