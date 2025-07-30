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
            maxlength="20"
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
              <q-date
                v-model="authStore.userDetails.dob"
                mask="DD-MM-YYYY"
                :max="today"
                @update:model-value="onDateSelect"
              />
            </q-popup-proxy>
          </q-input>
        </q-form>
      </div>

      <!-- Button container with center alignment -->
      <div class="flex flex-col justify-center">
        <div class="terms q-mt-md flex items-center" style="align-items: center; flex-wrap: nowrap;">
          <q-checkbox v-model="termsAccepted" />
          <p>
            By signing up to create an account I accept WSID's
            <span
              ><a @click="router.push({ name: 'terms-conditions' })"
                >Terms of use</a
              >
              &
              <a @click="router.push({ name: 'privacy-policy' })"
                >Privacy Policy</a
              ></span
            >.
          </p>
        </div>
        <q-btn
          v-motion-pop
          class="q-px-xl"
          no-caps
          block
          unelevated
          color="primary"
          label="Next"
          :loading="isLoading"
          :disable="!termsAccepted"
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
const termsAccepted = ref(false);

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
  } else if (!isValidEmail(authStore.userDetails.phone_or_email)) {
    errors.value.phone_or_email = "Enter a valid Email.";
    isValid = false;
  }

  // Validate date of birth (dob) with age check
  if (!authStore.userDetails.dob) {
    errors.value.dob = "Date of birth is required.";
    isValid = false;
  } else {
    const minAgeDate = new Date();
    minAgeDate.setFullYear(minAgeDate.getFullYear() - 13);
    const dob = parseDate(authStore.userDetails.dob);

    if (dob > minAgeDate) {
      errors.value.dob = "You must be at least 13 years old to sign up";
      isValid = false;
    }
  }

  // Validate terms acceptance
  if (!termsAccepted.value) {
    $q.notify({
      message: "Please accept the terms and conditions to continue",
      color: "negative",
      position: "top",
      icon: "error",
    });
    isValid = false;
  }

  return isValid;
};

// Add new function to handle date selection
const onDateSelect = (date) => {
  const selectedDate = parseDate(date);
  const minAgeDate = new Date();
  minAgeDate.setFullYear(minAgeDate.getFullYear() - 13);

  if (selectedDate > minAgeDate) {
    $q.notify({
      color: "negative",
      message: "You must be at least 13 years old to sign up",
      position: "top",
      icon: "error",
    });
    authStore.userDetails.dob = null; // Clear the invalid date
  }
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
.terms {
  font-weight: 400;
  font-size: 16px;
  display: flex;
  align-items: start;
  justify-content: center;
  gap: 4px;
  margin-bottom: 20px;
  p {
    margin: 0;
    span {
      color: var(--q-primary);
      a {
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
