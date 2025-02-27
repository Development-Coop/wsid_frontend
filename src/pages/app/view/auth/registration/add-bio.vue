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
      @click="router.push({ name: 'set-profile' })"
    >
      <q-icon v-motion-pop-visible :delay="300" size="24px">
        <img src="~src/assets/icons/arrow-left.svg" alt="logo" />
      </q-icon>
    </q-btn>

    <div>
      <div>
        <!-- Heading and instruction text -->
        <div class="text-center main-wrapper">
          <h4 class="text-h5 text-weight-medium">Describe yourself.</h4>
          <p>
            What makes you special? Don't think too hard. Just have fun with it.
          </p>
        </div>

        <!-- Code Input Boxes (use q-input with narrow width or custom styling) -->
        <div class="input-wrapper">
          <q-input
            v-model="authStore.userDetails.bio"
            type="text"
            :maxlength="160"
            outlined
            placeholder="Your bio"
            @update:model-value="authStore.setBio"
          >
            <template #append>
              <span class="bio-length">{{ authStore.remainingBioChars }}</span>
            </template>
          </q-input>
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
            :loading="isLoading"
            @click="navigateToNextStep"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/authstore";
import { useQuasar } from "quasar";

const router = useRouter();
const authStore = useAuthStore();
const $q = useQuasar();
const isLoading = ref(false);

const navigateToNextStep = async () => {
  try {
    isLoading.value = true;
    const res = await authStore.registerStep3();
    isLoading.value = false;
    if (!res?.status) {
      $q.notify({
        color: "negative",
        message: res,
        position: "top",
        icon: "error",
      });
    } else {
      $q.notify({
        message: "Account created successfully!",
        color: "positive", // You can use different colors like 'negative', 'warning', 'info'
        position: "top", // Position can be 'top', 'bottom', 'left', 'right'
        timeout: 3000, // Duration the toast will be visible, in milliseconds
        icon: "check_circle", // Optional: adds an icon, Quasar icons or Material Icons can be used
      });
      router.push({ name: "dashboard" });
    }
  } catch (error) {
    console.error("Registration error:", error);
    $q.notify({
      color: "negative",
      message: "An error occurred. Please try again.",
      position: "top",
      icon: "error",
    });
  } finally {
    console.log("Completed");
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
    span.bio-length {
      font-size: 16px;
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
