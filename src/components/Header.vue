<template>
  <header class="q-pa-md">
    <div class="row items-center justify-between">
      <div class="row items-center">
        <q-btn
          v-if="isMobile"
          flat
          round
          dense
          icon="menu"
          aria-label="Menu"
          @click="drawerLeft = !drawerLeft"
        />
        <q-drawer v-model="drawerLeft" side="left" :width="200" elevated>
          <q-scroll-area class="fit">
            <div class="q-pa-sm side-bar">
              <ul class="q-pl-none q-m-none">
                <li v-for="item in navItems" :key="item.name">
                  <router-link :to="item.path">{{ item.name }}</router-link>
                </li>
              </ul>
            </div>
          </q-scroll-area>
        </q-drawer>
        <img
          src="../assets/logo.svg"
          class="logo-img cursor-pointer"
          alt="logo"
          @click="router.push('/')"
        />
        <p class="no-margin cursor-pointer" @click="router.push('/')">WSID</p>
      </div>
      <nav v-if="!isMobile">
        <ul class="row q-pl-none q-m-none web-view">
          <li v-for="item in navItems" :key="item.name">
            <router-link :to="item.path">{{ item.name }}</router-link>
          </li>
        </ul>
      </nav>
      <button class="button">
        <a href="mailto:admin@wsid.com">Contact</a>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const $q = useQuasar();
const router = useRouter();
const drawerLeft = ref(false);

var navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about-us" },
  { name: "Login", path: "/auth/web-login?tab=login" },
  { name: "Register", path: "/auth/web-login?tab=signup" },
];

const isMobile = computed(() => $q.screen.width < 700);

if (isMobile.value) {
  navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about-us" },
    { name: "Login", path: "/app/auth?tab=login" },
    { name: "Register", path: "/auth/auth?tab=signup" },
  ];
}
</script>

<style scoped lang="scss">
header {
  div {
    display: flex; /* Ensure flex layout for gap to work */
    gap: 4px;

    img {
      width: 20px;
      height: 20px;
    }

    p {
      font-weight: 800;
      font-size: 18px;
    }
  }

  ul {
    display: grid; /* Flex layout for horizontal alignment */
    list-style: none;
    grid-gap: 12px; /* Spacing between list items */
    font-size: 16px;
    font-weight: 500;
    padding: 0; /* Ensure no padding on the ul */
    margin: 0; /* Ensure no margin on the ul */

    &.web-view {
      display: flex;
      gap: 40px;
    }

    li {
      cursor: pointer;

      a {
        text-decoration: none;
        color: #4a4848;

        &:hover {
          color: $primary;
        }

        &.router-link-active {
          font-weight: 700;
          color: $primary;
        }
      }
    }
  }

  .button {
    background-color: #ff573212; /* Semi-transparent background color */
    color: $primary;
    padding: 6px 16px;
    font-size: 14px;
    font-weight: 500;
    min-width: 114px;
    border: none; /* Ensure no border */
    border-radius: 8px; /* Add border-radius for better appearance */
    cursor: pointer;
    transition: background-color 0.3s ease; /* Smooth transition on hover */

    &:hover {
      background-color: darken(#ff573212, 10%); /* Darken on hover */
    }
  }

  .side-bar {
    padding: 24px 32px;
    ul {
      grid-gap: 24px;
    }
  }
}
</style>
