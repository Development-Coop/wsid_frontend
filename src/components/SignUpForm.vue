<template>
  <div class="login-container">
    <div class="input-group">
      <p>Name</p>
      <!-- Name Input -->
      <q-input
        v-model="name"
        outlined
        label="Name"
        dense
        :rules="[(val) => !!val || 'Name is required']"
      />
    </div>

    <div class="input-group">
      <p>Email Id</p>
      <!-- Email Input -->
      <q-input
        v-model="email"
        outlined
        label="Email or @username"
        dense
        :rules="[(val) => !!val || 'Email is required']"
      />
    </div>

    <div class="input-group">
      <div class="label-container">
        <p>Password</p>
        <span
          class="cursor-pointer"
          @click="router.push({ name: 'web-forgot-password' })"
        >
          Forgot Password?
        </span>
      </div>
      <!-- Password Input -->
      <q-input
        v-model="password"
        type="password"
        outlined
        label="Enter Password"
        dense
        :rules="[(val) => !!val || 'Password is required']"
      >
      </q-input>
      <div>
        <div class="q-mt-sm">
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
        </div>

        <!-- Validation List -->
        <ul class="validation-list q-mb-md">
          <li v-for="(rule, index) in passwordRules" :key="index">
            <q-icon v-if="rule.valid" name="check" class="text-blue q-mr-sm" />
            <q-icon v-else name="close" class="text-red q-mr-sm" />
            {{ rule.message }}
          </li>
        </ul>
      </div>
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
          @click="$emit('submitted', email)"
        />
      </div>

      <!-- Divider with OR -->
      <div class="text-center relative-position q-py-lg divider-section">
        <hr class="divider q-my-none" />
        <span class="bg-white q-px-sm absolute-center divider-color">OR</span>
      </div>

      <!-- Social Login Buttons -->
      <div class="social-login">
        <q-btn round outline class="social-btn">
          <img
            src="../assets//icons//google-icon.svg"
            alt="google-icon"
            srcset=""
          />
        </q-btn>
        <q-btn round outline class="social-btn">
          <img
            src="../assets//icons//apple-icon.svg"
            alt="apple-icon"
            srcset=""
          />
        </q-btn>
        <q-btn round outline class="social-btn">
          <img
            src="../assets//icons//microsoft-icon.svg"
            alt="microsoft-icon"
            srcset=""
          />
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useRouter } from "vue-router";

defineEmits(['submitted']);

const router = useRouter();
const name = ref("");
const email = ref("");
const password = ref("");
const passwordStrengthText = ref("Weak");
const passwordStrengthIcon = ref("close");

// Define password validation rules
const passwordRules = ref([
  {
    message: "Cannot contain your name or email address",
    valid: false,
  },
  {
    message: "At least 8 characters",
    valid: false,
  },
  {
    message: "Contains a number or symbol",
    valid: false,
  },
]);

// Watch the password input for changes and run validations
watch(password, (newPassword) => {
  checkPassword(newPassword);
});

// Method to check password strength and validation
const checkPassword = (newPassword) => {
  const containsNameOrEmail = checkContainsNameOrEmail(newPassword);
  const isLongEnough = newPassword.length >= 8;
  const containsNumberOrSymbol = checkContainsNumberOrSymbol(newPassword);

  // Update the validity of password rules
  passwordRules.value[0].valid = !containsNameOrEmail;
  passwordRules.value[1].valid = isLongEnough;
  passwordRules.value[2].valid = containsNumberOrSymbol;

  // Determine password strength
  if (isLongEnough && containsNumberOrSymbol && !containsNameOrEmail) {
    passwordStrengthText.value = "Strong";
    passwordStrengthIcon.value = "check";
  } else if (isLongEnough && (containsNumberOrSymbol || !containsNameOrEmail)) {
    passwordStrengthText.value = "Medium";
    passwordStrengthIcon.value = "check";
  } else {
    passwordStrengthText.value = "Weak";
    passwordStrengthIcon.value = "warning";
  }
};

// Helper Functions
const checkContainsNameOrEmail = (password) => {
  // Ensure name and email are non-empty before checking .includes()
  const containsName =
    name.value && password.toLowerCase().includes(name.value.toLowerCase());
  const containsEmail =
    email.value && password.toLowerCase().includes(email.value.toLowerCase());

  return containsName || containsEmail;
};

const checkContainsNumberOrSymbol = (password) => {
  return /[0-9!@#$%^&*]/.test(password);
};

// Computed property to enable/disable the button based on form validation
const isFormValid = computed(() => {
  // Check if name and email are filled in and valid
  const isNameValid = name.value.trim() !== "";
  const isEmailValid = email.value.trim() !== "";

  // Check if all password rules are valid
  const isPasswordValid = passwordRules.value.every((rule) => rule.valid);
  const isStrength = passwordStrengthText.value !== "Weak";

  // The form is valid if all fields are valid
  return isNameValid && isEmailValid && isPasswordValid && isStrength;
});
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
  grid-template-columns: repeat(3, 1fr);
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
</style>
