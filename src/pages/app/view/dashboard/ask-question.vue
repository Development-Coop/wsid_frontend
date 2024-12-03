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
        @click="createPost"
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
              style="top: 2px; right: 2px; cursor: pointer"
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
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useQuasar, Loading } from "quasar";
import { usePostStore } from "src/stores/postStore";

const router = useRouter();
const route = useRoute();
const title = ref(""); // Separate ref for Title/Question
const description = ref(""); // Separate ref for Description
const descriptionImages = ref([]);
const options = ref([
  { text: "", image: null },
  { text: "", image: null },
]); // Initialize with two empty options
const $q = useQuasar();
const postStore = usePostStore();

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

const createPost = async () => {
  Loading.show();
  try {
    // Prepare form data
    const formData = new FormData();

    // Add title
    formData.append("title", title.value);

    // Add description
    formData.append("description", description.value);

    // Add options as a JSON string and files dynamically
    const optionsArray = options.value.map((option, index) => {
      // Generate a unique fieldname for the file
      const fileFieldname = `file${index + 1}`;

      // Attach the file if it exists
      if (option.image) {
        formData.append(fileFieldname, option.image); // Append the file with the generated fieldname
      }

      // Return the structured object for the options array
      return {
        text: option.text,
        fileName: fileFieldname, // Map this fieldname for backend use
      };
    });

    formData.append("options", JSON.stringify(optionsArray));

    // Add postImages (multiple images)
    descriptionImages.value.forEach((image) => {
      formData.append("postImages", image);
    });

    const postId = route.query.postId;
    if (postId) {
      await postStore.updatePost(formData, postId);
      $q.notify({
        message: "Successfully updated!",
        color: "positive",
        position: "top",
        timeout: 3000,
        icon: "check_circle",
      });
    } else {
      await postStore.createPost(formData);
      $q.notify({
        message: "Successfully posted!",
        color: "positive",
        position: "top",
        timeout: 3000,
        icon: "check_circle",
      });
    }

    // Make API request
    router.back();
  } catch (e) {
    console.log(e)
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

const fetchPostDetails = async (postId) => {
  try {
    Loading.show();
    const postDetails = await postStore.getPostDetails(postId);
    // Populate the fields with fetched data
    title.value = postDetails.title;
    description.value = postDetails.description;
    descriptionImages.value = postDetails.images || [];
    options.value = postDetails.options.map((option) => ({
      text: option.text,
      image: option.image,
    }));
  } catch (error) {
    $q.notify({
      color: "negative",
      message: "Failed to fetch post details. Please try again.",
      position: "top",
      icon: "error",
      autoClose: true,
    });
  } finally {
    Loading.hide();
  }
};

// Fetch post details if postId is present
onMounted(async () => {
  const postId = route.query.postId;
  if (postId) {
    await fetchPostDetails(postId);
  }
});
</script>

<style scoped lang="scss">
.option-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
