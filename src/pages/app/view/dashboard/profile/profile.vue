<template>
  <q-page>
    <div class="q-pa-lg">
      <div class="flex justify-end">
        <q-icon size="24px" class="q-mr-md">
          <img src="~src/assets/icons/edit.svg" alt="edit" />
        </q-icon>
        <q-icon size="24px">
          <img src="~src/assets/icons/settings.svg" alt="settings" />
        </q-icon>
      </div>
      <div class="flex no-wrap items-center profile-wrapper">
        <q-img
          class="profile-img"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwme89cM8YZvHcybGrZl_Obd9U9p5QabozJQ&s"
        />
        <div>
          <p class="text-h6 text-weight-medium">Alex Doe</p>
          <p class="text-grey-7">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
          </p>
        </div>
      </div>
      <div class="flex justify-around q-my-lg">
        <div class="text-center">
          <p class="text-h6 text-weight-medium text-primary">122</p>
          <p>Followers</p>
        </div>
        <div class="text-center">
          <p class="text-h6 text-weight-medium text-primary">122</p>
          <p>Following</p>
        </div>
        <div class="text-center">
          <p class="text-h6 text-weight-medium text-primary">37k</p>
          <p>Likes</p>
        </div>
      </div>
    </div>
    <q-card flat>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="Posts" label="Posts" />
        <q-tab name="Activity" label="Activity" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel class="q-pa-lg" name="Posts">
          <div
            v-if="!posts.length"
            class="text-center flex flex-col justify-center items-center h-full"
          >
            <div class="text-h6 text-weight-bold">Ask Question</div>
            <p class="q-mb-md text-grey-7">You don't have any posts yet</p>
            <q-btn
              v-motion-pop
              :delay="100"
              no-caps
              size="md"
              to="/app/ask-question"
              label="Ask Question"
              color="primary"
              unelevated
            />
          </div>
        </q-tab-panel>

        <q-tab-panel class="q-pa-lg" name="Activity">
          <div class="text-h6">Activity</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
const tab = ref("Posts");
const posts = ref([]);
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
