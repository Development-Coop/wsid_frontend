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
      <q-btn
        no-caps
        block
        unelevated
        size="md"
        color="primary"
        label="Submit"
        style="width: 80px"
      />
    </div>
    <div class="q-ma-md">
      <div class="text-h6 text-weight-bold text-uppercase text-center">
        Ask Question
      </div>

      <div class="q-mt-xl">
        <div class="q-gutter-y-md column">
          <q-input v-model="title" outlined label="Title/Question" />
          <q-input
            v-model="description"
            type="textarea"
            outlined
            label="Description"
          >
            <template #append>
              <q-btn
                round
                dense
                flat
                icon="o_image"
                @click="uploadDescriptionImages"
              />
            </template>
          </q-input>
        </div>
        <div
          v-if="descriptionImages.length"
          class="flex q-mt-md"
          style="gap: 16px"
        >
          <q-img
            v-for="(image, index) in descriptionImages"
            :key="index"
            loading="lazy"
            :src="image"
            spinner-color="primary"
            spinner-size="20px"
            fit="cover"
            style="max-width: 58px; max-height: 58px"
          >
            <q-icon
              class="absolute all-pointer-events"
              size="18px"
              name="close"
              color="white"
              style="top: 2px; right: 2px"
              @click="removeImage(index)"
            >
            </q-icon>
          </q-img>
        </div>
      </div>

      <div class="option-container q-mt-xl">
        <div
          v-for="(option, index) in options"
          :key="index"
          class="option-item"
        >
          <q-input
            v-model="option.text"
            outlined
            :label="'Option ' + (index + 1)"
          >
            <template #append>
              <q-img
                v-if="option.image"
                :src="option.image"
                style="width: 40px; height: 40px; position: relative"
              >
                <q-icon
                  class="absolute all-pointer-events"
                  size="18px"
                  name="close"
                  color="white"
                  style="top: 2px; right: 2px"
                  @click="removeOptionImage(index)"
                />
              </q-img>
              <q-btn
                v-else
                round
                dense
                flat
                icon="o_image"
                @click="uploadOptionImage(index)"
              />
            </template>
          </q-input>
        </div>
      </div>

      <q-btn
        no-caps
        block
        unelevated
        color="grey-12"
        text-color="black"
        class="w-full q-mt-md"
        @click="addOption"
      >
        + Add Option
      </q-btn>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const title = ref(""); // Separate ref for Title/Question
const description = ref(""); // Separate ref for Description
const descriptionImages = ref([]);
const options = ref([
  { text: "", image: null },
  { text: "", image: null },
]); // Initialize with two empty options

const uploadDescriptionImages = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.multiple = true;
  input.accept = "image/*";
  input.onchange = (event) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        descriptionImages.value.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  };
  input.click();
};

const removeImage = (index) => {
  descriptionImages.value.splice(index, 1); // Remove image from the array
};

const uploadOptionImage = (index) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = (event) => {
    const file = event.target.files[0]; // Get the first file
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        options.value[index].image = e.target.result; // Store the image in the option
      };
      reader.readAsDataURL(file);
    }
  };
  input.click();
};

const removeOptionImage = (index) => {
  options.value[index].image = null; // Remove image from the option
};

const addOption = () => {
  options.value.push({ text: "", image: null }); // Add a new empty option
};
</script>

<style scoped lang="scss">
.option-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
