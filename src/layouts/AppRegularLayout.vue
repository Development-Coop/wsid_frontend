<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
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
