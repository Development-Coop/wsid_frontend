<template>
  <section class="home">
    <section class="home-banner__left">
      <Header />
      <div>pending</div>
    </section>
    <section class="home-banner__right"></section>
  </section>
</template>

<script setup>
import Header from "../../components/Header.vue"
defineOptions({
  name: "IndexPage",
});
</script>

<style scoped lang="scss">
.home {
  display: grid;
  grid-template-columns: 60% 1fr;
  grid-gap: 32px;
  &-banner__right {
    background-color: $primary;
  }
}
</style>