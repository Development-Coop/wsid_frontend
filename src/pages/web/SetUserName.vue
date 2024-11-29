<template>
  <div class="profile-container">
    <div>
      <!-- Heading and instruction text -->
      <div class="text-left main-wrapper">
        <h4 class="text-h5 text-weight-medium">Set Username</h4>
        <p>Your @username is unique. You can always change it later</p>
      </div>

      <!-- Code Input Boxes (use q-input with narrow width or custom styling) -->
      <div class="input-wrapper">
        <q-input
          v-model="authStore.userDetails.username"
          type="text"
          outlined
          placeholder="Set your username"
          :error="!authStore.isValidUsername"
          error-message="Invalid username. Only alphanumeric, underscores, and periods allowed."
          @focus="moveIconToRight"
          @update:model-value="validateUsername"
        >
          <template #prepend>
            <span class="at-symbol">@</span>
          </template>
        </q-input>

        <!-- Suggestions as a static list (No dropdown) -->
        <div
          v-if="
            authStore.filteredSuggestions &&
              authStore.filteredSuggestions.length
          "
          v-motion-slide-left
          :delay="800"
          class="suggestions-list"
        >
          <div>
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
            v-if="
              authStore.filteredSuggestions &&
                authStore.filteredSuggestions.length > visibleCount
            "
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
          :disable="!isCodeValid"
          :loading="isLoading"
          @click="setUserName"
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
const username = ref("");
const isValidUsername = ref(true);
const iconRight = ref(false);
const showSuggestions = ref(true);
const showAll = ref(false);
const authStore = useAuthStore();
const isLoading = ref(false);

// List of suggestions
const suggestions = ref([
  "@Doe.Alex123",
  "@Alex.Doe",
  "@123DoeAlex",
  "@User123",
  "@John.Doe",
  "@Jane.Doe",
  "@CoolUser",
]);

// Maximum visible suggestions before "Show more" is clicked
const visibleCount = 2;

// Computed property to filter suggestions based on user input
const filteredSuggestions = computed(() => {
  const searchTerm = username.value.toLowerCase().replace("@", "");
  return suggestions.value.filter((suggestion) =>
    suggestion.toLowerCase().includes(searchTerm)
  );
});

// Computed property to show either a limited or full list of suggestions
const visibleSuggestions = computed(() => {
  return showAll.value
    ? filteredSuggestions.value
    : filteredSuggestions.value.slice(0, visibleCount);
});

// Select a suggestion and fill the input
const selectSuggestion = (suggestion) => {
  authStore.setUsername(suggestion.replace("@", ""));
  showSuggestions.value = false; // Hide suggestions after selection
};

// Toggle showing all suggestions
const toggleShowAll = () => {
  showAll.value = !showAll.value;
};

const isCodeValid = computed(() => {
  return !!authStore.userDetails.username && authStore.isValidUsername;
});
const moveIconToRight = () => {
  iconRight.value = true;
};

// Function to validate the username while typing
const validateUsername = (event) => {
  const validPattern = /^[a-zA-Z0-9._]*$/; // Allows only alphanumeric, underscores, and periods
  const noConsecutiveDotsPattern = /\.{2,}/;
  const input = event;

  // Check if the input matches the allowed pattern and length (1 to 15 characters)
  if (
    input.length > 15 ||
    !validPattern.test(input) ||
    noConsecutiveDotsPattern.test(input)
  ) {
    isValidUsername.value = false;
  } else {
    isValidUsername.value = true;
  }

  // Prevent any invalid characters from being entered
  if (!validPattern.test(input) || noConsecutiveDotsPattern.test(input)) {
    event = input.slice(0, -1); // Remove invalid character
  }
};

const setUserName = () => {
  authStore.setUsername(authStore.userDetails.username);
  router.push({ name: "web-set-profile" });
};
</script>

<style scoped lang="scss">
.profile-container {
  display: grid;
  place-items: center;
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
    h4 {
      font-size: 16px;
    }
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
    .show-more {
      width: fit-content;
      font-weight: 500;
      font-size: 16px;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .button-container {
    display: grid;
    grid-gap: 24px;
    margin-top: 32px;
    width: 100%;
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
