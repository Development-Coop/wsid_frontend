<template>
  <q-page class="q-pa-lg">
    <div></div>
    <div>
      <div class="profile-wrapper">
        <!-- Heading and instruction text -->
        <div class="text-center main-wrapper">
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
            @click="setProfilePicture"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const profilePicture = ref(null);
const placeholderImage = ref(
  new URL("../../../../../assets/icons/placeholder-icon.svg", import.meta.url)
    .href
);
const uploadProfile = () => {
  document.querySelector('input[type="file"]').click();
};

// Handle file input and update profile picture
const onFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      profilePicture.value = reader.result; // Update the picture source
    };
    reader.readAsDataURL(file);
  }
};

const setProfilePicture = () => {
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
