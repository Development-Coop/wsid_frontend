<template>
  <q-page>
    <div
      class="q-pa-md"
      style="position: sticky; top: 0; z-index: 100; background-color: #fff"
    >
      <q-tabs dense no-caps :narrow-indicator="false">
        <q-route-tab to="/app/dashboard" label="Trending" exact />
        <q-route-tab to="/app/dashboard/favourites" label="Favourites" exact />
        <q-route-tab to="/app/dashboard/following" label="Following" exact />
      </q-tabs>
    </div>
    <router-view />
  </q-page>
</template>

<script setup>
import { onMounted } from "vue";
import { useProfileStore } from "src/stores/profileStore";
import { useQuasar, Loading } from "quasar";

const $q = useQuasar();
const profileStore = useProfileStore();

const handleSubmit = async () => {
  Loading.show({
    message: "Loading...",
  });
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
</style>
