<template>
  <q-page>
    <img
      v-if="user?.coverPic"
      :src="user?.coverPic"
      alt=""
      class="cover-img"
      style="height: 150px; width: 100%; object-fit: cover"
    />
    <div class="q-px-lg q-py-md">
      <div class="flex justify-end">
        <q-btn flat no-caps size="xs" to="/app/profile/edit-profile">
          <q-icon size="24px">
            <img src="~src/assets/icons/edit.svg" alt="edit" />
          </q-icon>
        </q-btn>
        <q-btn flat no-caps size="xs" to="/app/profile/settings">
          <q-icon size="24px">
            <img src="~src/assets/icons/settings.svg" alt="settings" />
          </q-icon>
        </q-btn>
      </div>
      <div class="flex no-wrap items-center profile-wrapper">
        <q-img class="profile-img" :src="user?.profilePic" />
        <div>
          <p class="text-h6 text-weight-medium">{{ user?.name }}</p>
          <p class="text-grey-7">
            {{ user?.bio }}
          </p>
        </div>
      </div>
      <div class="flex justify-around q-my-lg">
        <div class="text-center">
          <p class="text-h6 text-weight-medium text-primary">
            {{ user?.followersCount }}
          </p>
          <p>Followers</p>
        </div>
        <div class="text-center">
          <p class="text-h6 text-weight-medium text-primary">
            {{ user?.followingCount }}
          </p>
          <p>Following</p>
        </div>
        <div class="text-center">
          <p class="text-h6 text-weight-medium text-primary">
            {{ user?.likesCount }}
          </p>
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
          <div v-else class="post-wrapper">
            <Posts
              v-for="post in posts"
              :key="post.id"
              class="q-pa-md"
              :post-id="post.id"
              :user-image="post.user.profilePicUrl"
              :user-id="post.user.id"
              :username="post.user.name"
              :time-ago="post.timeAgo"
              :post-content="post.description"
              :post-images="post.images"
              :votes="post.votesCount"
              :comments="post.commentsCount"
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
import { ref, computed, onMounted } from "vue";
import { useProfileStore } from "src/stores/profileStore";
import { usePostStore } from "src/stores/postStore";
import { useQuasar, Loading } from "quasar";
import Posts from "../../../components/posts.vue";

const tab = ref("Posts");
const posts = ref([]);
const profileStore = useProfileStore();
const $q = useQuasar();
const postStore = usePostStore();

const user = computed(() => {
  return JSON.parse(JSON.stringify(profileStore?.userDetails));
});

const handleSubmit = async () => {
  Loading.show();
  try {
    await profileStore.getProfileDetails();
  } catch (error) {
    $q.notify({
      color: "negative",
      message:
        error.response?.data?.message ||
        "Something went wrong!. Please try again.",
      position: "top",
      icon: "error",
      autoClose: true,
    });
  } finally {
    Loading.hide();
  }
};

onMounted(async () => {
  if (!user.value?.name) {
    await handleSubmit();
  }
  posts.value = await postStore.getPostList()
});
</script>

<style scoped lang="scss">
.q-page {
  display: grid;
  grid-template-rows: auto 1fr;
  .q-tab-panels {
    background-color: #f1efef;
    height: 100%;
    min-height: 400px;
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
