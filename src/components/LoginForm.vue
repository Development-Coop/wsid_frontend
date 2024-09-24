<template>
  <div class="login-container">
    <div class="input-group">
      <p>Email Id</p>
      <!-- Email Input -->
      <q-input
        v-model="email"
        outlined
        label="Phone, email or @username"
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
    </div>

    <div>
      <div class="button-container">
        <q-btn
          block
          label="Login"
          color="primary"
          unelevated
          class="login-btn"
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
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref("");
const password = ref("");
</script>

<style lang="scss" scoped>
.login-container {
  max-width: 400px;
  margin: auto;
  padding-top: 2rem;
  display: grid;
  grid-gap: 32px;
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
