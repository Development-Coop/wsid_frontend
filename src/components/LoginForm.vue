<template>
  <div class="login-container">
    <form @submit.prevent="handleSubmit">
      <div class="input-group">
        <p>Email Id</p>
        <q-input
          v-model="authStore.userDetails.phone_or_email"
          outlined
          label="Email or @username"
          dense
          :rules="[(val) => !!val || 'Email is required']"
        />
      </div>

      <div class="input-group">
        <div class="label-container">
          <p>Password</p>
          <span
            class="cursor-pointer"
            @click="router.push({ name: 'web-forgot-password' })"
          >
            Forgot Password?
          </span>
        </div>
        <q-input
          v-model="authStore.userDetails.password"
          type="password"
          outlined
          label="Enter Password"
          dense
          :rules="[(val) => !!val || 'Password is required']"
        />
      </div>

      <div class="button-container">
        <q-btn
          type="submit"
          block
          label="Login"
          color="primary"
          unelevated
          class="login-btn"
          :loading="loading"
        />
      </div>
    </form>

    <q-dialog v-model="showError">
      <q-card>
        <q-card-section>
          <div class="text-h6">Error</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ authStore.errors.login }}
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup flat label="OK" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "src/stores/authstore";
import { useQuasar } from "quasar";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const loading = ref(false);
const showError = ref(false);
const $q = useQuasar();

onMounted(() => {
  const params = route?.query?.expired?.trim().toLowerCase();
  if (params === "true") {
    $q.notify({
      color: "negative",
      message: "Session is expired! Please login to continue.",
      position: "top",
      icon: "error",
      autoClose: true,
    });
  }
});

const handleSubmit = async () => {
  loading.value = true;
  authStore.clearErrors();
  try {
    await authStore.login();
    const redirectTo = router.currentRoute.value.query.redirectTo || {
      name: "web-dashboard-trending",
    };
    // Redirect to the specified path or default to the dashboard
    router.push(redirectTo);
  } catch (error) {
    $q.notify({
      color: "negative",
      message:
        error.response?.data?.message || "Login failed. Please try again.",
      position: "top",
      icon: "error",
      autoClose: true,
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  max-width: 400px;
  margin: auto;
  padding-top: 2rem;
  display: grid;
  grid-gap: 32px;
  form {
    display: grid;
    grid-gap: 28px;
  }
  .input-group {
    display: grid;
    grid-gap: 8px;
    p {
      font-size: 16px;
      font-weight: 500;
    }
    .label-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        color: #9c9aa5;
        font-weight: 400;
        font-size: 12px;
        text-decoration: underline;
      }
    }
  }
  .button-container {
    :deep(.q-btn__content) {
      text-transform: none;
    }
  }
}

:deep(.q-field__bottom) {
  display: none;
}
:deep(.q-field--with-bottom) {
  padding-bottom: 0;
}
.q-input input {
  font-size: 16px;
}

.forgot-password-btn {
  font-size: 14px;
  color: #999;
  text-decoration: underline;
}

.login-btn {
  font-size: 16px;
  background-color: $primary;
  color: white;
  width: 100%;
}

.divider {
  text-align: center;
  position: relative;
  border: 0.6px solid rgba(156, 154, 165, 0.3);
  &-color {
    color: rgba(156, 154, 165, 0.3);
    font-size: 12px;
  }
  &-section {
    width: 50%;
    margin: auto;
    padding: 30px 0;
  }
}

.divider .q-separator {
  width: 50%;
  margin: auto;
}

.social-login {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  place-items: center;
  :deep(.q-btn--outline)::before {
    border: none;
  }
}

.social-btn {
  width: 112px;
  height: 48px;
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid rgba(70, 95, 241, 0.4);
}
</style>
