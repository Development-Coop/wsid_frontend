<template>
  <q-page class="q-pa-lg">
    <!-- Back Button at the top -->
    <div></div>

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
            :error="!authStore.isValidUsername"
            error-message="Invalid username. Only alphanumeric, underscores, and periods allowed."
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

            <template v-if="iconRight" #append>
              <img src="~src/assets/icons/password-icon.svg" alt="icon-right" />
            </template>
          </q-input>

          <!-- Suggestions as a static list (No dropdown) -->
          <div
            v-if="authStore.filteredSuggestions && authStore.filteredSuggestions.length"
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
              v-if="authStore.filteredSuggestions && authStore.filteredSuggestions.length > visibleCount"
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
            @click="setUserName"
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
const iconRight = ref(false);
const showSuggestions = ref(true);
const showAll = ref(false);

// Maximum visible suggestions before "Show more" is clicked
const visibleCount = 2;

// Computed property to show either a limited or full list of suggestions
const visibleSuggestions = computed(() => {
  if (!authStore.filteredSuggestions) return [];
  return showAll.value
    ? authStore.filteredSuggestions
    : authStore.filteredSuggestions.slice(0, visibleCount);
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
  const input = event;
  authStore.validateUsername(input);

  // Prevent any invalid characters from being entered
  if (!authStore.isValidUsername) {
    authStore.setUsername(input.slice(0, -1)); // Remove invalid character
  }
};

const setUserName = () => {
  authStore.setUsername(authStore.userDetails.username);
  router.push({ name: "set-profile" });
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
