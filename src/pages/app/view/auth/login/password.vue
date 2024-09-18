<template>
  <q-page class="q-pa-lg">
    <q-btn
      dense
      no-caps
      block
      unelevated
      class="justify-self-start align-self-start"
      style="border-radius: 0px"
      :to="{ name: 'login' }"
    >
      <q-icon v-motion-pop-visible :delay="300" size="24px">
        <img src="~src/assets/icons/arrow-left.svg" alt="logo" />
      </q-icon>
    </q-btn>
    <div>
      <div>
        <h4 class="text-h5 text-center text-weight-medium q-mb-xl">
          Enter your password
        </h4>
    
        <!-- Form structure with a gap of 16px -->
        <q-form class="q-gutter-md">
          <q-input
            v-model="userDetails.phone_or_email"
            outlined
            placeholder="Phone, email or @username"
            :error="!!errors.phone_or_email"
          />
          <q-input
            type="password"
            outlined
            placeholder="Password"
            :error="!!errors.phone_or_email"
          />
          <div class="q-mt-xl q-pt-lg">
            <q-btn
              v-motion-pop
              no-caps
              block
              unelevated
              color="primary"
              label="Login"
              class="w-full q-mb-md"
              :to="{ path: '/app/dashboard' }"
            />
            <RouterLink class="text-center q-mt-lg" to="/app/auth/forgot-password">
              <p class="text-body2 text-weight-medium">Forgot password?</p>
            </RouterLink>
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>
    
    <script setup>
    import { ref } from "vue";
  //   import { useRouter } from "vue-router";
    
    // Helper
  //   import { isValidEmail, isValidPhoneNumber } from "src/utils/helper";
    
  //   const router = useRouter();
    
    const userDetails = ref({
      name: "",
      phone_or_email: "",
      dob: "",
    });
    const errors = ref({
      name: "",
      phone_or_email: "",
      dob: "",
    });
    
    
  //   const parseDate = (dateString) => {
  //     const [day, month, year] = dateString.split("-");
  //     return new Date(`${year}-${month}-${day}`);
  //   };
    
    // Validation function
  //   const validateForm = () => {
  //     let isValid = true;
    
  //     // Reset error messages
  //     errors.value = {
  //       phone_or_email: "",
  //     };
    
  //     // Validate name
  //     if (!userDetails.value.name.trim()) {
  //       errors.value.name = "Name is required.";
  //       isValid = false;
  //     }
    
  //     // Validate phone or email
  //     if (!userDetails.value.phone_or_email.trim()) {
  //       errors.value.phone_or_email = "Phone number or email is required.";
  //       isValid = false;
  //     } else if (
  //       !isValidEmail(userDetails.value.phone_or_email) &&
  //       !isValidPhoneNumber(userDetails.value.phone_or_email)
  //     ) {
  //       errors.value.phone_or_email = "Enter a valid phone number or email.";
  //       isValid = false;
  //     }
    
  //     // Validate date of birth (dob)
  //     if (!userDetails.value.dob) {
  //       errors.value.dob = "Date of birth is required.";
  //       isValid = false;
  //     } else {
  //       const today = new Date().toISOString().split("T")[0];
  //       const dob = parseDate(userDetails.value.dob);
  //       if (dob > new Date(today)) {
  //         errors.value.dob = "Date of birth cannot be in the future.";
  //         isValid = false;
  //       }
  //     }
    
  //     return isValid;
  //   };
    
    // Function to handle form submission
    // const handleSubmit = () => {
    //   //   router.push({ name: 'otp-verification', query: { contactDetail: userDetails.value.phone_or_email.trim() } });
    // };
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
    