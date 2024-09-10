<template>
  <footer class="footer">
    <div class="footer__contact">
      <div class="footer__social-links">
        <a href="">
          <img src="../assets/icons/youtube.svg" alt="youtube-icon" />
        </a>
        <a href="">
          <img src="../assets/icons/instagram.svg" alt="instagram-icon" />
        </a>
        <a href="">
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
            <img src="../assets//icons//send-btn.svg" alt="send-btn">
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
  { name: "Testimonials", path: "/testimonials" },
  { name: "Connect", path: "/connect" },
];
const message = ref("");
</script>

<style scoped lang="scss">
.footer {
  display: grid;
  align-content: space-between;
  padding: 48px;
  height: 650px;
  a {
    text-decoration: none;
  }
  &__contact {
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      font-size: 20px;
      color: $primary;
    }
  }
  &__social-links {
    display: flex;
    gap: 32px;
  }
  &__content {
    display: grid;
    grid-gap: 64px;
    h1 {
      color: #d6d4cc;
      max-width: 36%;
      font-weight: 500;
      font-size: 40px;
      line-height: 36px;
      text-transform: uppercase;
      span {
        color: #a3a3a3;
        font-size: 16px;
        padding-right: 80px;
        text-transform: none;
      }
    }
  }
  &__nav {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 20px 0;
    border-bottom: 1px solid #D6D4CC33;
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
        }
        > div {
            display: grid;
            place-items: center;
            cursor: pointer;
            background: $primary;
            border-radius: 50%;
            height: 80px;
            width: 80px;
        }
    }
  }
}
</style>
