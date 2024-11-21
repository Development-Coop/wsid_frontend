<template>
  <q-page class="q-pa-lg">
    <q-btn
      dense
      no-caps
      block
      unelevated
      class="justify-self-start align-self-start"
      style="border-radius: 0px"
      :to="{ path: '/app/auth' }"
    >
      <q-icon v-motion-pop-visible :delay="300" size="24px">
        <img src="~src/assets/icons/arrow-left.svg" alt="logo" />
      </q-icon>
    </q-btn>
    <div>
      <div>
        <h4 class="text-h4 text-center text-weight-medium q-mb-xl">
          Create your account
        </h4>

        <!-- Form structure with a gap of 16px -->
        <q-form class="q-gutter-md">
          <q-input
            v-model="authStore.userDetails.name"
            outlined
            placeholder="Name"
            :error="!!errors.name"
          />
          <q-input
            v-model="authStore.userDetails.phone_or_email"
            outlined
            placeholder="Email address"
            :error="!!errors.phone_or_email"
          />
          <q-input
            v-model="authStore.userDetails.dob"
            outlined
            label="Date of birth"
            readonly
            placeholder="Date of birth"
            :error="!!errors.dob"
          >
            <template #append>
              <q-icon
                name="event"
                class="cursor-pointer"
                @click="showPopup = true"
              />
            </template>

            <q-popup-proxy
              v-model="showPopup"
              transition-show="scale"
              transition-hide="scale"
            >
              <!-- Date picker with max date set to today -->
              <q-date
                v-model="authStore.userDetails.dob"
                mask="DD-MM-YYYY"
                :max="today"
              />
            </q-popup-proxy>
          </q-input>
        </q-form>
      </div>

      <!-- Button container with center alignment -->
      <div class="flex justify-center">
        <q-btn
          v-motion-pop
          class="q-px-xl"
          no-caps
          block
          unelevated
          color="primary"
          label="Next"
          :loading="isLoading"
          @click="handleSubmit"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/authstore";
// Helper
import { isValidEmail } from "src/utils/helper";
import { useQuasar } from "quasar";

const router = useRouter();
const authStore = useAuthStore();

const errors = ref({
  name: "",
  phone_or_email: "",
  dob: "",
});
const isLoading = ref(false);

const today = ref(new Date().toISOString().split("T")[0]);
const showPopup = ref(false);
const $q = useQuasar();

const parseDate = (dateString) => {
  const [day, month, year] = dateString.split("-");
  return new Date(`${year}-${month}-${day}`);
};

// Validation function
const validateForm = () => {
  let isValid = true;

  // Reset error messages
  errors.value = {
    name: "",
    phone_or_email: "",
    dob: "",
  };

  // Validate name
  if (!authStore.userDetails.name.trim()) {
    errors.value.name = "Name is required.";
    isValid = false;
  }

  // Validate phone or email
  if (!authStore.userDetails.phone_or_email.trim()) {
    errors.value.phone_or_email = "Email is required.";
    isValid = false;
  } else if (
    !isValidEmail(authStore.userDetails.phone_or_email)
  ) {
    errors.value.phone_or_email = "Enter a valid Email.";
    isValid = false;
  }

  // Validate date of birth (dob)
  if (!authStore.userDetails.dob) {
    errors.value.dob = "Date of birth is required.";
    isValid = false;
  } else {
    const today = new Date().toISOString().split("T")[0];
    const dob = parseDate(authStore.userDetails.dob);
    if (dob > new Date(today)) {
      errors.value.dob = "Date of birth cannot be in the future.";
      isValid = false;
    }
  }

  return isValid;
};

// Updated function to handle form submission
const handleSubmit = async () => {
  if (validateForm()) {
    isLoading.value = true;
    const res = await authStore.registerStep1(authStore.userDetails);
    isLoading.value = false;
    if (!res?.status) {
      $q.notify({
        color: "negative",
        message: res,
        position: "top",
        icon: "error",
      });
    } else {
      router.push({
        name: "otp-verification",
        query: { contactDetail: authStore.userDetails.phone_or_email.trim() },
      });
    }
  } else {
    console.log("Form is invalid, check errors.", errors.value);
  }
};
</script>

<style scoped lang="scss">
.q-page {
  display: grid;
  grid-template-rows: 80px 1fr;
  & > div {
    &:nth-child(2) {
      display: grid;
      grid-template-rows: 1fr auto;
      gap: 40px;
    }
  }
  :deep(.q-form) {
    /* Override dashed border for readonly q-inputs with outlined style */
    .q-field--outlined.q-field--readonly .q-field__control:before {
      border-style: solid !important; /* Force solid border */
      border-width: 1px !important; /* Adjust thickness to match other inputs */
      border-color: rgba(
        0,
        0,
        0,
        0.24
      ) !important; /* Adjust color to match theme */
    }
    .q-field__bottom {
      display: none;
    }
    .q-field--with-bottom {
      padding-bottom: 0;
    }
  }
}
</style>
