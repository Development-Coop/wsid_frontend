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
            What makes you special? Don’t think too hard, just have fun with it
          </p>
        </div>

        <!-- Code Input Boxes (use q-input with narrow width or custom styling) -->
        <div class="input-wrapper">
          <q-input
            v-model="bio"
            type="text"
            :maxlength="160"
            outlined
            dense
            placeholder="Your bio"
          >
            <template #append>
              <span class="bio-length">{{ 160 - bio.length }}</span>
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
            :disable="!bio.length"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
//   import { useRouter } from "vue-router";

//   const router = useRouter();
const bio = ref("");
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
