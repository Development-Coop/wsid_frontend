<template>
  <section>
    <SignUpForm v-if="!isSubmitted" @submitted="getDetails" />
    <OTPForm v-else :email="email" />
  </section>
</template>

<script setup>
import { ref } from "vue";
import SignUpForm from "../../components/SignUpForm.vue";
import OTPForm from "../../components/OTPForm.vue";

const isSubmitted = ref(false);
const email = ref("");
const getDetails = (data) => {
  isSubmitted.value = true;
  email.value = data;
};
</script>

<style lang="scss" scoped></style>
