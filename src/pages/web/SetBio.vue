<template>
  <div class="bio-container">
    <div>
      <!-- Heading and instruction text -->
      <div class="text-left main-wrapper">
        <h4 class="text-h5 text-weight-medium">Describe yourself</h4>
        <p>
          What makes you special? Don’t think too hard, just have fun with it
        </p>
      </div>

      <!-- Code Input Boxes (use q-input with narrow width or custom styling) -->
      <div class="input-wrapper">
        <q-input
          v-model="bio"
          type="textarea"
          :maxlength="160"
          outlined
          placeholder="Enter bio"
        >
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
          :disable="!bio.length"
          @click="setBio"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const bio = ref("");
const setBio = () => {
  router.push({ name: "web-set-profile" });
};
</script>

<style scoped lang="scss">
.bio-container {
  display: grid;
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
    p,
    h4 {
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
    margin-top: 24px;
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
  :deep(.q-textarea .q-field__native) {
    padding: 8px 0;
    color: rgba(156, 154, 165, 1);
  }
}
</style>
