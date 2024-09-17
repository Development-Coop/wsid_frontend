<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer unelevated class="bg-white text-primary">
      <q-toolbar class="justify-around">
        <q-btn :ripple="false" unelevated flat round to="/app/dashboard">
          <q-icon v-if="$route.path.includes('/app/dashboard')" size="27px" name="img:src/assets/icons/nav-home-active.svg" />
          <q-icon v-else size="27px" name="img:src/assets/icons/nav-home.svg" />
        </q-btn>
        <q-btn :ripple="false" flat round to="/app/search">
          <q-icon v-if="$route.path === '/app/search'" size="22px" name="img:src/assets/icons/nav-search-active.svg" />
          <q-icon v-else size="22px" name="img:src/assets/icons/nav-search.svg" />
        </q-btn>
        <q-btn :ripple="false" flat round to="/app/create" class="create-btn">
          <q-icon size="32px" name="img:src/assets/icons/nav-create.svg" />
        </q-btn>
        <q-btn :ripple="false" flat round to="/app/profile">
          <q-icon v-if="$route.path === '/app/profile'" size="24px" name="img:src/assets/icons/nav-user-active.svg" />
          <q-icon v-else size="24px" name="img:src/assets/icons/nav-user.svg" />
        </q-btn>
        <q-btn :ripple="false" flat round to="/app/trending">
          <q-icon v-if="$route.path === '/app/trending'" size="24px" name="img:src/assets/icons/nav-trending-up-active.svg" />
          <q-icon v-else size="24px" name="img:src/assets/icons/nav-trending-up.svg" />
        </q-btn>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>
  
  <script setup>
  defineOptions({
    name: "AppDashboardLayout",
  });
  </script>
  
  <style scoped>
  .q-page-container {
    max-width: 767px;
    margin: 0 auto;
  }
  .q-footer {
    border-top: 1px solid #e0e0e0;
    .q-toolbar {
        max-width: 767px;
        margin: 0 auto;
        min-height: 67px;
        .create-btn{
            background-color: #FF5732;
            height: 65px;
            width: 65px;
            border-radius: 100%;
            margin-top: -40px;
        }
    }
  }
  </style>
  