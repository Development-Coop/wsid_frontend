<template>
  <q-page :class="{'q-pb-xl': !isPopup, 'custom-page': isPopup}">
    <div v-if="!isPopup" :class="['flex','justify-between','q-pa-md','sticky-header']">
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
      <div :class="['text-h6','text-weight-bold','text-uppercase', {'text-center': !isPopup}]">
        Ask Question
      </div>

      <div :class="{'q-mt-xl': !isPopup, 'q-mt-lg': isPopup}">
        <div class="q-gutter-y-md column">
          <q-input v-model="title" outlined label="Question" />
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

      <div :class="[{'q-mt-xl': !isPopup, 'q-mt-lg': isPopup, 'option-container-grid': isPopup && options.length > 2}, 'option-container']">
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
  }
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
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Image compression failed"));
        }
      }, file.type || "image/jpeg", 0.9); // Adjust quality as needed
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
    for (const file of files) {
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
    const optionsArray = await Promise.all(
      options.value.map(async (option, index) => {
        const fileFieldname = `file${index + 1}`;

        // Attach the image to FormData if available
        if (option.image && !(typeof option.image === "string" && option.image.startsWith("http"))) {
          const response = await fetch(option.image); // Fetch the image URL
          const blob = await response.blob();
          formData.append(fileFieldname, blob, `file${index + 1}`); // Append the file with the generated fieldname
        }

        // Return the option object structure for the backend
        return {
          text: option.text,
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
      emit("close")
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
      id: option.id
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
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 16px;
  }
}
.custom-page {
  display: grid;
  grid-template-rows: auto !important;
  min-height: fit-content !important;
}
</style>
