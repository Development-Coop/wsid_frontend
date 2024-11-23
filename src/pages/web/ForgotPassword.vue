<template>
  <div class="fp-container">
    <h4>Forgot Password?</h4>
    <p class="instruction-text">
      Please provide us with the email address associated with your account. We
      will sent an email to help you reset your password.
    </p>
    <q-input
      v-model="email"
      outlined
      label="Email or @username"
      dense
      :rules="[(val) => !!val || 'Email is required']"
    />
    <div class="button-container">
      <q-btn
        block
        label="Recover account"
        :color="isEmailValid ? 'primary' : 'grey'"
        unelevated
        :disable="!isEmailValid"
        :class="{ 'btn-active': isEmailValid }"
        :loading="isLoading"
        @click="submitEmail"
      />
      <q-btn
        block
        label="Back"
        color="grey-3"
        unelevated
        @click="router.go(-1)"
      />
    </div>
    <!-- <div v-if="isSubmitted" class="notification-container">
      <p>Recovery Mail Sent</p>
      <span>An email has been sent to your registered email address with
        instructions to help you recover your password. Please check your inbox
        and follow the provided steps to regain access to your account.</span>
    </div> -->
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
            inbox and follow the provided steps to regain access to your
            account.
          </p>
        </q-card-section>

        <span class="divider-line"></span>

        <!-- OK button to close the popup -->
        <q-card-actions align="center">
          <p
            class="popup-btn"
            @click="
              router.push({ name: 'web-reset-password', query: { email: email } })
            "
          >
            OK
          </p>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
// Helper
import { isValidEmail } from "src/utils/helper";

import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/authstore";
import { useQuasar } from "quasar";

const email = ref("");
const router = useRouter();
const isSubmitted = ref(false);
const authStore = useAuthStore();
const $q = useQuasar();
const isLoading = ref(false);

const isEmailValid = computed(() => {
  return isValidEmail(email.value);
});

const submitEmail = async () => {
  if (isValidEmail) {
    isLoading.value = true;
    isSubmitted.value = await authStore.forgotPassword(email.value);
    isLoading.value = false;
    if (!isSubmitted.value) {
      $q.notify({
        message: "Something went wrong!",
        color: "negative", // You can use different colors like 'negative', 'warning', 'info'
        position: "top", // Position can be 'top', 'bottom', 'left', 'right'
        timeout: 3000, // Duration the toast will be visible, in milliseconds
        icon: "error", // Optional: adds an icon, Quasar icons or Material Icons can be used
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.fp-container {
  width: 40%;
  justify-self: center;
  @media screen and (max-width: 557px) {
    width: 80%;
  }
  h4 {
    color: rgba(38, 32, 59, 1);
    font-size: 16px;
    font-weight: 700;
  }
  p.instruction-text {
    color: #000;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    margin-bottom: 16px;
  }
  .button-container {
    display: grid;
    grid-gap: 8px;
    margin-top: 12px;
    :deep(.q-btn__content) {
      color: #000;
      text-transform: none;
      font-size: 18px;
    }
    .btn-active {
      :deep(.q-btn__content) {
        color: #fff;
      }
    }
  }
  .notification-container {
    background: rgba(224, 251, 224, 1);
    border-radius: 8px;
    padding: 16px;
    margin-top: 24px;
    border: 1px solid rgba(127, 206, 125, 1);
    p {
      color: rgba(38, 32, 59, 1);
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    span {
      font-family: SF Pro;
      font-size: 16px;
      font-weight: 400;
      line-height: 25.6px;
      text-align: left;
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
