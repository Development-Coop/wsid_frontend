<template>
  <q-page class="q-pb-xl">
    <div class="flex justify-between q-pa-md sticky-header">
      <q-btn
        no-caps
        block
        unelevated
        size="md"
        color="grey-12"
        text-color="black"
        label="Back"
        style="width: 80px"
        @click="router.back()"
      />
    </div>
    <div class="q-pa-md">
      <div class="flex no-wrap post">
        <q-img
          class="post-img"
          src="https://avatar.iran.liara.run/public/girl"
          spinner-color="primary"
          spinner-size="22px"
        />
        <div style="flex-grow: 1">
          <p>
            <span class="text-weight-medium">John Doe</span>
            <!-- Dynamic username -->
            <span class="text-grey-7"> • 1 hour ago</span>
            <!-- Dynamic time -->
          </p>
          <p class="text-grey-9 q-mb-sm">
            <span>What is the capital of France?</span>
          </p>
          <q-img
            src="https://picsum.photos/300/200"
            spinner-color="white"
            fit="contain"
          />
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
        <q-tab name="Votes" label="Votes (3)" />
        <q-tab name="Comments" label="Comments (1)" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel class="q-pa-lg" name="Votes"> NO DATA </q-tab-panel>
        <q-tab-panel class="q-pa-lg" name="Comments">
          <div class="flex no-wrap post">
            <q-img
              class="post-img"
              src="https://avatar.iran.liara.run/public/girl"
              spinner-color="primary"
              spinner-size="22px"
            />
            <div style="flex-grow: 1">
              <p>
                <span class="text-weight-medium">Kal Azar</span>
                <span class="text-grey-7"> • 30 mins ago</span>
              </p>
              <p class="text-weight-medium text-weight-bold">
                Choose Option B: Figma
              </p>
              <p class="text-grey-9 q-mb-sm">
                <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad,
                  suscipit!</span>
              </p>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
const router = useRouter();
const tab = ref("Comments");
</script>

<style scoped lang="scss">
.post {
  gap: 16px;
  .post-img {
    flex-shrink: 0;
    height: 44px;
    width: 44px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #aeaeb2;
  }
}
:deep(.q-tab__label) {
  text-transform: none;
}
</style>
