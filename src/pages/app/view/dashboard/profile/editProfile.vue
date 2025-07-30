<template>
  <q-page :class="{ 'custom-page': isPopup }">
    <div class="q-pa-lg">
      <div
        v-if="!isPopup"
        :class="['flex', 'justify-between', { 'q-pb-lg': !isPopup }]"
      >
        <q-btn
          flat
          round
          dense
          icon="arrow_back"
          color="grey-8"
          to="/app/profile"
        />
        <q-btn
          style="width: 80px"
          no-caps
          label="Save"
          color="primary"
          unelevated
          block
          size="md"
          @click="updateDetails"
        />
      </div>
      <div class="q-gutter-y-lg grid">
        <div class="profile-wrapper">
          <!-- Profile Picture -->
          <q-img
            :src="form.profilePic"
            class="profile-container"
            spinner-color="white"
            fit="cover"
          />

          <!-- Edit Button -->
          <div class="edit-icon" @click="uploadProfile">
            <q-icon name="edit" size="24px" color="white" />
          </div>

          <!-- Hidden File Input -->
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="d-none"
            @change="onFileChange"
          />
        </div>
        <q-input v-model="form.name" outlined label="Name" />
        <q-input v-model="form.username" outlined label="User Name" />
        <q-input
          v-model="form.dateOfBirth"
          label="Date of birth"
          outlined
          mask="date"
          :rules="['date']"
        >
          <template #append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="form.dateOfBirth">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input v-model="form.bio" type="textarea" outlined label="Bio" />
        <div class="q-mt-lg flex self-end justify-center">
          <q-btn
            v-if="isPopup"
            no-caps
            unelevated
            size="md"
            color="primary"
            label="Submit"
            @click="updateDetails"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useProfileStore } from "src/stores/profileStore";
import { useQuasar, Loading } from "quasar";
import { useRouter } from "vue-router";

const $q = useQuasar();
const profileStore = useProfileStore();
const router = useRouter();

const props = defineProps({
  isPopup: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["close"]);

const user = computed(() => {
  return JSON.parse(JSON.stringify(profileStore?.userDetails));
});

const form = ref({
  name: user?.value?.name,
  dateOfBirth: user?.value?.dateOfBirth,
  username: user?.value?.username,
  bio: user?.value?.bio,
  profilePic: user?.value?.profilePic,
});

const onFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      form.value.profilePic = reader.result;
    };
    reader.readAsDataURL(file);
  }
};

watch(
  user,
  (newValue) => {
    form.value = {
      name: newValue?.name || "",
      dateOfBirth: newValue?.dateOfBirth || "",
      username: newValue?.username || "",
      bio: newValue?.bio || "",
      profilePic: newValue?.profilePic || "",
    };
  },
  { immediate: true }
);

const uploadProfile = () => {
  document.querySelector('input[type="file"]').click();
};

const updateDetails = async () => {
  try {
    Loading.show();
    await profileStore.updateProfileDetails(form.value);
    $q.notify({
      message: "Successfully updated!",
      color: "positive",
      position: "top",
      timeout: 3000,
      icon: "check_circle",
    });
    if (props.isPopup) {
      emit("close");
    } else {
      router.back();
    }
  } catch (e) {
    $q.notify({
      color: "negative",
      message:
        e?.response?.data?.message ||
        "Something went wrong!. Please try again.",
      position: "top",
      icon: "error",
      autoClose: true,
    });
  } finally {
    Loading.hide();
  }
};
</script>

<style scoped lang="scss">
.q-page {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
  overflow-y: auto; // Ensures vertical scrolling is enabled
  -webkit-overflow-scrolling: touch;

  .q-tab-panels {
    background-color: #f1efef;
    height: 100%;
  }
}

.profile-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  justify-self: center;
}

.profile-container {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.edit-icon {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background-color: #007bff; /* Adjust color to match your theme */
  border-radius: 50%;
  padding: 6px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-icon:hover {
  background-color: #0056b3; /* Slightly darker color on hover */
}

.d-none {
  display: none;
}
.custom-page {
  display: grid;
  grid-template-rows: auto !important;
  min-height: fit-content !important;
}
</style>
