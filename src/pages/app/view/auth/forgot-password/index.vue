<template>
  <q-page class="q-pa-lg">
    <!-- Back Button at the top -->
    <q-btn
      dense
      no-caps
      block
      unelevated
      class="justify-self-start align-self-start"
      style="border-radius: 0px"
      @click="router.push({ name: 'login' })"
    >
      <q-icon v-motion-pop-visible :delay="300" size="24px">
        <img src="~src/assets/icons/arrow-left.svg" alt="logo" />
      </q-icon>
    </q-btn>

    <div>
      <div>
        <!-- Heading and instruction text -->
        <div class="text-center main-wrapper">
          <h4 class="text-h5 text-weight-medium">Forgot your password?</h4>
          <p>
            Please provide us with the email address associated with your
            account. We will sent an email to help you reset your password.
          </p>
        </div>

        <!-- Code Input Boxes (use q-input with narrow width or custom styling) -->
        <div>
          <q-input
            v-model="email"
            outlined
            placeholder="Email"
            :rules="[(val) => !!val || 'Email is required']"
          />
        </div>
      </div>
      <div class="button-container">
        <!-- Submit Button (initially disabled) -->
        <div>
          <q-btn
            v-motion-pop
            :delay="700"
            block
            label="Recover account"
            :color="isEmailValid && !isSubmitted ? 'primary' : 'grey'"
            unelevated
            :disable="!isEmailValid || isSubmitted"
            :loading="isLoading"
            @click="submitEmail"
          />
        </div>
      </div>
    </div>
  </q-page>
  <q-dialog v-model="isSubmitted" persistent>
    <q-card class="custom-card" style="max-width: 400px">
      <!-- Popup content -->
      <q-card-section>
        <div class="text-h6 text-center">Request sent.</div>
      </q-card-section>

      <q-card-section class="q-py-none text-center">
        <p>
          An email has been sent to your registered email address with
          instructions to help you recover your password. Please check your
          inbox and follow the provided steps to regain access to your account.
        </p>
      </q-card-section>

      <span class="divider-line"></span>

      <!-- OK button to close the popup -->
      <q-card-actions align="center">
        <p
          class="popup-btn"
          @click="
            router.push({ name: 'reset-password', query: { email: email } })
          "
        >
          OK
        </p>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from "vue";
// Helper
import { isValidEmail } from "src/utils/helper";

import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/authstore";
import { useQuasar } from "quasar";

const email = ref("");
const isSubmitted = ref(false);
const router = useRouter();
const authStore = useAuthStore();
const $q = useQuasar();
const isLoading = ref(false);

const isEmailValid = computed(() => {
  return isValidEmail(email.value);
});

const submitEmail = async () => {
  if (isEmailValid.value) {
    isLoading.value = true;
    try {
      isSubmitted.value = await authStore.forgotPassword(email.value);
      if (!isSubmitted.value) {
        throw new Error("Failed to send password reset email.");
      }
    } catch (error) {
      $q.notify({
        message: error.message || "Something went wrong!",
        color: "negative",
        position: "top",
        timeout: 3000,
        icon: "error",
      });
    } finally {
      isLoading.value = false;
    }
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
  .main-wrapper {
    position: relative;
    width: 100%;
    display: grid;
    grid-gap: 12px;
    margin-bottom: 24px;
    p {
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
    }
  }
  .button-container {
    display: grid;
    grid-gap: 24px;
    p {
      margin: 0;
      font-size: 16px;
    }
    button {
      width: 100%;
    }
    :deep(.q-btn__content) {
      color: #fff;
      text-transform: none;
      font-size: 18px;
    }
  }
  :deep(.q-field__control) {
    input {
      font-size: 16px;
    }
  }
}
.custom-card {
  border-radius: 24px;
  padding: 32px 0;
  .divider-line {
    border: 1px solid rgba(235, 235, 235, 1);
    display: grid;
    width: 100%;
    margin: 16px 0;
  }
  .popup-btn {
    color: rgba(35, 35, 35, 1);
    font-weight: 700;
    cursor: pointer;
    font-size: 16px;
  }
  :deep(.q-card__actions) {
    padding: 0;
  }
  :deep(.q-card__section--vert) {
    padding: 0 12px;
    margin-bottom: 24px;
    p {
      font-size: 16px;
    }
  }
}
</style>
