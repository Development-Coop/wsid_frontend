<template>
    <q-page class="delete-account-page">
      <div class="container">
        <!-- Header -->
        <div class="header-section">
          <q-btn
            flat
            round
            icon="arrow_back"
            class="back-btn"
            @click="goBack"
          />
          <div class="header-title">
            <h1 class="text-h5 text-weight-medium">Delete Account</h1>
            <p class="text-body2 text-grey-7">
              Permanently remove your account and all associated data
            </p>
          </div>
        </div>
  
        <!-- Warning Section -->
        <div class="warning-section">
          <q-icon name="warning" color="negative" size="24px" />
          <div class="warning-content">
            <h3 class="text-h6 text-negative q-mb-sm">This action cannot be undone</h3>
            <p class="text-body2 text-grey-8">
              Deleting your account will permanently remove:
            </p>
            <ul class="warning-list">
              <li>Your profile and personal information</li>
              <li>All your posts and content</li>
              <li>Your followers and following connections</li>
              <li>All account data and settings</li>
            </ul>
          </div>
        </div>
  
        <!-- Form Section -->
        <div class="form-section">
          <h3 class="text-h6 q-mb-md">Confirm Account Deletion</h3>
          <p class="text-body2 text-grey-7 q-mb-lg">
            Please enter your email and password to confirm the deletion of your account.
          </p>
  
          <q-form class="deletion-form" @submit="handleDeleteAccount">
            <!-- Email Input -->
            <q-input
              v-model="formData.email"
              type="email"
              label="Email Address"
              outlined
              required
              class="q-mb-md"
              :error="errors.email"
              :error-message="errorMessages.email"
              @input="clearError('email')"
            >
              <template #prepend>
                <q-icon name="email" />
              </template>
            </q-input>
  
            <!-- Password Input -->
            <q-input
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              outlined
              required
              class="q-mb-lg"
              :error="errors.password"
              :error-message="errorMessages.password"
              @input="clearError('password')"
            >
              <template #prepend>
                <q-icon name="lock" />
              </template>
              <template #append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>
  
            <!-- Confirmation Checkbox -->
            <q-checkbox
              v-model="confirmDeletion"
              class="q-mb-lg"
              :error="errors.confirmation"
            >
              <span class="text-body2">
                I understand this action is permanent and cannot be undone
              </span>
            </q-checkbox>
  
            <!-- Submit Button -->
            <q-btn
              type="submit"
              no-caps
              unelevated
              color="negative"
              class="full-width delete-btn"
              :loading="deleteLoading"
              :disable="!isFormValid"
            >
              <q-icon name="delete_forever" class="q-mr-sm" />
              Delete My Account Permanently
            </q-btn>
          </q-form>
        </div>
  
        <!-- Support Section -->
        <div class="support-section">
          <p class="text-body2 text-grey-7 text-center">
            Having second thoughts? 
            <router-link to="/profile" class="text-primary">
              Return to your profile
            </router-link>
          </p>
        </div>
      </div>
  
      <!-- Loading Dialog -->
      <q-dialog v-model="showLoadingDialog" persistent>
        <q-card style="min-width: 300px">
          <q-card-section class="row items-center">
            <q-spinner color="negative" size="3em" :thickness="2" />
            <span class="q-ml-sm">Deleting your account...</span>
          </q-card-section>
          <q-card-section class="text-center">
            <p class="text-body2 text-grey-7">
              This may take a few moments. Please don't close this page.
            </p>
          </q-card-section>
        </q-card>
      </q-dialog>
  
      <!-- Final Confirmation Dialog -->
      <q-dialog v-model="showFinalConfirmation" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6 text-negative">
              <q-icon name="warning" class="q-mr-sm" />
              Final Confirmation
            </div>
          </q-card-section>
  
          <q-card-section class="q-pt-none">
            <p class="text-body1 q-mb-md">
              Are you absolutely sure you want to delete your account?
            </p>
            <p class="text-body2 text-negative text-weight-medium">
              This action is irreversible and will permanently delete all your data.
            </p>
          </q-card-section>
  
          <q-card-actions align="right">
            <q-btn 
              flat 
              label="Cancel" 
              @click="showFinalConfirmation = false" 
            />
            <q-btn
              flat
              label="Yes, Delete Forever"
              color="negative"
              @click="confirmFinalDeletion"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  import { useRouter } from "vue-router";
  import { useQuasar } from "quasar";
  import { useProfileStore } from "src/stores/profileStore";
  
  const router = useRouter();
  const $q = useQuasar();
  const profileStore = useProfileStore();
  
  // Form data
  const formData = ref({
    email: "",
    password: ""
  });
  
  // UI state
  const showPassword = ref(false);
  const confirmDeletion = ref(false);
  const deleteLoading = ref(false);
  const showLoadingDialog = ref(false);
  const showFinalConfirmation = ref(false);
  
  // Error handling
  const errors = ref({
    email: false,
    password: false,
    confirmation: false
  });
  
  const errorMessages = ref({
    email: "",
    password: "",
    confirmation: ""
  });
  
  // Computed properties
  const isFormValid = computed(() => {
    return (
      formData.value.email.trim() !== "" &&
      formData.value.password.trim() !== "" &&
      confirmDeletion.value &&
      isValidEmail(formData.value.email)
    );
  });
  
  // Helper functions
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const clearError = (field) => {
    errors.value[field] = false;
    errorMessages.value[field] = "";
  };
  
  const clearAllErrors = () => {
    Object.keys(errors.value).forEach(key => {
      errors.value[key] = false;
      errorMessages.value[key] = "";
    });
  };
  
  const validateForm = () => {
    let isValid = true;
    clearAllErrors();
  
    // Validate email
    if (!formData.value.email.trim()) {
      errors.value.email = true;
      errorMessages.value.email = "Email is required";
      isValid = false;
    } else if (!isValidEmail(formData.value.email)) {
      errors.value.email = true;
      errorMessages.value.email = "Please enter a valid email address";
      isValid = false;
    }
  
    // Validate password
    if (!formData.value.password.trim()) {
      errors.value.password = true;
      errorMessages.value.password = "Password is required";
      isValid = false;
    }
  
    // Validate confirmation
    if (!confirmDeletion.value) {
      errors.value.confirmation = true;
      isValid = false;
    }
  
    return isValid;
  };
  
  const goBack = () => {
    router.go(-1);
  };
  
  const handleDeleteAccount = async () => {
    if (!validateForm()) {
      return;
    }
  
    // Show final confirmation dialog
    showFinalConfirmation.value = true;
  };
  
  const confirmFinalDeletion = async () => {
    try {
      deleteLoading.value = true;
      showFinalConfirmation.value = false;
      showLoadingDialog.value = true;
      clearAllErrors();
  
      // Call the delete account API with password only (as per original logic)
      const result = await profileStore.deleteAccount(formData.value.password);
  
      console.log("Delete account result:", result);
  
      // Check if deletion was successful
      if (result && (result.status === true || result.success === true)) {
        // Show success message
        $q.notify({
          type: "positive",
          message: "Account deleted successfully. You will be redirected to the login page.",
          position: "top",
          timeout: 3000
        });
  
        // Clear local storage and redirect to login after a short delay
        setTimeout(() => {
          localStorage.clear();
          router.push("/auth/web-login?tab=login");
        }, 2000);
      } else {
        // Handle unsuccessful deletion
        throw new Error(result?.message || "Failed to delete account");
      }
    } catch (error) {
      console.error("Delete account error:", error);
  
      // Close loading dialog
      showLoadingDialog.value = false;
  
      // Get error message safely
      const errorMessage =
        error.response?.data?.message || error.message || error.toString();
  
      // Check if it's a password error (400 status)
      if (
        error.response?.status === 400 ||
        errorMessage.toLowerCase().includes("invalid password") ||
        errorMessage.toLowerCase().includes("password")
      ) {
        errors.value.password = true;
        errorMessages.value.password = "Invalid password. Please try again.";
        
        $q.notify({
          type: "negative",
          message: "Invalid password. Please check your password and try again.",
          position: "top"
        });
      } else if (
        errorMessage.toLowerCase().includes("email") ||
        errorMessage.toLowerCase().includes("user not found")
      ) {
        errors.value.email = true;
        errorMessages.value.email = "Email not found or doesn't match your account.";
        
        $q.notify({
          type: "negative",
          message: "Email not found or doesn't match your account.",
          position: "top"
        });
      } else {
        // Show general error notification
        $q.notify({
          type: "negative",
          message: errorMessage,
          position: "top"
        });
      }
    } finally {
      deleteLoading.value = false;
      showLoadingDialog.value = false;
    }
  };
  </script>
  
  <style scoped lang="scss">
  .delete-account-page {
    background-color: #f8f9fa;
    min-height: 100vh;
    padding: 20px;
  }
  
  .container {
    max-width: 500px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .header-section {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    background-color: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
    .back-btn {
      margin-top: 4px;
    }
  
    .header-title {
      flex: 1;
      
      h1 {
        margin: 0 0 8px 0;
        color: #1a1a1a;
      }
    }
  }
  
  .warning-section {
    background-color: #fef7f7;
    border: 1px solid #fecaca;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    gap: 16px;
  
    .warning-content {
      flex: 1;
  
      .warning-list {
        margin: 12px 0 0 20px;
        
        li {
          margin-bottom: 8px;
          color: #6b7280;
        }
      }
    }
  }
  
  .form-section {
    background-color: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
    .deletion-form {
      .delete-btn {
        padding: 12px 24px;
        font-weight: 600;
        font-size: 16px;
      }
    }
  }
  
  .support-section {
    background-color: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .full-width {
    width: 100%;
  }
  
  // Responsive adjustments
  @media (max-width: 600px) {
    .delete-account-page {
      padding: 16px;
    }
  
    .container {
      gap: 20px;
    }
  
    .header-section,
    .form-section,
    .support-section {
      padding: 16px;
    }
  
    .warning-section {
      padding: 16px;
      flex-direction: column;
      gap: 12px;
    }
  }
  </style>