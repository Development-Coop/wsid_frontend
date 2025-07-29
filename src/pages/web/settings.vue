<template>
  <q-page style="max-width: 600px; margin: 0 auto">
    <!-- Profile Information Section -->
    <section class="q-pa-lg">
      <div class="text-h6 q-pa-lg">
        <div class="profile-info">
          <div class="text-h5 q-mb-md text-weight-medium">Profile Information</div>
          
          <!-- Profile Picture and Basic Info -->
          <div class="profile-header q-mb-lg">
            <q-img
              v-if="user?.profilePic"
              class="profile-img"
              :src="user.profilePic"
              alt="Profile Picture"
            >
              <template #error>
                <img
                  :src="fallbackImage"
                  alt="Fallback Image"
                  class="profile-img"
                  style="border: none; width: 100%; height: 100%; padding: 4px"
                />
              </template>
            </q-img>
            <div v-else class="profile-placeholder">
              {{ (user?.name || authUserDetails?.name)?.charAt(0).toUpperCase() || "?" }}
            </div>
            <div class="profile-details">
              <div class="text-h6 text-weight-medium">{{ user?.name || authUserDetails?.name || 'N/A' }}</div>
              <div class="text-grey-7">{{ user?.email || user?.emailAddress || authUserDetails?.phone_or_email || 'N/A' }}</div>
            </div>
          </div>

          <!-- Profile Stats -->
          <div class="profile-stats q-mb-lg">
            <div class="stat-item">
              <div class="stat-label">Bio</div>
              <div class="stat-value">{{ user?.bio || 'No bio available' }}</div>
            </div>
            
            <!-- Personal Data from Auth Store -->
            <div v-if="user?.email || user?.emailAddress || authUserDetails?.phone_or_email" class="stat-item">
              <div class="stat-label">Email</div>
              <div class="stat-value">{{ user?.email || user?.emailAddress || authUserDetails?.phone_or_email }}</div>
            </div>
            
            <div v-if="authUserDetails?.dob" class="stat-item">
              <div class="stat-label">Date of Birth</div>
              <div class="stat-value">{{ formatDateOfBirth(authUserDetails.dob) }}</div>
            </div>
            
            <div v-if="user?.username || authUserDetails?.username" class="stat-item">
              <div class="stat-label">Username</div>
              <div class="stat-value">@{{ user?.username || authUserDetails?.username }}</div>
            </div>
            
            <div class="stat-item">
              <div class="stat-label">Followers</div>
              <div class="stat-value">{{ user?.followersCount || 0 }}</div>
            </div>
            
            <div class="stat-item">
              <div class="stat-label">Following</div>
              <div class="stat-value">{{ user?.followingCount || 0 }}</div>
            </div>
            
            <div class="stat-item">
              <div class="stat-label">Likes</div>
              <div class="stat-value">{{ user?.likesCount || 0 }}</div>
            </div>
            
            <div class="stat-item">
              <div class="stat-label">Member Since</div>
              <div class="stat-value">{{ formatDate(user?.createdAt) || 'N/A' }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Action Buttons -->
    <div class="q-pa-lg flex flex-col gap-3">
      <!-- Sign Out Button -->
      <q-btn
        no-caps
        block
        unelevated
        color="primary"
        class="w-full"
        label="Sign Out"
        @click="logout"
      />
      
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
    </div>

    <!-- Commented out old UI -->
    <!--
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
    -->

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
            @input="clearPasswordError"
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
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useProfileStore } from "src/stores/profileStore";
import { useAuthStore } from "src/stores/authstore";
import fallbackImage from "src/assets/icons/profile-user.png";

const router = useRouter();
const $q = useQuasar();
const profileStore = useProfileStore();
const authStore = useAuthStore();

// Get user data from profile store
const user = computed(() => {
  return JSON.parse(JSON.stringify(profileStore?.userDetails));
});

// Get personal data from auth store
const authUserDetails = computed(() => {
  return JSON.parse(JSON.stringify(authStore?.userDetails));
});

