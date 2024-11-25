<template>
  <q-page>
    <div class="q-pa-lg">
      <div class="flex justify-between q-pb-lg">
        <q-btn
          style="min-width: 100px"
          no-caps
          label="Back"
          color="grey-12"
          text-color="black"
          unelevated
          to="/app/profile"
        />
        <q-btn
          style="min-width: 100px"
          no-caps
          label="Save"
          color="primary"
          unelevated
        />
      </div>
      <div class="q-gutter-y-lg">
        <q-input v-model="form.name" outlined label="Name" />
        <q-input v-model="form.username" outlined label="User Name" />
        <q-input
          v-model="form.dateOfBirth"
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
                <q-date v-model="dateOfBirth">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input v-model="form.bio" type="textarea" outlined label="Bio" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from "vue";
import { useProfileStore } from "src/stores/profileStore";
const profileStore = useProfileStore();

const user = computed(() => {
  return JSON.parse(JSON.stringify(profileStore?.userDetails));
});

const form = ref({
  name: user.value.name,
  dateOfBirth: user.value.dateOfBirth,
  username: user.value.username,
  password: "",
  bio: user.value.bio,
});
</script>

<style scoped lang="scss">
.q-page {
  display: grid;
  grid-template-rows: auto 1fr;
  .q-tab-panels {
    background-color: #f1efef;
    height: 100%;
  }
}
.profile-wrapper {
  gap: 20px;
  .profile-img {
    flex-shrink: 0;
    height: 100px;
    width: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #000;
  }
}
</style>
