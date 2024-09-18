<template>
  <q-page class="q-pa-lg">
    <!-- Back Button at the top -->
    <q-btn
      dense
      no-caps
      block
      unelevated
      class="justify-self-start align-self-start"
      style="border-radius: 0px"
      @click="router.push({ name: 'registration' })"
    >
      <q-icon v-motion-pop-visible :delay="300" size="24px">
        <img src="~src/assets/icons/arrow-left.svg" alt="logo" />
      </q-icon>
    </q-btn>

    <div>
      <div>
        <!-- Heading and instruction text -->
        <div class="text-center q-mb-lg main-wrapper">
          <div v-motion-pop :delay="300" class="round-icon"></div>
          <h4 class="text-h5 text-weight-medium">We sent you a code</h4>
          <p>
            Enter it to verify <strong>{{ contactDetail }}</strong>
          </p>
        </div>

        <!-- Code Input Boxes (use q-input with narrow width or custom styling) -->
        <div class="flex justify-center q-mb-lg">
          <div class="flex">
            <q-input
              v-for="(digit, index) in otp"
              :key="index"
              :ref="setOtpInputRef(index)"
              v-model="otp[index]"
              v-motion-pop
              :delay="500"
              outlined
              maxlength="1"
              class="q-mx-xs code-box"
              style="width: 48px; height: 48px; text-align: center"
              @keydown="handleKeydown(index, $event)"
              @update:model-value="handleInput(index, $event)"
            />
          </div>
        </div>
      </div>
      <div class="button-container">
        <!-- Resend Code Link -->
        <p class="cursor-pointer">Didn’t receive OTP?</p>

        <!-- Submit Button (initially disabled) -->
        <div>
          <q-btn
            v-motion-pop
            :delay="700"
            block
            label="Next"
            color="primary"
            unelevated
            :disable="!isCodeValid"
            @click="getOtp"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref, nextTick, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const contactDetail = ref("");
const otp = ref(new Array(6).fill(""));
const otpInput = ref([]);

onMounted(() => {
  contactDetail.value = route?.query?.contactDetail;
  if (!contactDetail.value) router.go(-1);
  // setOtpInputRef();
});

// Computed property to check if all inputs are valid (filled)
const isCodeValid = computed(() => {
  return otp.value.every((digit) => digit !== "" && digit !== null);
});

// Function to store input element references dynamically
const setOtpInputRef = (index) => (el) => {
  otpInput.value[index] = el;
};

// Handle input for moving between inputs
const handleInput = (index, event) => {
  const value = event;

  if (value.match(/^[0-9]$/) && index < 5) {
    nextTick(() => {
      otpInput.value[index + 1].focus();
    });
  }
};

// Handle keydown for moving between inputs, especially for backspace
const handleKeydown = (index, event) => {
  const key = event.key;
  if (
    !(
      key.match(/^[0-9]$/) || // Allow digits
      key === "Backspace" || // Allow backspace for deletion
      key === "ArrowLeft" || // Allow arrow navigation
      key === "ArrowRight" ||
      key === "Tab"
    )
  ) {
    event.preventDefault(); // Prevent non-numeric and non-navigation keys
    return;
  }

  if (key === "Backspace") {
    if (otp.value[index] === "" && index > 0) {
      // Move back if the current field is empty and user presses backspace
      otp.value[index - 1] = ""; // Clear the previous field
      nextTick(() => otpInput.value[index - 1].focus());
    } else {
      // Clear the current field on backspace
      otp.value[index] = "";
    }
  }
};

// Function to combine the OTP and display it
const getOtp = () => {
  // Join all the elements to form a single OTP string
  const otpString = otp.value.join("");
  console.log("Entered OTP:", otpString);
  router.push({ name: "set-password" });
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
  .round-icon {
    height: 48px;
    width: 48px;
    background: #dfe2e8;
    border-radius: 50%;
    position: absolute;
    display: grid;
    align-self: flex-start;
    justify-self: center;
    place-content: center;
    top: -50%;
  }
  .main-wrapper {
    position: relative;
    width: 100%;
    display: grid;
    grid-gap: 24px;
    padding-top: 24px;
    p {
      font-size: 16px;
    }
  }
  .button-container {
    display: grid;
    grid-gap: 24px;
    p {
      margin: 0;
      font-size: 16px;
    }
    button {
      width: 100%;
    }
  }
  :deep(.q-field__control) {
    height: 84px;
    input {
      text-align: center;
      font-size: 24px;
    }
  }
}
</style>
