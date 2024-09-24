<template>
  <section class="login">
    <div class="q-pa-md">
      <q-tabs
        v-model="selectedTab"
        class="rounded-tabs"
        active-color="white"
        align="center"
        dense
      >
        <q-tab name="signup" label="Sign Up" class="signup-tab" />
        <q-tab name="login" label="Login" class="login-tab" />
      </q-tabs>

      <q-tab-panels v-model="selectedTab" animated>
        <q-tab-panel name="signup">
          <SignUp />
        </q-tab-panel>
        <q-tab-panel name="login">
          <LoginForm />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import LoginForm from "../../components/LoginForm.vue";
import SignUp from "./SignUp.vue";

const route = useRoute();
const selectedTab = ref("login");

onMounted(() => {
  const tab = route?.query?.tab;
  if (tab) selectedTab.value = tab;
});
</script>

<style scoped lang="scss">
.login {
  display: grid;
  place-items: center;
  place-content: center;
  align-content: flex-start;
  .q-tabs {
    background-color: #fef2f2; // Light pink background
    border-radius: 8px; // Rounded corners for the tab container
    padding: 5px;

    .q-tab {
      width: 175px;
      height: 35px;
      text-transform: none;
      :deep(.q-tab__content .q-tab__label) {
        font-size: 16px;
        font-weight: 500;
      }
      &.q-tab--active {
        background-color: black; // Black background for the active tab
        color: white; // White text for the active tab
        border-radius: 8px; // Rounded corners for the active tab
      }

      &:not(.q-tab--active) {
        background-color: transparent;
        color: #aaa; // Greyed-out color for inactive tabs
      }
    }
  }

  .signup-tab {
    color: #aaa; // Initial color for the inactive "Sign Up" tab
  }

  .login-tab {
    // Styles for the active "Login" tab
    background-color: black; // Black background
    border-radius: 15px; // Rounded corners
    color: white; // White text
  }
  :deep(.q-tab-panel) {
    padding: 0;
  }
}
</style>
