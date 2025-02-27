<template>
  <div class="login-container">
    <div class="input-group">
      <p>Name</p>
      <!-- Name Input -->
      <q-input
        v-model="authStore.userDetails.name"
        outlined
        label="Name"
        maxlength="20"
        dense
        :rules="[(val) => !!val || 'Name is required']"
      />
    </div>

    <div class="input-group">
      <p>Email Id</p>
      <!-- Email Input -->
      <q-input
        v-model="authStore.userDetails.phone_or_email"
        outlined
        label="Email address"
        dense
        :rules="[(val) => !!val || 'Email is required']"
      />
    </div>

    <!-- <div class="input-group">
      <div class="label-container">
        <p>Password</p>
        <span
          class="cursor-pointer"
          @click="router.push({ name: 'web-forgot-password' })"
        >
          Forgot Password?
        </span>
      </div> -->
    <!-- Password Input -->
    <!-- <q-input
        v-model="password"
        type="password"
        outlined
        label="Enter Password"
        dense
        :rules="[(val) => !!val || 'Password is required']"
      >
      </q-input> -->
    <!-- <div> -->
    <!-- <div class="q-mt-sm">
          <q-icon
            v-if="passwordStrengthIcon"
            :name="passwordStrengthIcon"
            :class="[
              {
                'text-blue': passwordStrengthIcon !== 'close',
                'text-red': passwordStrengthIcon === 'close',
              },
              'q-mr-sm',
            ]"
          />
          Password Strength: {{ passwordStrengthText }}
        </div> -->

    <!-- Validation List -->
    <!-- <ul class="validation-list q-mb-md">
          <li v-for="(rule, index) in passwordRules" :key="index">
            <q-icon v-if="rule.valid" name="check" class="text-blue q-mr-sm" />
            <q-icon v-else name="close" class="text-red q-mr-sm" />
            {{ rule.message }}
          </li>
        </ul>
      </div> -->
    <!-- </div> -->

    <div class="input-group">
      <p>Date of birth</p>
      <q-input
        v-model="authStore.userDetails.dob"
        outlined
        label="Date of birth"
        readonly
        placeholder="Date of birth"
      >
        <template #append>
          <q-icon
            name="event"
            class="cursor-pointer"
            @click="showPopup = true"
          />
        </template>

        <q-popup-proxy
          v-model="showPopup"
          transition-show="scale"
          transition-hide="scale"
        >
          <!-- Date picker with max date set to today -->
          <q-date
            v-model="authStore.userDetails.dob"
            mask="DD-MM-YYYY"
            :max="today"
            @update:model-value="onDateSelect"
          />
        </q-popup-proxy>
      </q-input>
    </div>

    <div>
      <div class="button-container">
        <q-btn
          block
          label="Create Account"
          color="primary"
          unelevated
          class="login-btn"
          :disable="!isFormValid"
          :loading="isLoading"
          @click="handleSubmit"
        />
      </div>

      <!-- Divider with OR -->
      <div class="text-center relative-position q-py-lg divider-section">
        <hr class="divider q-my-none" />
        <span class="bg-white q-px-sm absolute-center divider-color">OR</span>
      </div>

      <!-- Social Login Buttons -->
      <div class="social-login">
        <q-btn round outline class="social-btn" @click="handleGoogleSignIn">
          <img
            src="../assets//icons//google-icon.svg"
            alt="google-icon"
            srcset=""
          />
        </q-btn>
        <q-btn round outline class="social-btn" @click="handleAppleSignIn">
          <img
            src="../assets//icons//apple-icon.svg"
            alt="apple-icon"
            srcset=""
          />
        </q-btn>
        <!-- <q-btn round outline class="social-btn">
          <img
            src="../assets//icons//microsoft-icon.svg"
            alt="microsoft-icon"
            srcset=""
          />
        </q-btn> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "src/stores/authstore";
import { useRouter } from "vue-router";
import { useQuasar, Loading } from "quasar";
import googleSignIn from "src/utils/googleSignIn";
import appleSignIn from "src/utils/appleSignIn";

const emit = defineEmits(["submitted"]);

// const router = useRouter();
// const name = ref("");
// const email = ref("");
// const password = ref("");
// const passwordStrengthText = ref("Weak");
// const passwordStrengthIcon = ref("close");
const today = ref(new Date().toISOString().split("T")[0]);
const showPopup = ref(false);
const authStore = useAuthStore();
const isLoading = ref(false);
const $q = useQuasar();
const router = useRouter();

// Define password validation rules
// const passwordRules = ref([
//   {
//     message: "Cannot contain your name or email address",
//     valid: false,
//   },
//   {
//     message: "At least 8 characters",
//     valid: false,
//   },
//   {
//     message: "Contains a number or symbol",
//     valid: false,
//   },
// ]);

// Watch the password input for changes and run validations
// watch(password, (newPassword) => {
//   checkPassword(newPassword);
// });

const handleSignIn = async (signInMethod, redirectTo = { name: "web-dashboard-trending" }) => {
  try {
    Loading.show(); // Show loading indicator
    await signInMethod();
    
    // Redirect after successful sign-in
    router.push(redirectTo);
  } catch (error) {
    console.error("Error during sign-in:", error);
    $q.notify({
      message: "Sign-in failed. Please try again.",
      color: "negative",
      position: "top",
      icon: "error"
    });
  } finally {
    Loading.hide(); // Hide loading indicator
  }
};

