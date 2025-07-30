<template>
  <q-page :class="{ 'q-pb-xl': !isPopup, 'custom-page': isPopup }">
    <div
      v-if="!isPopup"
      :class="['flex', 'justify-between', 'q-pa-md', 'sticky-header']"
    >
      <q-btn
        flat
        round
        dense
        icon="arrow_back"
        color="grey-8"
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
      <div
        :class="[
          'text-h6',
          'text-weight-bold',
          'text-uppercase',
          { 'text-center': !isPopup },
        ]"
      >
        Ask Question
      </div>

      <div :class="{ 'q-mt-xl': !isPopup, 'q-mt-lg': isPopup }">
        <div class="q-gutter-y-md column">
          <q-input
            v-model="title"
            outlined
            label="Question"
            maxlength="70"
            counter
            :rules="[
              (val) =>
                val.length >= 3 || 'Question must be at least 3 characters',
              (val) =>
                val.length <= 70 || 'Question cannot exceed 70 characters',
            ]"
          />
          <q-input
            v-model="description"
            type="textarea"
            outlined
            label="Description (Optional)"
            maxlength="1000"
            counter
            class="description-textarea"
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

      <div
        :class="[
          {
            'q-mt-xl': !isPopup,
            'q-mt-lg': isPopup,
            'option-container-grid': isPopup && options.length > 2,
          },
          'option-container',
        ]"
      >
        <div
          v-for="(option, index) in options"
          :key="index"
          class="option-item"
        >
          <q-input
            v-model="option.text"
            outlined
            :label="String.fromCharCode(65 + index) + '.'"
            maxlength="100"
            counter
            :rules="[
              (val) =>
                val.length >= 2 || 'Choice must be at least 2 characters',
              (val) =>
                val.length <= 100 || 'Choice cannot exceed 100 characters',
            ]"
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
              <q-btn
                v-if="options.length > 2"
                round
                dense
                flat
                icon="delete"
                color="negative"
                @click="removeChoice(index)"
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
        :disable="options.length >= 4"
        @click="addOption"
      >
        + Add Choice
      </q-btn>
      <div class="q-mt-lg flex self-end justify-center">
        <q-btn
          v-if="isPopup"
          no-caps
          unelevated
          size="md"
          color="primary"
          label="Submit"
          @click="createPost"
        />
      </div>
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
  { text: "", image: null, id: "" },
  { text: "", image: null, id: "" },
]); // Initialize with two empty options
const $q = useQuasar();
const postStore = usePostStore();

const props = defineProps({
  postId: {
    type: String,
    default: "",
  },
  isPopup: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["close"]);

const compressImage = (file, maxWidth, maxHeight) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      let width = img.width;
      let height = img.height;

      // Maintain aspect ratio
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        } else {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      // Convert the canvas content to a data URL
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Image compression failed"));
          }
        },
        file.type || "image/jpeg",
        0.9
      ); // Adjust quality as needed
    };

    img.onerror = () => reject(new Error("Image loading failed"));

    reader.readAsDataURL(file);
  });
};

const uploadDescriptionImages = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.multiple = true;
  input.accept = "image/*";
  input.onchange = async (event) => {
    const files = Array.from(event.target.files);
    const remainingSlots = 4 - descriptionImages.value.length;

    if (remainingSlots <= 0) {
      $q.notify({
        color: "negative",
        message: "Maximum 4 images allowed in description",
        position: "top",
        icon: "error",
        autoClose: true,
      });
      return;
    }

    const filesToProcess = files.slice(0, remainingSlots);
    for (const file of filesToProcess) {
      try {
        const compressedBlob = await compressImage(file, 1280, 720);
        const reader = new FileReader();
        reader.onload = () => {
          descriptionImages.value.push(reader.result);
        };
        reader.readAsDataURL(compressedBlob);
      } catch (error) {
        console.error("Image compression failed", error);
      }
    }

    if (files.length > remainingSlots) {
      $q.notify({
        color: "warning",
        message: `Only ${remainingSlots} image(s) were added. Maximum 4 images allowed.`,
        position: "top",
        icon: "warning",
        autoClose: true,
      });
    }
  };
  input.click();
};

const removeImage = (index) => {
  descriptionImages.value.splice(index, 1); // Remove image from the array
};

const uploadOptionImage = async (index) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const compressedBlob = await compressImage(file, 1280, 720);
        const reader = new FileReader();
        reader.onload = () => {
          options.value[index].image = reader.result;
        };
        reader.readAsDataURL(compressedBlob);
      } catch (error) {
        console.error("Image compression failed", error);
      }
    }
  };
  input.click();
};

const removeOptionImage = (index) => {
  options.value[index].image = null; // Remove image from the option
};

const addOption = () => {
  if (options.value.length < 4) {
    options.value.push({ text: "", image: null }); // Add a new empty option
  }
};

