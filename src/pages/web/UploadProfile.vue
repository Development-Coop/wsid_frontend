<template>
  <div ref="confettiContainer" class="upload-profile">
    <div class="profile-wrapper">
      <!-- Heading and instruction text -->
      <div class="text-left main-wrapper">
        <h4 class="text-h5 text-weight-medium">Pick a profile picture</h4>
        <p>Have a favorite selfie? Upload it now</p>
      </div>

      <!-- Profile Picture Upload -->
      <div
        :class="['profile-container', { 'file-uploaded': !!profilePicture }]"
      >
        <q-img
          :src="profilePicture || placeholderImage"
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

    <!-- Canvas for confetti rendering -->
    <canvas ref="confettiCanvas" class="confetti-canvas"></canvas>

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
          :disable="!profilePicture"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
// import { useRouter } from "vue-router";
import confetti from "canvas-confetti";

// Setup router
// const router = useRouter();

// Refs for the profile picture and placeholder
const profilePicture = ref(null);
const placeholderImage = ref(
  new URL("../../assets/icons/placeholder-icon.svg", import.meta.url).href
);

// Refs for the confetti canvas and container
const confettiContainer = ref(null);
const confettiCanvas = ref(null);

// Function to upload profile picture
const uploadProfile = () => {
  document.querySelector('input[type="file"]').click();
};

// Trigger confetti inside the canvas element
const triggerConfetti = () => {
  nextTick(() => {
    if (confettiCanvas.value) {
      confetti.create(confettiCanvas.value, {
        resize: true, // Resize to fit the container
        useWorker: true, // Use a worker for better performance
      })({
        particleCount: 150,
        spread: 60,
        origin: { x: 0, y: 0.6 },
      });
    }
  });
};

// Handle file input and update profile picture
const onFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      profilePicture.value = reader.result; // Update the picture source
    };
    // Trigger the confetti animation once the picture is uploaded
    triggerConfetti();
    reader.readAsDataURL(file);
  }
};

// Function to set profile picture and move to the next page
// const setProfilePicture = () => {
//   router.push({ name: "add-bio" });
// };
</script>

<style scoped lang="scss">
.upload-profile {
  position: relative;
  display: grid;
	min-width: 400px;
	@media screen and (max-width: 557px) {
    min-width: 300px;
  }

  .confetti-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none; /* Make sure the canvas doesn't interfere with input */
  }

  .profile-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .main-wrapper {
    position: relative;
    width: 100%;
    display: grid;
    grid-gap: 4px;
    margin-bottom: 12px;
    p,
    h4 {
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
    margin-top: 40px;
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
