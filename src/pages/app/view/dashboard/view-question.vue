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
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos labore
            quaerat laudantium numquam necessitatibus fuga dolore natus totam
            veritatis veniam.
          </p>

          <div
            class="flex q-gutter-md q-mt-sm"
            style="border-top: 1px solid #dddddd"
          >
            <q-img
              loading="lazy"
              src="https://picsum.photos/300/200"
              spinner-color="primary"
              spinner-size="20px"
              fit="cover"
              style="
                width: 58px;
                height: 58px;
                border-radius: 4px;
                cursor: pointer;
              "
              @click="showImage('https://picsum.photos/300/200')"
            />
            <q-img
              loading="lazy"
              src="https://picsum.photos/300/200"
              spinner-color="primary"
              spinner-size="20px"
              fit="cover"
              style="
                width: 58px;
                height: 58px;
                border-radius: 4px;
                cursor: pointer;
              "
              @click="showImage('https://picsum.photos/300/200')"
            />
            <q-img
              loading="lazy"
              src="https://picsum.photos/300/200"
              spinner-color="primary"
              spinner-size="20px"
              fit="cover"
              style="
                width: 58px;
                height: 58px;
                border-radius: 4px;
                cursor: pointer;
              "
              @click="showImage('https://picsum.photos/300/200')"
            />
          </div>
        </div>
      </div>
    </div>
    <q-card flat style="border-top: 1px solid #dddddd">
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

      <q-tab-panels v-model="tab" class="q-pb-lg">
        <q-tab-panel class="q-pa-lg" name="Votes">
          <div class="q-gutter-md q-mb-xl">
            <q-card
              v-for="option in voteOptions"
              :key="option.id"
              class="vote-options"
              :class="{ 'selected-option': selectedVote === option.id }"
              flat
              @click="showVotesResult(option.id)"
            >
              {{ option.label }}
              <q-img
                loading="lazy"
                src="https://picsum.photos/300/200"
                spinner-color="primary"
                spinner-size="20px"
                fit="cover"
                style="
                  width: 58px;
                  height: 58px;
                  border-radius: 4px;
                  cursor: pointer;
                "
              />
            </q-card>
          </div>
          <div v-if="selectedVote" class="q-gutter-md">
            <q-card class="votes-result" flat>
              <div class="flex items-center justify-between w-full">
                <span class="q-mr-md">{{
                  voteOptions.find((option) => option.id === selectedVote).label
                }}</span>
                <span class="q-ml-auto q-mr-md">{{
                  voteOptions.find((option) => option.id === selectedVote)
                    .percentage
                }}%</span>
                <span>•</span>
                <span class="q-ml-md">{{
                  voteOptions.find((option) => option.id === selectedVote)
                    .votes
                }}
                  Votes</span>
              </div>
              <q-linear-progress
                size="8px"
                :value="
                  voteOptions.find((option) => option.id === selectedVote)
                    .percentage / 100
                "
              />
            </q-card>
          </div>
        </q-tab-panel>
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
              <p class="text-grey-9">
                <span>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad,
                  suscipit!
                </span>
              </p>
              <p class="flex items-center q-mt-sm q-mb-md">
                <span class="q-mr-md cursor-pointer">Reply</span>
                <span class="q-mr-md flex items-center cursor-pointer">
                  <img
                    src="../../../../assets/icons/happy.svg"
                    alt="like-icon"
                    srcset=""
                    class="q-mr-xs"
                  />
                  2
                </span>
                <span class="q-mr-sm flex items-center">
                  <img
                    src="../../../../assets/icons/sad.svg"
                    alt="like-icon"
                    srcset=""
                    class="q-mr-xs"
                  />2
                </span>
              </p>
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
                  <p class="text-grey-9 q-mb-sm">
                    <span>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Ad, suscipit!
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="q-pa-md fixed w-full bg-white" style="bottom: 0; left: 0">
            <q-input v-model="text" outlined>
              <template #after>
                <q-btn
                  round
                  dense
                  color="primary"
                  unelevated
                  icon="north_east"
                />
              </template>
            </q-input>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <q-dialog v-model="dialog" @hide="closeDialog">
      <q-img :src="imageSrc" spinner-color="primary" spinner-size="22px" />
    </q-dialog>
  </q-page>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
const router = useRouter();
const tab = ref("Votes");
const text = ref("");
const dialog = ref(false); // Control dialog visibility
const imageSrc = ref(""); // Store image source
const selectedVote = ref(null); // Track the selected vote option

// Dummy options for votes
const voteOptions = ref([
  { id: 1, label: "Option A", percentage: 30, votes: 100 },
  { id: 2, label: "Option B", percentage: 50, votes: 150 },
  { id: 3, label: "Option C", percentage: 15, votes: 45 },
  { id: 4, label: "Option D", percentage: 5, votes: 5 },
]);

const showImage = (src) => {
  imageSrc.value = src; // Set the image source
  dialog.value = true; // Open the dialog
};

const closeDialog = () => {
  dialog.value = false; // Close the dialog
};

const showVotesResult = (option) => {
  selectedVote.value = option; // Set the selected option
};
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
.vote-options {
  height: 60px;
  border: 1px solid #dfe2e8;
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 16px 0px 16px 16px;
  justify-content: space-between;
  font-weight: 500;

  &.selected-option {
    background-color: #f49d37;
    color: #fff;
  }
}
.votes-result {
  height: 48px;
  background-color: #f0f2f5;
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 10px;
  font-weight: 500;
  .q-linear-progress {
    position: absolute;
    bottom: 0;
    left: 0px;
  }
}
</style>
