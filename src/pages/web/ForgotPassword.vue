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
      label="Phone, email or @username"
      dense
      :rules="[(val) => !!val || 'Email is required']"
    />
    <div class="button-container">
      <q-btn
        block
        label="Recover account"
        :color="isEmailValid && !isSubmitted ? 'primary' : 'grey'"
        unelevated
        :disable="!isEmailValid || isSubmitted"
        :class="{ 'btn-active': isEmailValid && !isSubmitted }"
        @click="isSubmitted = true"
      />
      <q-btn block label="Back" color="grey-3" unelevated @click="router.go(-1)" />
    </div>
    <div v-if="isSubmitted" class="notification-container">
      <p>Recovery Mail Sent</p>
      <span>An email has been sent to your registered email address with
        instructions to help you recover your password. Please check your inbox
        and follow the provided steps to regain access to your account.</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
// Helper
import { isValidEmail } from "src/utils/helper";

import { useRouter } from "vue-router";

const email = ref("");
const isSubmitted = ref(false);
const router = useRouter();

const isEmailValid = computed(() => {
  return isValidEmail(email.value);
});
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
</style>
