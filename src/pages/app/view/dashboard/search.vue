<template>
  <q-page>
    <!-- Sticky Header with Search -->
    <div
      class="q-pa-md"
      style="position: sticky; top: 0; z-index: 100; background-color: #fff"
    >
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
    <router-view :search-text="searchText" />
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

    // Handle search input updates
    const handleSearchInput = (newText) => {
      searchText.value = newText;
      updateActiveTab();
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
    };
  },
};
</script>

<style scoped>
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
