<template>
  <footer class="footer">
    <div class="footer__contact">
      <div class="footer__social-links">
        <a target="_blank" href="https://x.com/wsidcom">
          <img src="../assets/icons/twitter.svg" alt="twitter-icon" />
        </a>
        <a target="_blank" href="https://www.instagram.com/WSIDcom/">
          <img src="../assets/icons/instagram.svg" alt="instagram-icon" />
        </a>
        <a target="_blank" href="https://www.facebook.com/WSIDcom/">
          <img src="../assets/icons/facebook.svg" alt="facebook-icon" />
        </a>
      </div>
      <a href=""><span>What should I do?</span></a>
    </div>
    <div class="footer__content">
      <h1>
        <span>Hurry Up</span>At WSID, you have unlimited lifelines. Join Now,
        get going.
      </h1>
      <div class="footer__nav">
        <ul>
          <li v-for="item in navItems" :key="item.name">
            <router-link :to="item.path">{{ item.name }}</router-link>
          </li>
        </ul>
        <div class="send-message">
          <input v-model="message" type="text" placeholder="SEND MESSAGE" />
          <div>
            <img src="../assets//icons//send-btn.svg" alt="send-btn" />
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from "vue";
const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Login", path: "/auth/web-login?tab=login" },
  { name: "Register", path: "/auth/web-login?tab=signup" },
];
const message = ref("");
</script>

<style scoped lang="scss">
.footer {
  display: grid;
  align-content: space-between;
  padding: 48px;
  height: 650px;
  @media screen and (max-width: 992px) {
    height: auto;
    padding: 24px;
    align-content: center;
    place-items: center;
    gap: 32px;
    padding: 24px 16px;
  }
  a {
    text-decoration: none;
  }
  &__contact {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    @media screen and (max-width: 992px) {
      display: grid;
      justify-items: center;
      grid-gap: 16px;
    }
    span {
      font-size: 20px;
      color: $primary;
    }
  }
  &__social-links {
    display: flex;
    gap: 32px;
    img {
      height: 18px;
      filter: brightness(0.8);
      &:hover {
        filter: brightness(1.5);
      }
    }
  }
  &__content {
    display: grid;
    grid-gap: 64px;
    @media screen and (max-width: 992px) {
      grid-gap: 24px;
    }
    h1 {
      color: #d6d4cc;
      max-width: 36%;
      font-weight: 500;
      font-size: 40px;
      line-height: 36px;
      text-transform: uppercase;
      @media screen and (max-width: 992px) {
        max-width: 100%;
        font-size: 32px;
    }
      span {
        color: #a3a3a3;
        font-size: 16px;
        padding-right: 80px;
        text-transform: none;
        @media screen and (max-width: 992px) {
          padding-right: 40px;
        }
      }
    }
  }
  &__nav {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 20px 0;
    border-bottom: 1px solid #d6d4cc33;
    @media screen and (max-width: 992px) {
      flex-direction: column;
      align-items: center;
      gap: 32px;
    }
    ul {
      display: flex; /* Flex layout for horizontal alignment */
      list-style: none;
      gap: 12px; /* Spacing between list items */
      font-size: 16px;
      font-weight: 500;
      padding: 0; /* Ensure no padding on the ul */
      margin: 0;
      li {
        cursor: pointer;

        a {
          text-decoration: none;
          color: #a3a3a3;
          &:hover {
            color: #cfcfcf;
          }

          &.router-link-active {
            font-weight: 700;
            color: #cfcfcf;
          }
        }
      }
    }
    .send-message {
      display: flex;
      align-items: center;
      gap: 16px;
      input {
        border: none;
        background: transparent;
        color: #fff;
        font-size: 24px;
        max-width: 200px;
        &:focus {
          outline: none;
          border-bottom: 1px solid #fff;
        }
        @media screen and (max-width: 992px) {
          font-size: 16px;
        }
      }
      > div {
        display: grid;
        place-items: center;
        cursor: pointer;
        background: $primary;
        border-radius: 50%;
        height: 80px;
        width: 80px;
        img {
          width: 32px;
        }
        @media screen and (max-width: 992px) {
          height: 40px;
          width: 40px;
          img {
          width: 20px;
        }
        }
      }
    }
  }
}
</style>
