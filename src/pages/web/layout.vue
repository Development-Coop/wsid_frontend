<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          v-if="$q.screen.lt.sm"
          dense
          flat
          round
          icon="menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <div class="text-h5 text-weight-bold cursor-pointer" @click="router.push({name: 'web-dashboard-home'})">WSID</div>
        </q-toolbar-title>
        <q-btn
          dense
          flat
          round
          icon="search"
          to="/web/dashboard/search"
        />
        <q-btn
          v-if="$q.screen.lt.sm"
          dense
          flat
          round
          icon="menu"
          @click="toggleRightDrawer"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :width="320"
      show-if-above
      side="left"
      bordered
      class="side-bar-section"
    >
      <div class="q-pa-lg">
        <p class="text-body1 text-weight-bold">Welcome to What Should I Do?</p>
        <p class="text-grey-7">
          Whether you have a burning question, need advice, or just want to
          spark interesting conversations, post your questions, and get
          real-time answers from diverse perspectives.
        </p>
      </div>

      <q-toolbar class="q-px-none">
        <q-btn
          class="w-full"
          unelevated
          no-caps
          flat
          round
          to="/web/dashboard/home"
          :class="$route.path.includes('/dashboard/home') && 'is-active'"
        >
          <div class="flex items-center w-full q-px-lg">
            <q-icon v-if="$route.path.includes('/dashboard/home')" size="27px">
              <img src="~src/assets/icons/nav-home-active.svg" alt="" />
            </q-icon>
            <q-icon v-else size="27px">
              <img src="~src/assets/icons/nav-home.svg" alt="" />
            </q-icon>
            <span class="q-ml-md">Home</span>
          </div>
        </q-btn>
        <q-btn
          class="w-full"
          unelevated
          no-caps
          flat
          round
          to="/web/dashboard/search"
          :class="$route.path.includes('/search') && 'is-active'"
        >
          <div class="flex items-center w-full q-px-lg">
            <q-icon v-if="$route.path.includes('/dashboard/search')" size="24px">
              <img src="~src/assets/icons/nav-search-active.svg" alt="" />
            </q-icon>
            <q-icon v-else size="24px">
              <img src="~src/assets/icons/nav-search.svg" alt="" />
            </q-icon>
            <span class="q-ml-md">Search</span>
          </div>
        </q-btn>

        <q-btn
          class="w-full"
          unelevated
          no-caps
          flat
          round
          to="/web/dashboard/profile"
          :class="$route.path.includes('/profile') && 'is-active'"
        >
          <div class="flex items-center w-full q-px-lg">
            <q-icon v-if="$route.path === '/web/dashboard/profile'" size="24px">
              <img src="~src/assets/icons/nav-user-active.svg" alt="" />
            </q-icon>
            <q-icon v-else size="24px">
              <img src="~src/assets/icons/nav-user.svg" alt="" />
            </q-icon>
            <span class="q-ml-md">Profile</span>
          </div>
        </q-btn>

        <q-btn
          class="w-full"
          unelevated
          no-caps
          flat
          round
          to="/web/settings"
          :class="$route.path.includes('/settings') && 'is-active'"
        >
          <div class="flex items-center w-full q-px-lg">
            <q-icon v-if="$route.path === '/web/settings'" size="24px">
              <img src="~src/assets/icons/settings-active.svg" alt="" />
            </q-icon>
            <q-icon v-else size="24px">
              <img src="~src/assets/icons/settings.svg" alt="" />
            </q-icon>
            <span class="q-ml-md">Setting</span>
          </div>
        </q-btn>
      </q-toolbar>

      <!-- <div
        class="q-px-lg q-py-sm favourites q-gutter-md q-mt-md"
        style="border-top: 1px solid #f1f2f5"
      >
        <p class="text-body1 text-weight-bold q-mb-lg">Favourites</p>
        <div
          v-for="i in 3"
          :key="i"
          class="flex no-wrap items-center profile-wrapper"
        >
          <q-img
            class="profile-img"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwme89cM8YZvHcybGrZl_Obd9U9p5QabozJQ&s"
          />
          <div>
            <p class="text-weight-medium text-body1">Alex Doe</p>
          </div>
        </div>
      </div> -->

      <div class="q-pa-lg q-mt-md footer-section" style="border-top: 1px solid #f1f2f5">
        <p class="text-grey-7 footer-links">
          <a
            class="footer-link"
            @click="router.push({ name: 'privacy-policy' })"
          >
            Privacy Policy
          </a>
          •
          <a
            class="footer-link"
            @click="router.push({ name: 'terms-conditions' })"
          >
            Terms and Conditions
          </a>
          •
          <a class="footer-link" @click="router.push({ name: 'about-us' })">
            About Us
          </a>
          <span class="footer-copyright"> | WSID@{{ currentYear }} </span>
        </p>
      </div>
    </q-drawer>

    <q-drawer
      v-if="$route.path.includes('/dashboard/home')"
      v-model="rightDrawerOpen"
      show-if-above
      side="right"
      width="320"
      bordered
    >
      <div class="q-pt-md q-px-md flex" style="position: sticky;top: 0;background: white;z-index: 2;justify-content: space-between;">
        <div class="flex" style="gap: 8px;">
          <img src="~src/assets/icons/nav-trending-up-active.svg" alt="" />
          <div class="text-body1 text-weight-bold">TOP IN TRENDING</div>
        </div>
        <p class="see-all" @click="router.push({path:'/web/dashboard/trending'})">See All</p>
      </div>
      <trending :is-popup="true" />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useProfileStore } from "src/stores/profileStore";
import { useQuasar, Loading } from "quasar";
import { useRouter } from "vue-router";
import trending from "./dashboard/trending.vue";

const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);
const $q = useQuasar();
const profileStore = useProfileStore();
const router = useRouter();
const currentYear = ref(new Date().getFullYear());

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

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value;
};
</script>

<style scoped>
.q-layout {
  background-color: #f1f2f5;
  .q-toolbar {
    min-height: 62px;
  }
  :deep(.q-drawer) {
    .q-toolbar {
      flex-direction: column;
      .q-btn {
        border-radius: 0;
        min-height: 50px;
        border: 1px solid transparent;
        &.is-active {
          border: 1px solid var(--q-primary);
          color: var(--q-primary);
          background-color: #f1f2f5;
        }
      }
    }
  }
}
.profile-wrapper {
  gap: 12px;
  .profile-img {
    flex-shrink: 0;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #000;
  }
}
.post-wrapper {
  display: grid;
  gap: 26px;
}
.footer-section {
  align-self: flex-end;
}
.footer-links {
  font-size: 14px;
  justify-content: center;
  text-align: center;
}
:deep(.q-drawer__content) {
  display: grid;
  grid-template-rows: max-content;
}

.footer-link {
  text-decoration: none; /* Remove underline */
  cursor: pointer;
}

.footer-link:hover {
  text-decoration: underline; /* Add underline on hover */
}

.footer-copyright {
  font-weight: bold;
}

:deep(.q-drawer--right) {
  right: 10px;
  top: 75px !important;
  border-radius: 8px;
}
:deep(.q-drawer__content) {
  border-radius: 8px;
}
.see-all {
  cursor: pointer;
  text-decoration: underline;
}
</style>
