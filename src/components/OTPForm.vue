<template>
  <div class="otp-container">
    <h4>Enter OTP</h4>
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
          style="width: 54px; height: 48px; text-align: center"
          @keydown="handleKeydown(index, $event)"
          @update:model-value="handleInput(index, $event)"
        />
      </div>
    </div>
    <div class="button-container">
      <q-btn
        block
        label="Next"
        :color="isCodeValid ? 'primary' : 'grey'"
        unelevated
        :class="{ 'btn-active': isCodeValid }"
        :disable="!isCodeValid"
        @click="getOtp"
      />
    </div>

    <div v-if="!isCodeValid" class="notification-container">
      <p>We sent you a code</p>
      <span>Enter it to verify {{ email }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, computed } from "vue";
import { useRouter } from "vue-router";

defineProps({
  email: {
    type: String,
    default: "",
  },
});

const router = useRouter();
// const route = useRoute();
const otp = ref(new Array(6).fill(""));
const otpInput = ref([]);

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
  router.push({ name: "web-set-username" });
};
</script>

<style lang="scss" scoped>
.otp-container {
  margin-top: 32px;
  display: grid;
  h4 {
    color: rgba(38, 32, 59, 1);
    font-size: 16px;
    font-weight: 500;
  }
  .button-container {
    display: grid;
    margin-top: 24px;
    :deep(.q-btn__content) {
      color: #000;
      text-transform: none;
      font-size: 18px;
    }
    .btn-active {
      :deep(.q-btn__content) {
        color: #fff;
      }
    }
  }
  .notification-container {
    background: rgba(224, 251, 224, 1);
    border-radius: 8px;
    padding: 16px;
    margin-top: 32px;
    border: 1px solid rgba(127, 206, 125, 1);
    p {
      color: rgba(38, 32, 59, 1);
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    span {
      font-family: SF Pro;
      font-size: 16px;
      font-weight: 400;
      line-height: 25.6px;
      text-align: left;
    }
  }
  :deep(.q-field__control) {
    height: 42px;
    input {
      text-align: center;
      font-size: 24px;
    }
  }
}
</style>
