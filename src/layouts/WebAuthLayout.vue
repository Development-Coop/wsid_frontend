<template>
  <q-layout view="lHh Lpr lFf">
    <section class="auth">
      <section class="auth__left">
        <div class="auth__left-content">
          <h1>
            Submit questions to find assistance, ranging from being trivial to
            life altering.
          </h1>
          <p>Ask the world.</p>
          <div class="mobile-links">
            <p>Download the mobile app and join the community.</p>
            <div>
              <img
                src="../assets/images/app-store.png"
                alt="action-img"
                srcset="
                  ../assets/images/2x/app-store.png,../assets/images/3x/app-store.png,../assets/images/4x/app-store.png
                "
              />
              <img
                src="../assets/images/play-store.png"
                alt="action-img"
                srcset="
                  ../assets/images/2x/play-store.png,../assets/images/3x/play-store.png,../assets/images/4x/play-store.png
                "
              />
            </div>
          </div>
        </div>
      </section>
      <section class="auth__right">
        <q-page-container class="auth-container">
          <div class="main-content">
            <div class="registration-actions">
              <!-- <q-icon name="arrow_back" class="cursor-pointer" size="20px" /> -->
              <div class="auth__logo">
                <img
                  src="../assets/logo.svg"
                  class="logo-img cursor-pointer"
                  alt="logo"
                />
                <p class="no-margin cursor-pointer">WSID</p>
              </div>
            </div>
            <router-view />
          </div>
        </q-page-container>
      </section>
    </section>
  </q-layout>
</template>

<script setup></script>

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
    &-content {
      padding: 32px;
      h1 {
        font-size: 32px;
        font-weight: 700;
        line-height: 38.19px;
        color: white;
        margin-bottom: 32px;
      }
      p {
        font-size: 22px;
        font-weight: 510;
        line-height: 26.25px;
        text-align: left;
        color: #ffffffb2;
        width: 70%;
      }
      .mobile-links {
        display: grid;
        grid-gap: 24px;
        margin-top: 60px;
        p {
          font-family: Arial;
          font-size: 16px;
          font-weight: 700;
          line-height: 18.4px;
          color: rgba(255, 255, 255, 1);
        }
        img {
          height: 40px;
          width: auto;
          cursor: pointer;
        }
        div {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: flex-start;
        }
      }
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
      grid-template-rows: 1fr auto;
      place-items: center;
      .main-content {
        display: grid;
        .registration-actions {
          display: grid;
          grid-template-columns: 1fr;
          justify-content: center;
          align-items: center;
          padding: 0px 16px 24px 16px;
          gap: 10px;
        }
      }
    }

    .content {
      flex-grow: 1;
      display: flex;
      align-items: center; /* Center the content vertically */
      justify-content: center; /* Center the content horizontally */
    }
  }
  &__logo {
    display: flex;
    justify-content: center;
    font-size: 18px;
    font-weight: 800;
    gap: 4px;
  }
}
</style>