const removeChoice = (index) => {
  if (options.value.length > 2) {
    options.value.splice(index, 1);
  }
};

const createPost = async () => {
  Loading.show();
  try {
    // Validate title
    if (!title.value.trim()) {
      $q.notify({
        color: "negative",
        message: "Question should not be empty",
        position: "top",
        icon: "error",
        autoClose: true,
      });
      Loading.hide();
      return;
    }

    if (title.value.trim().length < 3) {
      $q.notify({
        color: "negative",
        message: "Question must be at least 3 characters",
        position: "top",
        icon: "error",
        autoClose: true,
      });
      Loading.hide();
      return;
    }

    if (title.value.trim().length > 70) {
      $q.notify({
        color: "negative",
        message: "Question cannot exceed 70 characters",
        position: "top",
        icon: "error",
        autoClose: true,
      });
      Loading.hide();
      return;
    }

    // Validate number of options
    if (options.value.length < 2) {
      $q.notify({
        color: "negative",
        message: "Please add at least 2 choices",
        position: "top",
        icon: "error",
        autoClose: true,
      });
      Loading.hide();
      return;
    }

    if (options.value.length > 4) {
      $q.notify({
        color: "negative",
        message: "Maximum 4 choices allowed",
        position: "top",
        icon: "error",
        autoClose: true,
      });
      Loading.hide();
      return;
    }

    // Validate that all options have text and meet length requirements
    const invalidOptions = options.value.filter((option) => {
      const text = option.text.trim();
      return !text || text.length < 2 || text.length > 100;
    });

    if (invalidOptions.length > 0) {
      let message = "";
      if (options.value.length < 2) {
        message = "Please add at least 2 choices.";
      } else {
        message = "Each choice must be between 2 and 100 characters.";
      }
      $q.notify({
        color: "negative",
        message,
        position: "top",
        icon: "error",
        autoClose: true,
      });
      Loading.hide();
      return;
    }

    // Prepare form data
    const formData = new FormData();

    // Add title
    formData.append("title", title.value);

    // Add description
    formData.append("description", description.value);

    // Add options as a JSON string and files dynamically
    const optionsArray = await Promise.all(
      options.value.map(async (option, index) => {
        const fileFieldname = `file${index + 1}`;

        // Attach the image to FormData if available
        if (
          option.image &&
          !(typeof option.image === "string" && option.image.startsWith("http"))
        ) {
          const response = await fetch(option.image); // Fetch the image URL
          const blob = await response.blob();
          formData.append(fileFieldname, blob, `file${index + 1}`); // Append the file with the generated fieldname
        }

        // Return the option object structure for the backend
        return {
          text: option.text,
          order: index + 1, // Add order field to maintain sequence
          ...(option.image ? { fileName: fileFieldname } : {}),
          ...(option?.id ? { id: option.id } : {}),
        };
      })
    );

    // Add the resolved `optionsArray` to FormData
    formData.append("options", JSON.stringify(optionsArray));

    // Add postImages (multiple images)
    await Promise.all(
      descriptionImages.value.map(async (image) => {
        if (typeof image === "string" && image.startsWith("http")) {
          // Ignore the image if it's already a link
          return;
        }
        const response = await fetch(image);
        const blob = await response.blob();
        formData.append("postImages", blob);
      })
    );

    const postId = route.query.postId || props?.postId;
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
      // Try to get the latest post (assume backend returns the new post or fetch it)
      // Option 1: If backend returns the new post, use it
      // Option 2: Otherwise, fetch the latest post from the API
      let newPost = null;
      try {
        // Try to fetch the latest post (assuming user is the creator)
        const posts = await postStore.getPostList({
          all: true,
          page: 1,
          limit: 1,
          sortBy: "createdAt",
          order: "desc",
        });
        if (posts && posts.length > 0) {
          newPost = posts[0];
          postStore.addNewPostToFeeds(newPost);
        }
      } catch (e) {
        // Fallback: do nothing if fetch fails
      }
      $q.notify({
        message: "Successfully posted!",
        color: "positive",
        position: "top",
        timeout: 3000,
        icon: "check_circle",
      });
    }
    if (!props.isPopup) {
      router.back();
    } else {
      emit("close");
    }
  } catch (e) {
    console.log(e);
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
      id: option.id,
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
  const postId = route?.query?.postId || props?.postId;
  if (postId) {
    await fetchPostDetails(postId);
  }
});
</script>

<style scoped lang="scss">
.q-page {
  height: 100%;
  overflow-y: auto; // Ensures vertical scrolling is enabled
  -webkit-overflow-scrolling: touch;
}
.option-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  &-grid {
    display: grid;
    grid-gap: 16px;
  }
}
.custom-page {
  display: grid;
  grid-template-rows: auto !important;
  min-height: fit-content !important;
}
.description-textarea {
  :deep(.q-field__native) {
    white-space: pre-wrap !important;
  }
}
</style>
