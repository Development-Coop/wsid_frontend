<template>
  <q-page class="q-pa-lg">
    <!-- Back Button at the top -->
    <div></div>

    <div>
      <div>
        <!-- Heading and instruction text -->
        <div class="text-center main-wrapper">
          <h4 class="text-h5 text-weight-medium">Describe yourself</h4>
          <p>
            What makes you special? Don't think too hard, just have fun with it
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
            :disable="!authStore.isBioValid"
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
import { useQuasar } from 'quasar';

const router = useRouter();
const authStore = useAuthStore();
const $q = useQuasar();
const isLoading = ref(false);

const navigateToNextStep = async () => {

  try {
    isLoading.value = true;
    const success = await authStore.registerStep3();
    isLoading.value = false;
    if (success) {
      router.push({ name: 'dashboard' });
    } else {
      $q.notify({
        color: 'negative',
        message: 'Registration failed. Please try again.',
        position: "top"
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    $q.notify({
      color: 'negative',
      message: 'An error occurred. Please try again.',
      position: "top"
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
