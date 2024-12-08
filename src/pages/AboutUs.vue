<template>
  <q-layout view="lHh Lpr lFf">
    <section class="auth">
      <section class="auth__left"></section>
      <section class="auth__right">
        <q-page-container class="auth-container">
          <div class="main-content q-px-md">
            <h1 class="text-h4 q-mb-md text-center">About Us</h1>

            <!-- Address Section -->
            <div class="q-mb-md">
              <p class="q-mb-xs">
                <q-icon name="place" class="q-mr-sm" /> 8383 Wilshire
                Boulevard, Beverly Hills, CA
              </p>
              <p class="q-mb-xs">
                <q-icon name="people" class="q-mr-sm" /> 2-8 people
              </p>
              <p style="display: flex;">
                <img
                  src="../assets/images/radix.png"
                  alt="radix-icon"
                  class="q-mr-sm"
                  style="height: 18px;"
                /> 
                5.215 sf
              </p>
            </div>

            <!-- Description Section -->
            <div class="text-body1 text-grey-8 q-mb-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
              lacinia dui ac dui congue, eget euismod sapien pharetra. Proin sit
              amet congue mauris, in accumsan dui. Phasellus ultrices vel nibh a
              mollis. Interdum et malesuada fames ac ante ipsum primis in
              faucibus.
            </div>

            <!-- Subsections -->
            <div class="q-mb-md">
              <h5 class="text-h6 q-mb-xs">Vision</h5>
              <p class="text-grey-7 q-mb-md">
                Donec vel ipsum malesuada, facilisis ex sed, hendrerit urna.
                Vivamus hendrerit ac nulla vitae aliquam.
              </p>

              <h5 class="text-h6 q-mb-xs">Mission</h5>
              <p class="text-grey-7 q-mb-md">
                Donec vel ipsum malesuada, facilisis ex sed, hendrerit urna.
                Vivamus hendrerit ac nulla vitae aliquam.
              </p>

              <h5 class="text-h6 q-mb-xs">Who are we?</h5>
              <p class="text-grey-7">
                Donec vel ipsum malesuada, facilisis ex sed, hendrerit urna.
                Vivamus hendrerit ac nulla vitae aliquam.
              </p>
            </div>

            <!-- Footer Links -->
            <div class="q-mt-md">
              <h5 class="text-h6 q-mb-sm">Know More</h5>
              <div style="display: grid;">
                <a class="footer-link" @click="router.push({ name: 'privacy-policy' })">Privacy</a>
                <a class="footer-link" @click="router.push({ name: 'terms-conditions' })">Terms and Conditions</a>
              </div>
            </div>

            <!-- Footer Text -->
            <div class="q-mt-lg text-grey-6 text-caption">
              WSID@{{ currentYear }}
            </div>
          </div>
        </q-page-container>
      </section>
    </section>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
const currentYear = ref(new Date().getFullYear());
</script>

<style scoped lang="scss">
.auth {
  display: grid;
  grid-template-columns: 40% 1fr;
  @media screen and (max-width: 992px) {
    grid-template-columns: 1fr;
  }
  &__left {
    padding: 32px;
    overflow: hidden;
    height: 100vh;
    background: linear-gradient(
      180deg,
      rgba(255, 87, 50, 0.7) 0%,
      #ff5732 46.5%
    );
    border-radius: 20px 20px 88px 20px;
    margin: -10% 0 0 -5%;
    display: grid;
    place-items: center;
    @media screen and (max-width: 992px) {
      display: none;
    }
  }
  &__right {
    display: grid;
    min-height: 100vh; /* Ensures it takes the full height of the viewport */
    padding: 32px;
    @media screen and (max-width: 992px) {
      padding: 16px;
    }
    .auth-container {
      display: grid;
      .main-content {
        display: grid;
      }
    }

    .content {
      flex-grow: 1;
      display: flex;
      align-items: center; /* Center the content vertically */
      justify-content: center; /* Center the content horizontally */
    }
    p.terms {
      font-weight: 400;
      font-size: 10px;
      text-align: center;
      span {
        color: $primary;
        a {
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}
.main-content {
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
  color: #333;
  h1 {
    font-weight: 700;
  }
}

.footer-link {
  text-decoration: underline;
  cursor: pointer;
}
</style>
