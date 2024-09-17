<template>
  <q-page class="q-pa-lg">
    <q-tabs dense no-caps :narrow-indicator="false">
      <q-route-tab
        to="/app/dashboard"
        label="Trending"
        exact
      />
      <q-route-tab
        to="/app/dashboard/favourites"
        label="Favourites"
        exact
      />
      <q-route-tab
        to="/app/dashboard/following"
        label="Following"
        exact
      />
    </q-tabs>
    <div class="q-pt-md">
      <router-view />
    </div>
  </q-page>
</template>

<style scoped>
:deep(.q-tabs){
  border-radius: 8px;
  .q-tab{
    background-color: #F2F2F7;
    width: 100%;
    &.q-tab--active{
      background-color: #000;
      color: #fff;
    }
  }
}
</style>
