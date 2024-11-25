<template>
  <header class="q-pa-md">
    <div class="row items-center justify-between">
      <div class="row items-center">
        <img
          src="../assets/logo.svg"
          class="logo-img cursor-pointer"
          alt="logo"
          @click="router.push('/beta')"
        />
        <p class="no-margin cursor-pointer" @click="router.push('/beta')">
          WSID
        </p>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<style scoped lang="scss">
header {
  div {
    display: flex; /* Ensure flex layout for gap to work */
    gap: 4px;

    img {
      width: 20px;
      height: 20px;
    }

    p {
      font-weight: 800;
      font-size: 20px;
    }
  }

  ul {
    display: grid; /* Flex layout for horizontal alignment */
    list-style: none;
    grid-gap: 12px; /* Spacing between list items */
    font-size: 16px;
    font-weight: 500;
    padding: 0; /* Ensure no padding on the ul */
    margin: 0; /* Ensure no margin on the ul */

    &.web-view {
      display: flex;
      gap: 40px;
    }

    li {
      cursor: pointer;

      a {
        text-decoration: none;
        color: #4a4848;

        &:hover {
          color: $primary;
        }

        &.router-link-active {
          font-weight: 700;
          color: $primary;
        }
      }
    }
  }

  .button {
    background-color: #ff573212; /* Semi-transparent background color */
    color: $primary;
    padding: 6px 16px;
    font-size: 14px;
    font-weight: 500;
    min-width: 114px;
    border: none; /* Ensure no border */
    border-radius: 8px; /* Add border-radius for better appearance */
    cursor: pointer;
    transition: background-color 0.3s ease; /* Smooth transition on hover */

    &:hover {
      background-color: darken(#ff573212, 10%); /* Darken on hover */
    }
  }

  .side-bar {
    padding: 24px 32px;
    ul {
      grid-gap: 24px;
    }
  }
}
</style>
