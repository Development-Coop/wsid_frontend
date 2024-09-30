<template>
  <q-page class="q-pa-lg">
    <q-btn
      dense
      no-caps
      block
      unelevated
      class="justify-self-start align-self-start"
      style="border-radius: 0px"
      :to="{ name: 'login' }"
    >
      <q-icon v-motion-pop-visible :delay="300" size="24px">
        <img src="~src/assets/icons/arrow-left.svg" alt="logo" />
      </q-icon>
    </q-btn>
    <div>
      <div>
        <h4 class="text-h5 text-center text-weight-medium q-mb-xl">
          Enter your password
        </h4>
    
        <q-form class="q-gutter-md" @submit.prevent="handleSubmit">
          <q-input
            v-model="authStore.userDetails.phone_or_email"
            outlined
            label="Phone, email or @username"
            :error="!!errors.phone_or_email"
            :rules="[(val) => !!val || 'Email is required']"
          />
          <q-input
            v-model="authStore.userDetails.password"
            type="password"
            outlined
            label="Password"
            :error="!!errors.password"
            :rules="[(val) => !!val || 'Password is required']"
          />
          <div class="q-mt-xl q-pt-lg">
            <q-btn
              v-motion-pop
              no-caps
              block
              unelevated
              color="primary"
              label="Login"
              class="w-full q-mb-md"
              type="submit"
              :loading="loading"
            />
            <RouterLink class="text-center q-mt-lg" to="/app/auth/forgot-password">
              <p class="text-body2 text-weight-medium">Forgot password?</p>
            </RouterLink>
          </div>
        </q-form>
      </div>
    </div>

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
  </q-page>
</template>
    
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/authstore";

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const showError = ref(false);
const errors = ref({
  phone_or_email: "",
  password: "",
});

const handleSubmit = async () => {
  loading.value = true;
  authStore.clearErrors();
  try {
    const result = await authStore.login();
    console.log(result);
    // Handle successful login here, e.g., redirect to dashboard
    router.push({ name: 'dashboard' });
  } catch (error) {
    showError.value = true;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.q-page {
  display: grid;
  grid-template-rows: 80px 1fr;
  & > div {
    &:nth-child(2) {
      display: grid;
      grid-template-rows: 1fr auto;
      gap: 40px;
    }
  }
  :deep(.q-form) {
    /* Override dashed border for readonly q-inputs with outlined style */
    .q-field--outlined.q-field--readonly .q-field__control:before {
      border-style: solid !important; /* Force solid border */
      border-width: 1px !important; /* Adjust thickness to match other inputs */
      border-color: rgba(
        0,
        0,
        0,
        0.24
      ) !important; /* Adjust color to match theme */
    }
    .q-field__bottom {
      display: none;
    }
    .q-field--with-bottom {
      padding-bottom: 0;
    }
  }
}
</style>