// Debug logging to see what data we have
console.log('Profile Store User:', user.value);
console.log('Auth Store User:', authUserDetails.value);

// Reactive data for delete functionality
const showDeleteConfirmation = ref(false);
const showLoadingDialog = ref(false);
const deletePassword = ref("");
const deleteLoading = ref(false);
const passwordError = ref(false);
const passwordErrorMessage = ref("");

// Commented out old items array
/*
const items = [
  { id: 1, name: "Account" },
  { id: 2, name: "Settings & Privacy" },
  { id: 3, name: "Notifications" },
  { id: 4, name: "Device Permissions" },
  { id: 5, name: "Language" },
  { id: 6, name: "Help" },
  { id: 7, name: "About" },
];
*/

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return 'Invalid date';
  }
};

// Format date of birth helper (handles DD/MM/YYYY format from auth store)
const formatDateOfBirth = (dobString) => {
  if (!dobString) return null;
  
  try {
    // Check if it's in DD/MM/YYYY format from auth store
    if (dobString.includes('/')) {
      const [day, month, year] = dobString.split('/');
      const date = new Date(year, month - 1, day); // month is 0-indexed
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    
    // Otherwise treat as regular date string
    const date = new Date(dobString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return 'Invalid date';
  }
};

const logout = () => {
  localStorage.clear();
  router.push("/auth/web-login?tab=login");
};

const clearPasswordError = () => {
  passwordError.value = false;
  passwordErrorMessage.value = "";
};

const cancelDelete = () => {
  showDeleteConfirmation.value = false;
  deletePassword.value = "";
  clearPasswordError();
};

const confirmDeleteAccount = async () => {
  if (!deletePassword.value.trim()) {
    passwordError.value = true;
    passwordErrorMessage.value = "Password is required";
    return;
  }

  try {
    deleteLoading.value = true;
    clearPasswordError();

    // Close confirmation dialog and show loading dialog
    showDeleteConfirmation.value = false;
    showLoadingDialog.value = true;

    // Call the delete account API
    const result = await profileStore.deleteAccount(deletePassword.value);
    
    console.log("Delete account result:", result);

    // Check if deletion was successful
    if (result && (result.status === true || result.success === true)) {
      // Show success message
      $q.notify({
        type: "positive",
        message: "Account deleted successfully",
        position: "top",
      });

      // Clear local storage and redirect to login
      localStorage.clear();
      router.push("/auth/web-login?tab=login");
    } else {
      // Handle unsuccessful deletion
      throw new Error(result?.message || "Failed to delete account");
    }

  } catch (error) {
    console.error("Delete account error:", error);
    
    // Close loading dialog
    showLoadingDialog.value = false;
    
    // Get error message safely
    const errorMessage = error.response?.data?.message || error.message || error.toString();
    
    // Check if it's a password error (400 status)
    if (error.response?.status === 400 || 
        errorMessage.toLowerCase().includes('invalid password')) {
      
      // Show confirmation dialog again with password error
      showDeleteConfirmation.value = true;
      passwordError.value = true;
      passwordErrorMessage.value = "Invalid password. Please try again.";
      
    } else {
      // Show general error notification
      $q.notify({
        type: "negative",
        message: errorMessage,
        position: "top",
      });
      
      // Show confirmation dialog again
      showDeleteConfirmation.value = true;
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
    }
  }
}

.profile-info {
  .profile-header {
    display: flex;
    align-items: center;
    gap: 20px;
    
    .profile-img {
      flex-shrink: 0;
      height: 80px;
      width: 80px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #e0e0e0;
    }
    
    .profile-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background-color: #1976d2;
      color: #ffffff;
      font-size: 28px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      flex-shrink: 0;
    }
    
    .profile-details {
      flex-grow: 1;
    }
  }
  
  .profile-stats {
    display: grid;
    gap: 16px;
    
    .stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .stat-label {
        font-weight: 500;
        color: #666;
      }
      
      .stat-value {
        font-weight: 600;
        color: #333;
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