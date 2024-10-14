<template>
  <q-page class="q-pa-lg">
    <div class="flex justify-end">
      <q-icon size="24px" class="q-mr-md">
        <img src="~src/assets/icons/edit.svg" alt="edit" />
      </q-icon>
      <q-icon size="24px">
        <img src="~src/assets/icons/settings.svg" alt="settings" />
      </q-icon>
    </div>
    <div class="flex no-wrap items-center profile-wrapper">
      <q-img
        class="profile-img"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwme89cM8YZvHcybGrZl_Obd9U9p5QabozJQ&s"
      />
      <div>
        <p class="text-h6 text-weight-medium">Alex Doe</p>
        <p class="text-grey-7">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quos.
        </p>
      </div>
    </div>
    <div class="flex justify-around q-my-lg">
      <div class="text-center">
        <p class="text-h6 text-weight-medium text-primary">122</p>
        <p>Followers</p>
      </div>
      <div class="text-center">
        <p class="text-h6 text-weight-medium text-primary">122</p>
        <p>Following</p>
      </div>
      <div class="text-center">
        <p class="text-h6 text-weight-medium text-primary">37k</p>
        <p>Likes</p>
      </div>
    </div>
  </q-page>
</template>

<style scoped lang="scss">
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
