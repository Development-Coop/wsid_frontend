<template>
  <q-page>
    <!-- Sticky Header with Search -->
    <div class="q-pa-md">
      <div class="search-bar">
        <q-input
          v-model="searchText"
          outlined
          placeholder="Search..."
          :dense="true"
          :clearable="true"
          class="q-pa-sm q-mb-md"
          @input="handleSearchInput"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
          <template v-if="isSearching" #append>
            <q-spinner-dots color="primary" size="20px" />
          </template>
        </q-input>
      </div>

      <!-- Tabs -->
      <q-tabs v-if="searchText" dense no-caps :narrow-indicator="false">
        <q-route-tab
          to="/app/search"
          label="Accounts"
          exact
          :name="'accounts'"
          :active="activeTab === 'accounts'"
        />
        <q-route-tab
          to="/app/search/post"
          label="Posts"
          exact
          :name="'posts'"
          :active="activeTab === 'posts'"
        />
      </q-tabs>
    </div>

    <!-- Dynamic Router View -->
    <router-view :search-text="searchText" @searching="handleSearching" />
  </q-page>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "SearchPage",
  setup() {
    const searchText = ref(""); // Search input state
    const activeTab = ref("accounts"); // Active tab state
    const route = useRoute(); // Access the current route
    const isSearching = ref(false); // Loading indicator state

    // Handle search input updates
    const handleSearchInput = (newText) => {
      searchText.value = newText;
      updateActiveTab();
    };

    // Handle searching event from router-view
    const handleSearching = (value) => {
      isSearching.value = value;
    };

    // Update the active tab based on the current route
    const updateActiveTab = () => {
      activeTab.value = route.path.includes("profile") ? "posts" : "accounts";
    };

    // Watch for route changes to update the active tab
    watch(route, updateActiveTab);

    // Set the initial active tab on component mount
    onMounted(updateActiveTab);

    return {
      searchText,
      activeTab,
      handleSearchInput,
      isSearching,
      handleSearching,
    };
  },
};
</script>

<style lang="scss" scoped>
.q-page {
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
:deep(.q-tabs) {
  border-radius: 8px;
  .q-tab {
    background-color: #f2f2f7;
    width: 100%;
    &.q-tab--active {
      background-color: #000;
      color: #fff;
    }
  }
}
</style>
