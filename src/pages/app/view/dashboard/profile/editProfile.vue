<template>
  <q-page>
    <div class="q-pa-lg">
      <div class="text-h6">Edit Profile</div>
    </div>
  </q-page>
</template>

<script setup></script>

<style scoped lang="scss">
.q-page {
  display: grid;
  grid-template-rows: auto 1fr;
  .q-tab-panels {
    background-color: #f1efef;
    height: 100%;
  }
}
.profile-wrapper {
  gap: 20px;
  .profile-img {
    flex-shrink: 0;
    height: 100px;
    width: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #000;
  }
}
</style>
