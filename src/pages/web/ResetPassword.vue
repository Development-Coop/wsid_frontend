<template>
  <div class="fp-container">
    <!-- Heading and instruction text -->
    <div class="text-center main-wrapper">
      <h4 class="text-h5 text-weight-medium">Reset password</h4>
    </div>

    <!-- Code Input Boxes (use q-input with narrow width or custom styling) -->
    <div class="password-container">
      <q-input
        v-model="otp"
        type="text"
        maxlength="6"
        outlined
        placeholder="Enter OTP"
        @update:model-value="filterOnlyDigits"
        @keypress="preventNonNumeric"
      >
      </q-input>
      <q-input
        v-model="password"
        type="password"
        outlined
        placeholder="New password"
      >
      </q-input>
      <q-input
        v-model="confirmPassword"
        :type="showPassword ? 'text' : 'password'"
        outlined
        placeholder="Confirm password"
      >
        <template #append>
          <q-icon
            :name="showPassword ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="togglePasswordVisibility"
          />
        </template>
      </q-input>
    </div>
    <div class="button-container">
      <!-- Submit Button (initially disabled) -->
      <div>
        <q-btn
          v-motion-pop
          :delay="700"
          block
          label="Reset password"
          color="primary"
          unelevated
          :loading="isLoading"
          @click="setPassword"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "src/stores/authstore";
import { useQuasar } from "quasar";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const $q = useQuasar();
const password = ref("");
const showPassword = ref(false);
const confirmPassword = ref("");
const otp = ref("");
const isLoading = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const filterOnlyDigits = (event) => {
  otp.value = event.replace(/\D/g, ""); // Remove non-numeric characters
};

const preventNonNumeric = (event) => {
  const charCode = event.which ? event.which : event.keyCode;
  // Allow only numeric characters (0-9) and control keys like backspace
  if (charCode < 48 || charCode > 57) {
    event.preventDefault(); // Prevent non-numeric input
  }
};

const validateAndNotify = () => {
  let errorMessage = "";

  if (password.value.length < 8) {
    errorMessage = "Password must be at least 8 characters long.";
  } else if (password.value !== confirmPassword.value) {
    errorMessage = "Passwords do not match.";
  } else if (otp.value.length !== 6) {
    errorMessage = "OTP must be 6 digits.";
  }

  if (errorMessage) {
    // Show error notification with the appropriate message
    $q.notify({
      message: errorMessage,
      color: "negative", // Red for error
      position: "top",
      timeout: 3000,
      icon: "error", // Error icon
    });
    return false;
  } else {
    // If validation passes, return true (but no success message required)
    return true;
  }
};

const setPassword = async () => {
  if (validateAndNotify()) {
    isLoading.value = true;
    const res = await authStore.resetPassword(
      route.query.email,
      otp.value,
      confirmPassword.value
    );
    isLoading.value = false;
    if (!res?.status) {
      $q.notify({
        message: res,
        color: "negative", // You can use different colors like 'negative', 'warning', 'info'
        position: "top", // Position can be 'top', 'bottom', 'left', 'right'
        timeout: 3000, // Duration the toast will be visible, in milliseconds
        icon: "error", // Optional: adds an icon, Quasar icons or Material Icons can be used
      });
    } else {
      $q.notify({
        message: res?.message,
        color: "positive", // You can use different colors like 'negative', 'warning', 'info'
        position: "top", // Position can be 'top', 'bottom', 'left', 'right'
        timeout: 3000, // Duration the toast will be visible, in milliseconds
        icon: "check_circle", // Optional: adds an icon, Quasar icons or Material Icons can be used
      });
      router.push({ name: "web-login" });
    }
  }
};
</script>

<style scoped lang="scss">
.fp-container {
  min-width: 320px;
  .main-wrapper {
    position: relative;
    width: 100%;
    display: grid;
    grid-gap: 24px;
    margin-bottom: 40px;
    p {
      font-size: 16px;
    }
  }
  .password-container {
    display: grid;
    grid-gap: 20px;
  }
  .button-container {
    display: grid;
    grid-gap: 24px;
    margin-top: 40px;
    p {
      margin: 0;
      font-size: 16px;
    }
    button {
      width: 100%;
    }
    :deep(.q-btn__content) {
      text-transform: none;
    }
  }
  :deep(.q-field__control) {
    height: 40px;
    input {
      font-size: 16px;
    }
  }
  :deep(.q-field__marginal) {
    height: 42px;
  }
}
</style>
