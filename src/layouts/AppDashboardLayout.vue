<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <div
        class="q-pa-md"
        style="position: sticky; top: 0; z-index: 100; background-color: #fff; box-shadow: 0px 1px 4px rgba(205, 207, 209, 0.5);"
      >
        <q-toolbar-title>
          <div class="text-h5 cursor-pointer logo-title" @click="router.push({name: 'following'})">WSID</div>
        </q-toolbar-title>
      </div>
      <router-view />
    </q-page-container>

    <q-footer unelevated class="bg-white text-primary">
      <q-toolbar class="justify-around">
        <q-btn unelevated flat round to="/app/dashboard">
          <q-icon v-if="$route.path.includes('/app/dashboard')" size="27px">
            <img src="~src/assets/icons/nav-home-active.svg" alt="" />
          </q-icon>
          <q-icon v-else size="27px">
            <img src="~src/assets/icons/nav-home.svg" alt="" />
          </q-icon>
        </q-btn>
        <q-btn flat round to="/app/search">
          <q-icon v-if="$route.path.includes('/app/search')" size="22px">
            <img src="~src/assets/icons/nav-search-active.svg" alt="" />
          </q-icon>
          <q-icon v-else size="22px">
            <img src="~src/assets/icons/nav-search.svg" alt="" />
          </q-icon>
        </q-btn>
        <q-btn flat round to="/app/ask-question" class="create-btn">
          <q-icon size="32px">
            <img src="~src/assets/icons/nav-create.svg" alt="" />
          </q-icon>
        </q-btn>
        <q-btn flat round to="/app/trending">
          <q-icon v-if="$route.path === '/app/trending'" size="24px">
            <img src="~src/assets/icons/nav-trending-up-active.svg" alt="" />
          </q-icon>
          <q-icon v-else size="24px">
            <img src="~src/assets/icons/nav-trending-up.svg" alt="" />
          </q-icon>
        </q-btn>
        <q-btn flat round to="/app/profile">
          <q-icon
            v-if="
              $route.path === '/app/profile' ||
                $route.path === '/app/profile/settings' ||
                $route.path === '/app/profile/edit-profile'
            "
            size="24px"
          >
            <img src="~src/assets/icons/nav-user-active.svg" alt="" />
          </q-icon>
          <q-icon v-else size="24px">
            <img src="~src/assets/icons/nav-user.svg" alt="" />
          </q-icon>
        </q-btn>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
defineOptions({
  name: "AppDashboardLayout",
});
import { onMounted } from "vue";
import { useProfileStore } from "src/stores/profileStore";
import { useQuasar, Loading } from "quasar";
import { useRouter } from "vue-router";

const $q = useQuasar();
const profileStore = useProfileStore();
const router = useRouter();

const handleSubmit = async () => {
  Loading.show();
  try {
    await profileStore.getProfileDetails();
  } catch (error) {
    $q.notify({
      color: "negative",
      message:
        error.response?.data?.message ||
        "Something went wrong!. Please try again.",
      position: "top",
      icon: "error",
      autoClose: true,
    });
  } finally {
    Loading.hide();
  }
};

onMounted(() => {
  handleSubmit();
});
</script>

<style scoped>
.q-page-container {
  max-width: 767px;
  /* margin: 0 auto; */
}
.q-footer {
  border-top: 1px solid #e0e0e0;
  .q-toolbar {
    max-width: 767px;
    margin: 0 auto;
    min-height: 67px;
    .create-btn {
      background-color: #ff5732;
      height: 65px;
      width: 65px;
      border-radius: 100%;
      margin-top: -40px;
    }
  }
}

.logo-title {
  font-weight: 800;
  color: var(--q-primary);
}
</style>
