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
      @click="router.push({ name: 'set-user-id' })"
    >
      <q-icon v-motion-pop-visible :delay="300" size="24px">
        <img src="~src/assets/icons/arrow-left.svg" alt="logo" />
      </q-icon>
    </q-btn>

    <div>
      <div class="profile-wrapper">
        <!-- Heading and instruction text -->
        <div class="text-center main-wrapper">
          <h4 class="text-h5 text-weight-medium">Pick a profile picture</h4>
          <p>Have a favorite selfie? Upload it now</p>
        </div>

        <!-- Profile Picture Upload -->
        <div
          :class="[
            'profile-container',
            { 'file-uploaded': !!authStore.userDetails.profilePicture },
          ]"
        >
          <q-img
            :src="
              authStore.userDetails.profilePicture || authStore.placeholderImage
            "
            style="
              height: 150px;
              max-width: 150px;
              object-fit: cover;
              border-radius: 50%;
            "
            @click="uploadProfile"
          />

          <!-- Floating Button for Upload -->
          <div class="upload-button">
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="d-none"
              @change="onFileChange"
            />
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
            @click="navigateToAddBio"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/authstore";
import confetti from "canvas-confetti";

const router = useRouter();
const authStore = useAuthStore();

const uploadProfile = () => {
  document.querySelector('input[type="file"]').click();
};

// Function to trigger confetti animation
const triggerConfetti = () => {
  confetti({
    particleCount: 150,
    spread: 60,
    origin: { y: 0.6 },
  });
};

// Handle file input and update profile picture
const onFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    authStore.setProfilePicture(file);
    // Trigger the confetti animation once the picture is uploaded
    triggerConfetti();
  }
};

const navigateToAddBio = () => {
  router.push({ name: "add-bio" });
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

  .profile-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
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

  .profile-container {
    position: relative;
    width: 150px;
    height: 150px;
    :deep(.q-img__image) {
      cursor: pointer;
    }
    &.file-uploaded {
      :deep(.q-img__image) {
        border-radius: 50%;
        height: 150px;
        border: 1px solid #9fa3b3;
      }
    }
  }

  .upload-button {
    position: absolute;
    bottom: 0;
    right: 0;
  }

  input[type="file"] {
    display: none;
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
}
</style>
