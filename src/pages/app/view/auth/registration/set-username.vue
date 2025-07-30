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
      @click="router.push({ name: 'set-password' })"
    >
      <q-icon v-motion-pop-visible :delay="300" size="24px">
        <img src="~src/assets/icons/arrow-left.svg" alt="logo" />
      </q-icon>
    </q-btn>

    <div>
      <div>
        <!-- Heading and instruction text -->
        <div class="text-center main-wrapper">
          <h4 class="text-h5 text-weight-medium">What should we call you?</h4>
          <p>Your @username is unique. You can always change it later</p>
        </div>

        <!-- Code Input Boxes (use q-input with narrow width or custom styling) -->
        <div class="input-wrapper">
          <q-input
            v-model="authStore.userDetails.username"
            type="text"
            outlined
            placeholder="Set your username"
            maxlength="20"
            @focus="moveIconToRight"
            @update:model-value="validateUsername"
          >
            <!-- Conditionally render icon on the left or right based on iconRight state -->
            <template v-if="!iconRight" #prepend>
              <img src="~src/assets/icons/password-icon.svg" alt="icon-right" />
            </template>
            <template v-else #prepend>
              <span class="at-symbol">@</span>
            </template>

            <!-- Loading indicator when checking availability -->
            <template #append>
              <q-spinner
                v-if="authStore.usernameCheckingStatus === 'checking'"
                color="primary"
                size="sm"
              />
              <q-icon
                v-else-if="showSuccessIcon"
                name="check_circle"
                color="positive"
                size="sm"
              />
              <q-icon
                v-else-if="hasError"
                name="error"
                color="negative"
                size="sm"
              />
            </template>
          </q-input>

          <!-- Error message -->
          <div v-if="hasError" class="error-message q-mt-sm">
            <span class="text-negative">{{ authStore.usernameError }}</span>
          </div>

          <!-- Success message -->
          <div v-if="showSuccessMessage" class="success-message q-mt-sm">
            <q-icon name="check_circle" color="positive" size="sm" />
            <span class="text-positive q-ml-xs">Username is available!</span>
          </div>

          <!-- Suggestions as a static list (Show when username is taken) -->
          <div
            v-if="
              authStore.usernameError === 'Username is already taken' &&
              authStore.suggestions.length
            "
            v-motion-slide-left
            :delay="200"
            class="suggestions-wrapper q-mt-md"
          >
            <p class="suggestions-title">Try these suggestions:</p>
            <div class="suggestions-list">
              <span
                v-for="(suggestion, index) in visibleSuggestions"
                :key="index"
                class="suggestion"
                @click="selectSuggestion(suggestion)"
              >
                {{ suggestion
                }}<span v-if="index < visibleSuggestions.length - 1">, </span>
              </span>
            </div>

            <!-- Show more/less option -->
            <p
              v-if="authStore.suggestions.length > visibleCount"
              class="text-green-5 show-more q-mt-sm cursor-pointer"
              @click="toggleShowAll"
            >
              {{ showAll ? "Show less" : "Show more" }}
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
            :disable="!canProceed"
            :loading="isLoading"
            @click="setUserName"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/authstore";

const router = useRouter();
const authStore = useAuthStore();
const iconRight = ref(false);
const showAll = ref(false);
const isLoading = ref(false);

// Maximum visible suggestions before "Show more" is clicked
const visibleCount = 2;

// Watch for username taken status to fetch API suggestions
watch(
  () => authStore.usernameError,
  async (newError) => {
    if (
      newError === "Username is already taken" &&
      authStore.userDetails.username
    ) {
      // Fetch API suggestions for the current username
      await authStore.getUsernameSuggestions(authStore.userDetails.username);
    }
  }
);

// Computed property to determine if user can proceed
const canProceed = computed(() => {
  const username = authStore.userDetails.username;
  const isValid = authStore.isUsernameFullyValid;
  const isNotLoading = !isLoading.value;
  const hasUsername = username && username.trim().length >= 3;

  return isValid && isNotLoading && hasUsername;
});

// Computed properties for showing icons and messages
const showSuccessIcon = computed(() => {
  return (
    authStore.isUsernameFullyValid &&
    authStore.userDetails.username.length >= 3 &&
    authStore.usernameCheckingStatus === "checked"
  );
});

const hasError = computed(() => {
  return (
    !!authStore.usernameError &&
    authStore.userDetails.username.length > 0 &&
    authStore.usernameCheckingStatus !== "checking"
  );
});

const showSuccessMessage = computed(() => {
  return (
    authStore.isUsernameFullyValid &&
    authStore.userDetails.username.length >= 3 &&
    authStore.usernameCheckingStatus === "checked"
  );
});

// Computed property to show either a limited or full list of suggestions
const visibleSuggestions = computed(() => {
  if (!authStore.suggestions) return [];
  return showAll.value
    ? authStore.suggestions
    : authStore.suggestions.slice(0, visibleCount);
});

// Select a suggestion and fill the input
const selectSuggestion = async (suggestion) => {
  const cleanUsername = suggestion.replace("@", "");
  authStore.userDetails.username = cleanUsername;
  authStore.setUsername(cleanUsername);

  // Validate and check availability of selected suggestion
  const isFormatValid = authStore.validateUsername(cleanUsername);
  if (isFormatValid) {
    await authStore.checkUsernameAvailability(cleanUsername);
  }
};

// Toggle showing all suggestions
const toggleShowAll = () => {
  showAll.value = !showAll.value;
};

const moveIconToRight = () => {
  iconRight.value = true;
};

// Function to validate the username while typing
const validateUsername = (newValue) => {
  // Clear suggestions when user starts typing
  if (newValue.trim().length < 3) {
    authStore.suggestions = [];
  }

  // First validate the format
  const isFormatValid = authStore.validateUsername(newValue);

  // Only check availability if format is valid and username is at least 3 characters
  if (isFormatValid && newValue.trim().length >= 3) {
    authStore.checkUsernameAvailability(newValue);
  } else {
    // Reset availability checking status if conditions aren't met
    authStore.usernameCheckingStatus = "idle";
    authStore.isUsernameAvailable = true;
  }
};

const setUserName = async () => {
  if (!canProceed.value) {
    // Show specific error message based on what's missing
    if (
      !authStore.userDetails.username ||
      authStore.userDetails.username.trim().length < 3
    ) {
      authStore.usernameError =
        "Please enter a valid username (at least 3 characters)";
    } else if (!authStore.isUsernameFullyValid) {
      authStore.usernameError =
        "Please fix the username errors before proceeding";
    }
    return;
  }

  isLoading.value = true;

  try {
    authStore.setUsername(authStore.userDetails.username);
    router.push({ name: "set-profile" });
  } catch (error) {
    console.error("Error proceeding to next step:", error);
  } finally {
    isLoading.value = false;
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
  .input-wrapper {
    .suggestions-list {
      span {
        font-size: 16px;
        cursor: pointer;
      }
    }
    .suggestions-wrapper {
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 8px;
      border-left: 4px solid #1976d2;

      .suggestions-title {
        margin: 0 0 8px 0;
        font-weight: 500;
        font-size: 14px;
        color: #666;
      }

      .suggestions-list {
        span {
          font-size: 15px;
          cursor: pointer;
          color: #1976d2;
          font-weight: 500;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
    .show-more {
      width: fit-content;
      font-weight: 500;
      font-size: 16px;
      &:hover {
        text-decoration: underline;
      }
    }
    .error-message {
      font-size: 14px;
      font-weight: 500;
    }
    .success-message {
      display: flex;
      align-items: center;
      font-size: 14px;
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
