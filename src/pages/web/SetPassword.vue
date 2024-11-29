<template>
  <div class="profile-container">
    <div>
      <!-- Heading and instruction text -->
      <div class="text-left main-wrapper">
        <h4 class="text-h5 text-weight-medium">You’ll need a password</h4>
        <p>Make sure it’s 8 characters or above</p>
      </div>

      <div class="input-wrapper">
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
        <div :class="['text-right', { 'q-mt-md': !!errorMessage }]">
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
    router.push({ name: "web-set-username" });
  }
};
</script>

<style scoped lang="scss">
.profile-container {
  display: grid;
  min-width: 320px;
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
    grid-gap: 4px;
    margin-bottom: 24px;
    p,
    h4 {
      font-size: 16px;
    }
  }

  .input-wrapper {
    span.bio-length {
      font-size: 16px;
    }
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
  //   :deep(.q-textarea .q-field__native) {
  //     padding: 8px 0;
  //     color: rgba(156, 154, 165, 1);
  //   }
}
</style>
