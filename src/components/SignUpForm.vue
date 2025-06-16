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
        :error="!!emailError"
        :error-message="emailError"
        :rules="[(val) => !!val || 'Email is required']"
      />
      
      <!-- Email already exists message -->
      <div v-if="emailError" class="email-error-container q-mt-sm">
        <div class="email-error-message">
          <q-icon name="info" color="primary" size="sm" class="q-mr-xs" />
          <span><p>An account with this email already exists.</p>
          </span>
        </div>
      </div>
    </div>

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
          :disable="!isFormValid || !!emailError"
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
      </div>
    </div>
    <div class="terms q-mt-md">
      <q-checkbox v-model="termsAccepted" />
      <p>
        By signing up to create an account I accept WSID's <span><a @click="router.push({ name: 'terms-conditions' })">Terms of use</a>
          <span><a @click="router.push({ name: 'terms-conditions' })">Terms of use</a>
            &
            <a @click="router.push({ name: 'privacy-policy' })">Privacy Policy</a></span>.
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useAuthStore } from "src/stores/authstore";
import { useRouter } from "vue-router";
import { useQuasar, Loading } from "quasar";
import googleSignIn from "src/utils/googleSignIn";
import appleSignIn from "src/utils/appleSignIn";

const emit = defineEmits(["submitted"]);

const today = ref(new Date().toISOString().split("T")[0]);
const showPopup = ref(false);
const authStore = useAuthStore();
const isLoading = ref(false);
const $q = useQuasar();
const router = useRouter();
const termsAccepted = ref(false);
const emailError = ref('');

// Watch for email changes to clear error
watch(() => authStore.userDetails.phone_or_email, () => {
  emailError.value = '';
});

const handleSignIn = async (signInMethod, redirectTo = { name: "web-dashboard-trending" }) => {
  try {
    Loading.show();
    await signInMethod();
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
    Loading.hide();
  }
};

const handleGoogleSignIn = () => handleSignIn(googleSignIn);
const handleAppleSignIn = () => handleSignIn(appleSignIn);

const parseDate = (dateString) => {
  const [day, month, year] = dateString.split("-");
  return new Date(`${year}-${month}-${day}`);
};

// Computed property to enable/disable the button based on form validation
const isFormValid = computed(() => {
  const isNameValid = authStore.userDetails.name.trim() !== "";
  const isEmailValid = authStore.userDetails.phone_or_email.trim() !== "";
  return isNameValid && isEmailValid && !!authStore.userDetails.dob && termsAccepted.value;
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
    authStore.userDetails.dob = null;
  }
};

// Updated function to handle form submission
const handleSubmit = async () => {
  if (isFormValid.value && !emailError.value) {
    isLoading.value = true;
    emailError.value = ''; // Clear any previous errors
    
    try {
      const res = await authStore.registerStep1(authStore.userDetails);
      
      if (!res?.status) {
        // Check if the error is about email already existing
        if (res && (res.includes('already exist') || res.includes('already registered') || res.includes('Email already exist'))) {
          emailError.value = 'An account with this email already exists.';
        } else {
          // Show other errors as notifications
          $q.notify({
            color: "negative",
            message: res || "Registration failed. Please try again.",
            position: "top",
            icon: "error",
          });
        }
      } else {
        // Success - proceed to OTP step
        emit("submitted", authStore.userDetails.phone_or_email.trim());
      }
    } catch (error) {
      console.error("Registration error:", error);
      $q.notify({
        color: "negative",
        message: "Something went wrong. Please try again.",
        position: "top",
        icon: "error",
      });
    } finally {
      isLoading.value = false;
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

.email-error-container {
  .email-error-message {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    background-color: #e3f2fd;
    border: 1px solid #1976d2;
    border-radius: 8px;
    font-size: 14px;
    color: #1976d2;
    
    .login-link {
      color: #1976d2;
      font-weight: 600;
      cursor: pointer;
      text-decoration: underline;
      
      &:hover {
        color: #1565c0;
      }
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
    border-style: solid !important;
    border-width: 1px !important;
    border-color: rgba(0, 0, 0, 0.24) !important;
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
.terms {
  font-weight: 400;
  font-size: 16px;
  display: flex;
  align-items: start;
  justify-content: center;
  gap: 4px;
  span {
    color: $primary;
    a {
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

// Error state styling for email field
:deep(.q-field--error) {
  .q-field__control {
    border-color: #c62828;
  }
}
</style>