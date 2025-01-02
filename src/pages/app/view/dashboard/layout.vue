<template>
  <q-page>
    <!-- <div
      class="q-pa-md"
      style="position: sticky; top: 0; z-index: 100;"
    >
      <q-tabs dense no-caps :narrow-indicator="false">
        <q-route-tab to="/app/dashboard" label="Trending" exact />
        <q-route-tab to="/app/dashboard/favourites" label="Favourites" exact />
        <q-route-tab to="/app/dashboard/following" label="Following" exact />
      </q-tabs>
    </div> -->
    <router-view />
  </q-page>
</template>

<script setup></script>

<style scoped>
:deep(.q-tabs) {
  border-radius: 8px;
  .q-tab {
    background-color: #f2f2f7;
    width: 100%;
    &.q-tab--active {
      background-color: #000;
      color: #fff;
    }
  }
}
.logo-title {
  font-weight: 800;
  color: var(--q-primary);
}
</style>
