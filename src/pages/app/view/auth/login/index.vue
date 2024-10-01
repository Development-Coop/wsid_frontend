<template>
  <q-page class="q-pa-lg">
    <q-btn
      dense
      no-caps
      block
      unelevated
      class="justify-self-start align-self-start"
      style="border-radius: 0px"
      :to="{ path: '/app/auth' }"
    >
      <q-icon v-motion-pop-visible :delay="300" size="24px">
        <img src="~src/assets/icons/arrow-left.svg" alt="logo" />
      </q-icon>
    </q-btn>
    <div>
      <div>
        <h4 class="text-h5 text text-weight-medium q-mb-xl">
          To get started, first enter <br />
          your phone, email, or <br />
          @username
        </h4>

        <q-form class="q-gutter-md">
          <q-input
            v-model="authStore.userDetails.phone_or_email"
            outlined
            placeholder="Phone, email or @username"
            :error="!!authStore.errors.phone_or_email"
            :error-message="authStore.errors.phone_or_email"
          />
        </q-form>
      </div>

      <!-- Button container with center alignment -->
      <div class="flex justify-between items-center">
        <RouterLink to="/app/auth/forgot-password">
          <p class="text-body2">Forgot password?</p>
        </RouterLink>
        <q-btn
          v-motion-pop
          class="q-px-xl"
          no-caps
          block
          unelevated
          color="primary"
          label="Next"
          @click="handleSubmit"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/authstore";

const router = useRouter();
const authStore = useAuthStore();

const handleSubmit = () => {
  authStore.clearErrors();
  if (authStore.userDetails.phone_or_email.trim()) {
    router.push({
      name: "enter-password",
      query: { contactDetail: authStore.userDetails.phone_or_email.trim() },
    });
  } else {
    authStore.errors.phone_or_email =
      "Phone number, email, or username is required.";
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
