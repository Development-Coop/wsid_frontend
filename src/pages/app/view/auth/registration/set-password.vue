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
      @click="router.push({ name: 'otp-verification' })"
    >
      <q-icon v-motion-pop-visible :delay="300" size="24px">
        <img src="~src/assets/icons/arrow-left.svg" alt="logo" />
      </q-icon>
    </q-btn>

    <div>
      <div>
        <!-- Heading and instruction text -->
        <div class="text-center main-wrapper">
          <h4 class="text-h5 text-weight-medium">You’ll need a password</h4>
          <p>Make sure it’s 8 characters or above</p>
        </div>

        <!-- Code Input Boxes (use q-input with narrow width or custom styling) -->
        <div>
          <q-input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            outlined
            placeholder="Enter your password"
            :error="!!errorMessage"
            :error-message="errorMessage"
            @focus="moveIconToRight"
            @blur="validatePasswordOnBlur"
          >
            <!-- Conditionally render icon on the left or right based on iconRight state -->
            <template v-if="!iconRight" #prepend>
              <img src="~src/assets/icons/password-icon.svg" alt="icon-right" />
            </template>

            <template v-if="iconRight" #append>
              <img src="~src/assets/icons/password-icon.svg" alt="icon-right" />
            </template>
          </q-input>

          <!-- Reveal Password Text -->
          <div class="text-right q-mt-md">
            <p
              class="cursor-pointer toggle-password"
              @click="showPassword = !showPassword"
            >
              Reveal password
            </p>
          </div>
        </div>
      </div>
      <div class="button-container">
        <!-- Submit Button (initially disabled) -->
        <div>
          <q-btn
            v-motion-pop
            :delay="700"
            block
            label="Next"
            color="primary"
            unelevated
            :disable="!isCodeValid"
            :loading="isLoading"
            @click="setPassword"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/authstore";

const router = useRouter();
const authStore = useAuthStore();
const password = ref("");
const showPassword = ref(false);
const iconRight = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");

const isCodeValid = computed(() => {
  const passwordValue = password.value;
  const hasMinLength = passwordValue.length > 7;
  const hasUpperCase = /[A-Z]/.test(passwordValue);
  const hasLowerCase = /[a-z]/.test(passwordValue);
  const hasNumber = /\d/.test(passwordValue);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue);

  return (
    hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
  );
});

const moveIconToRight = () => {
  iconRight.value = true;
};

const validatePasswordOnBlur = () => {
  if (!isCodeValid.value) {
    errorMessage.value =
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.";
  } else {
    errorMessage.value = ""; // Clear error if valid
  }
};

const setPassword = () => {
  if (isCodeValid.value) {
    isLoading.value = true;
    authStore.setPassword(password.value);
    isLoading.value = false;
    router.push({ name: "set-user-id" });
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
    grid-gap: 24px;
    margin-bottom: 24px;
    p {
      font-size: 16px;
    }
  }
  p.toggle-password {
    color: #2a59fe;
    font-size: 16px;
    transition: color 0.3s ease;
    &:hover {
      color: #1a45c7; /* Change the color on hover */
      text-decoration: underline; /* Add underline on hover */
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
  }
  :deep(.q-field__control) {
    input {
      font-size: 16px;
    }
  }
}
</style>
