<template>
  <q-page style="max-width: 600px; margin: 0 auto">
    <section class="q-pa-lg pq-pb-lg">
      <div class="text-h6 q-pa-lg">
        <div class="flex flex-col gap-10">
          <div v-for="item in items" :key="item.id" :href="item.path">
            {{ item.name }}
            <q-icon name="chevron_right" size="24px" />
          </div>
        </div>
      </div>
    </section>
    <div class="q-pa-lg flex flex-col gap-3">
      <!-- Delete Account Button -->
      <q-btn
        no-caps
        block
        unelevated
        color="negative"
        outline
        class="w-full"
        label="Delete Account"
        @click="showDeleteConfirmation = true"
      />
      
      <!-- Logout Button -->
      <q-btn
        no-caps
        block
        unelevated
        color="primary"
        class="w-full"
        label="Logout"
        @click="logout"
      />
    </div>

    <!-- Delete Account Confirmation Dialog -->
    <q-dialog v-model="showDeleteConfirmation" persistent>
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6 text-negative">Delete Account</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p class="text-body2 q-mb-md">
            This action cannot be undone. All your data, posts, and profile information will be permanently deleted.
          </p>
          <p class="text-body2 q-mb-md text-weight-medium">
            Please enter your password to confirm:
          </p>
          <q-input
            v-model="deletePassword"
            type="password"
            outlined
            dense
            placeholder="Enter your password"
            :error="passwordError"
            :error-message="passwordErrorMessage"
            @keyup.enter="confirmDeleteAccount"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn 
            flat 
            label="Cancel" 
            @click="cancelDelete" 
          />
          <q-btn 
            flat 
            label="Delete Account" 
            color="negative" 
            :loading="deleteLoading"
            :disable="!deletePassword.trim()"
            @click="confirmDeleteAccount" 
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Loading Dialog -->
    <q-dialog v-model="showLoadingDialog" persistent>
      <q-card style="min-width: 250px">
        <q-card-section class="row items-center">
          <q-spinner color="primary" size="3em" :thickness="2" />
          <span class="q-ml-sm">Deleting your account...</span>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useProfileStore } from "src/stores/profileStore";

const router = useRouter();
const $q = useQuasar();
const profileStore = useProfileStore();

// Reactive data
const showDeleteConfirmation = ref(false);
const showLoadingDialog = ref(false);
const deletePassword = ref("");
const deleteLoading = ref(false);
const passwordError = ref(false);
const passwordErrorMessage = ref("");

const items = [
  { id: 1, name: "Account" },
  { id: 2, name: "Settings & Privacy" },
  { id: 3, name: "Notifications" },
  { id: 4, name: "Device Permissions" },
  { id: 5, name: "Language" },
  { id: 6, name: "Help" },
  { id: 7, name: "About" },
];

const logout = () => {
  localStorage.clear();
  router.push("/auth/web-login?tab=login");
};

const cancelDelete = () => {
  showDeleteConfirmation.value = false;
  deletePassword.value = "";
  passwordError.value = false;
  passwordErrorMessage.value = "";
};

const confirmDeleteAccount = async () => {
  if (!deletePassword.value.trim()) {
    passwordError.value = true;
    passwordErrorMessage.value = "Password is required";
    return;
  }

  try {
    deleteLoading.value = true;
    passwordError.value = false;
    passwordErrorMessage.value = "";

    // Close confirmation dialog and show loading dialog
    showDeleteConfirmation.value = false;
    showLoadingDialog.value = true;

    // Call the delete account API
    await profileStore.deleteAccount(deletePassword.value);

    // Show success message
    $q.notify({
      type: "positive",
      message: "Account deleted successfully",
      position: "top",
    });

    // Clear local storage and redirect to login
    localStorage.clear();
    router.push("/auth/web-login?tab=login");

  } catch (error) {
    console.error("Delete account error:", error);
    
    // Close loading dialog and show confirmation dialog again
    showLoadingDialog.value = false;
    showDeleteConfirmation.value = true;
    
    // Handle specific error cases
    if (error.response?.status === 400) {
      passwordError.value = true;
      passwordErrorMessage.value = "Invalid password provided";
    } else {
      $q.notify({
        type: "negative",
        message: error.response?.data?.message || "Failed to delete account. Please try again.",
        position: "top",
      });
    }
  } finally {
    deleteLoading.value = false;
    showLoadingDialog.value = false;
  }
};
</script>

<style scoped lang="scss">
.q-page {
  background-color: #f2f2f7;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  section {
    & > div {
      background-color: #fff;
      border-radius: 16px;
      & > .flex {
        gap: 40px;
        div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
      }
    }
  }
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.gap-3 {
  gap: 12px;
}
</style>