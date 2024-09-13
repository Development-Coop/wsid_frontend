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
            v-model="username"
            type="text"
            outlined
            dense
            placeholder="Set your username"
            :error="!isValidUsername"
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
          <div v-if="filteredSuggestions.length" class="suggestions-list">
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
              v-if="filteredSuggestions.length > visibleCount"
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
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const username = ref("");
const isValidUsername = ref(true);
const iconRight = ref(false);
const showSuggestions = ref(true);
const showAll = ref(false);

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
  username.value = suggestion.replace("@", "");
  showSuggestions.value = false; // Hide suggestions after selection
};

// Toggle showing all suggestions
const toggleShowAll = () => {
  showAll.value = !showAll.value;
};

const isCodeValid = computed(() => {
  return !!username.value;
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