// Usage for Google Sign-In
const handleGoogleSignIn = () => handleSignIn(googleSignIn);

// Usage for Apple Sign-In
const handleAppleSignIn = () => handleSignIn(appleSignIn);

const parseDate = (dateString) => {
  const [day, month, year] = dateString.split("-");
  return new Date(`${year}-${month}-${day}`);
};

// Method to check password strength and validation
// const checkPassword = (newPassword) => {
//   const containsNameOrEmail = checkContainsNameOrEmail(newPassword);
//   const isLongEnough = newPassword.length >= 8;
//   const containsNumberOrSymbol = checkContainsNumberOrSymbol(newPassword);

//   // Update the validity of password rules
//   passwordRules.value[0].valid = !containsNameOrEmail;
//   passwordRules.value[1].valid = isLongEnough;
//   passwordRules.value[2].valid = containsNumberOrSymbol;

//   // Determine password strength
//   if (isLongEnough && containsNumberOrSymbol && !containsNameOrEmail) {
//     passwordStrengthText.value = "Strong";
//     passwordStrengthIcon.value = "check";
//   } else if (isLongEnough && (containsNumberOrSymbol || !containsNameOrEmail)) {
//     passwordStrengthText.value = "Medium";
//     passwordStrengthIcon.value = "check";
//   } else {
//     passwordStrengthText.value = "Weak";
//     passwordStrengthIcon.value = "warning";
//   }
// };

// Helper Functions
// const checkContainsNameOrEmail = (password) => {
//   // Ensure name and email are non-empty before checking .includes()
//   const containsName =
//     name.value && password.toLowerCase().includes(name.value.toLowerCase());
//   const containsEmail =
//     email.value && password.toLowerCase().includes(email.value.toLowerCase());

//   return containsName || containsEmail;
// };

// const checkContainsNumberOrSymbol = (password) => {
//   return /[0-9!@#$%^&*]/.test(password);
// };

// Computed property to enable/disable the button based on form validation
const isFormValid = computed(() => {
  const isNameValid = authStore.userDetails.name.trim() !== "";
  const isEmailValid = authStore.userDetails.phone_or_email.trim() !== "";

  // Remove date validation from here since we'll handle it in onDateSelect
  return isNameValid && isEmailValid && !!authStore.userDetails.dob;
});

// Add new function to handle date selection
const onDateSelect = (date) => {
  const selectedDate = parseDate(date);
  const minAgeDate = new Date();
  minAgeDate.setFullYear(minAgeDate.getFullYear() - 16);
  
  if (selectedDate > minAgeDate) {
    $q.notify({
      color: "negative",
      message: "You must be at least 16 years old to sign up",
      position: "top",
      icon: "error",
    });
    authStore.userDetails.dob = null; // Clear the invalid date
  }
};

// Updated function to handle form submission
const handleSubmit = async () => {
  if (isFormValid.value) {
    isLoading.value = true;
    const res = await authStore.registerStep1(authStore.userDetails);
    isLoading.value = false;
    if (!res?.status) {
      $q.notify({
        color: "negative",
        message: res,
        position: "top",
        icon: "error",
      });
    } else {
      emit("submitted", authStore.userDetails.phone_or_email.trim());
    }
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  max-width: 400px;
  margin: auto;
  padding-top: 2rem;
  display: grid;
  grid-gap: 16px;
  .input-group {
    display: grid;
    grid-gap: 8px;
    p {
      font-size: 16px;
      font-weight: 500;
    }
    .label-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        color: #9c9aa5;
        font-weight: 400;
        font-size: 12px;
        text-decoration: underline;
      }
    }
  }
  .button-container {
    margin-top: 16px;
    :deep(.q-btn__content) {
      text-transform: none;
    }
  }
}

:deep(.q-field__bottom) {
  display: none;
}
:deep(.q-field--with-bottom) {
  padding-bottom: 0;
}
.q-input input {
  font-size: 16px;
}

.forgot-password-btn {
  font-size: 14px;
  color: #999;
  text-decoration: underline;
}

.login-btn {
  font-size: 16px;
  background-color: $primary;
  color: white;
  width: 100%;
}

.divider {
  text-align: center;
  position: relative;
  border: 0.6px solid rgba(156, 154, 165, 0.3);
  &-color {
    color: rgba(156, 154, 165, 0.3);
    font-size: 12px;
  }
  &-section {
    width: 50%;
    margin: auto;
    padding: 30px 0;
  }
}

.divider .q-separator {
  width: 50%;
  margin: auto;
}

.social-login {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  place-items: center;
  :deep(.q-btn--outline)::before {
    border: none;
  }
}

.social-btn {
  width: 112px;
  height: 48px;
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid rgba(70, 95, 241, 0.4);
}

:deep(.input-group) {
  .q-field--outlined.q-field--readonly .q-field__control:before {
    border-style: solid !important; /* Force solid border */
    border-width: 1px !important; /* Adjust thickness to match other inputs */
    border-color: rgba(
      0,
      0,
      0,
      0.24
    ) !important; /* Adjust color to match theme */
  }
  .q-field__control {
    height: 40px;
  }
  .q-field--labeled .q-field__native,
  .q-field--labeled .q-field__prefix,
  .q-field--labeled .q-field__suffix {
    padding-bottom: 2px;
    padding-top: 16px;
  }
  .q-field__marginal {
    height: 42px;
  }
  .q-field__label {
    top: 11px;
  }
}
</style>
