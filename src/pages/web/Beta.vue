<template>
  <section class="home">
    <section class="home-banner">
      <section class="banner-section banner-section--left">
        <HeaderBeta />
        <div class="banner-content">
          <span class="banner-subtitle">What Should I Do?</span>
          <div v-motion-slide-left :delay="500" class="banner-emphasized">
            <p>Ask questions.</p>
            <p>Create polls.</p>
            <p>Get answers.</p>
            <br>
            <p class="banner-title">Join the WSID Revolution!</p>
          </div>

          <p class="banner-description">
            WSID is changing the way people make decisions. Ask the world your toughest questions, vote on polls, and discover what the crowd thinks - all in one easy-to-use platform. Plus, you'll help shape the future of WSID by voting on new features and updates! Don't miss out on this exciting journey.
          </p>
          <div class="banner-buttons">
            <q-input
              v-model="email"
              standout
              outlined
              label="Enter your email"
              :error="emailError"
              :error-message="emailErrorMessage"
              @change="validateEmail"
            >
              <template #after>
                <q-btn
                  no-caps
                  block
                  label="Join!"
                  color="primary"
                  unelevated
                  @click="subscribeToNewsletter"
                />
              </template>
            </q-input>
          </div>
        </div>
      </section>
      <section v-if="!isMobile" class="banner-section banner-section--right">
        <div
          v-for="(comment, index) in commentsList"
          :key="index"
          :class="[`comments-list-${index}`, 'comments-list']"
        >
          <CommentCard
            v-motion-slide-right
            :delay="index == 0 ? 500 : 600"
            :image-src="comment.imgSrc"
            :text="comment.comment"
          />
        </div>
        <div class="primary-img">
          <span class="shadow"></span>
          <img
            src="../../assets/images/banner-img.png"
            alt="banner-img"
            srcset="
              ../../assets/images/2x/banner-img.png,../../assets/images/3x/banner-img.png,../../assets/images/4x/banner-img.png
            "
          />
        </div>
      </section>
    </section>

    <section class="app-info">
      <div class="app-info__container">
        <div class="app-info__mobile-links">
          <div>
            <div>
              <p>We’re launching soon.</p>
              <p>Join the waitlist now</p>
            </div>
          </div>
        </div>
        <div class="app-info__actions">
          <div class="app-info__actions-container">
            <div class="app-info__actions-names">
              <img
                src="../../assets/images/ask-que.png"
                alt="action-img"
                srcset="
                  ../../assets/images/2x/ask-que.png,../../assets/images/3x/ask-que.png,../../assets/images/4x/ask-que.png
                "
              />
              <p>Ask Questions</p>
            </div>
            <div class="app-info__actions-names">
              <img
                src="../../assets/images/create-options.png"
                alt="action-img"
                srcset="
                  ../../assets/images/2x/create-options.png,../../assets/images/3x/create-options.png,../../assets/images/4x/create-options.png
                "
              />
              <p>Create Options</p>
            </div>
            <div class="app-info__actions-names">
              <img
                src="../../assets/images/receive-results.png"
                alt="action-img"
                srcset="
                  ../../assets/images/2x/receive-results.png,../../assets/images/3x/receive-results.png,../../assets/images/4x/receive-results.png
                "
              />
              <p>Receive Results</p>
            </div>
            <div class="app-info__actions-names">
              <img
                src="../../assets/images/get-feedback.png"
                alt="action-img"
                srcset="
                  ../../assets/images/2x/get-feedback.png,../../assets/images/3x/get-feedback.png,../../assets/images/4x/get-feedback.png
                "
              />
              <p>Get Feedback</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="grow-together">
      <div class="grow-together__header">
        <h1>GROW TOGETHER</h1>
        <p>
          Join a community where your questions get real answers. From life's small decisions to big choices, let the world weigh in and help you decide. Discover a simple, collaborative way to find clarity, connect, and make better decisions today
        </p>
      </div>
      <CommentsSlider />
    </section>
    <section class="footer">
      <a href="https://www.instagram.com/wsidcom" target="_blank" aria-label="Instagram">
        <img src="../../assets/icons/instagram.svg" alt="Instagram" class="icon" />
      </a>
      <a href="https://www.facebook.com/WSIDcom/" target="_blank" aria-label="Facebook">
        <img src="../../assets/icons/facebook.svg" alt="Facebook" class="icon" />
      </a>
      <a href="https://www.twitter.com/wsidcom" target="_blank" aria-label="Twitter">
        <img src="../../assets/icons/x.svg" alt="Twitter" class="icon" />
      </a>
      <a href="https://www.linkedin.com/company/wsid/" target="_blank" aria-label="LinkedIn">
        <img src="../../assets/icons/linkedin.svg" alt="LinkedIn" class="icon" />
      </a>
    </section>
  </section>
</template>

<script setup>
import HeaderBeta from "../../components/HeaderBeta.vue";
import CommentCard from "../../components/CommentCard.vue";
import CommentsSlider from "../../components/CommentsSlider.vue";
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import { useCommonStore } from "../../stores/commonstore";

const commonStore = useCommonStore();
const $q = useQuasar();
const commentsList = ref([
  {
    imgSrc: new URL("../../assets/icons/sample-profile-1.svg", import.meta.url)
      .href,
    comment:
      "Should I quit my job to start a food truck?",
  },
  {
    imgSrc: new URL("../../assets/icons/sample-profile-2.svg", import.meta.url)
      .href,
    comment: "Helping one cat might not change the whole world, but it could change the world for one person.",
  },
  {
    imgSrc: new URL("../../assets/icons/sample-profile-3.svg", import.meta.url)
      .href,
    comment: "What should I do this weekend?",
  },
  {
    imgSrc: new URL("../../assets/icons/sample-profile-4.svg", import.meta.url)
      .href,
    comment: "Which school should I send my kids too?",
  },
  {
    imgSrc: new URL("../../assets/icons/sample-profile-1.svg", import.meta.url)
      .href,
    comment: "Invest in Bitcoin!",
  },
  {
    imgSrc: new URL("../../assets/icons/sample-profile-2.svg", import.meta.url)
      .href,
    comment:
      "Should I go back to school for computer science as a 38 year old?",
  },
  {
    imgSrc: new URL("../../assets/icons/sample-profile-3.svg", import.meta.url)
      .href,
    comment: "Where do should I travel next?",
  },
  {
    imgSrc: new URL("../../assets/icons/sample-profile-4.svg", import.meta.url)
      .href,
    comment:
      "What’s a good action movie to show someone that hates action flicks?",
  },
  {
    imgSrc: new URL("../../assets/icons/sample-profile-1.svg", import.meta.url)
      .href,
    comment: "What day of the week is best to break up with someone?",
  },
  {
    imgSrc: new URL("../../assets/icons/sample-profile-2.svg", import.meta.url)
      .href,
    comment: "175 Votes (55%)",
  },
  {
    imgSrc: new URL("../../assets/icons/sample-profile-3.svg", import.meta.url)
      .href,
    comment: "Is this goal worth the cost?",
  },
  {
    imgSrc: new URL("../../assets/icons/sample-profile-4.svg", import.meta.url)
      .href,
    comment: "That makes perfect sense to me.",
  },
  {
    imgSrc: new URL("../../assets/icons/sample-profile-1.svg", import.meta.url)
      .href,
    comment:
      "I’ve been thinking about changing things up. What should I name my kid?",
  },
  {
    imgSrc: new URL("../../assets/icons/sample-profile-2.svg", import.meta.url)
      .href,
    comment: "What should improve today the house or the car?",
  },
  {
    imgSrc: new URL("../../assets/icons/sample-profile-3.svg", import.meta.url)
      .href,
    comment: "I strongly agree",
  },
  {
    imgSrc: new URL("../../assets/icons/sample-profile-4.svg", import.meta.url)
      .href,
    comment: "Should I break the law to save a loved one?",
  },
  {
    imgSrc: new URL("../../assets/icons/sample-profile-1.svg", import.meta.url)
      .href,
    comment: "Which Martial Art is right for me?",
  },
  {
    imgSrc: new URL("../../assets/icons/sample-profile-2.svg", import.meta.url)
      .href,
    comment: "2484 Votes (65%)",
  },
  {
    imgSrc: new URL("../../assets/icons/sample-profile-3.svg", import.meta.url)
      .href,
    comment: "Which is worse, failing or never trying?",
  },
  {
    imgSrc: new URL("../../assets/icons/sample-profile-4.svg", import.meta.url)
      .href,
    comment: "388 Votes (12%)",
  },
  {
    imgSrc: new URL("../../assets/icons/sample-profile-1.svg", import.meta.url)
      .href,
    comment: "Other than that make sure it matches your style and personality.",
  },
  {
    imgSrc: new URL("../../assets/icons/sample-profile-2.svg", import.meta.url)
      .href,
    comment:
      "Piano may sound daunting, but it’s actually easier than you think! play",
  },
  {
    imgSrc: new URL("../../assets/icons/sample-profile-3.svg", import.meta.url)
      .href,
    comment: "Where to move if you can’t afford NYC?",
  },
  {
    imgSrc: new URL("../../assets/icons/sample-profile-4.svg", import.meta.url)
      .href,
    comment: "What profession is not a complete joke?",
  },
  {
    imgSrc: new URL("../../assets/icons/sample-profile-1.svg", import.meta.url)
      .href,
    comment: "Agree, no need to watch the 1st one and skip the 3rd",
  },
  {
    imgSrc: new URL("../../assets/icons/sample-profile-2.svg", import.meta.url)
      .href,
    comment: "1802 Votes (15%)",
  },
  {
    imgSrc: new URL("../../assets/icons/sample-profile-3.svg", import.meta.url)
      .href,
    comment: "Why do I keep dreaming of balloons?",
  },
  {
    imgSrc: new URL("../../assets/icons/sample-profile-4.svg", import.meta.url)
      .href,
    comment: "What is weighing me down that I don’t need in my life?",
  },
  {
    imgSrc: new URL("../../assets/icons/sample-profile-4.svg", import.meta.url)
      .href,
    comment: "Choose the path that brings you the most happiness and peace of mind.",
  },
]);

const isMobile = computed(() => $q.screen.width < 992);
const email = ref("");
const emailError = ref(false);
const emailErrorMessage = ref("");

const subscribeToNewsletter = async () => {
  // Email validation regex
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if the email is valid
  if (!emailPattern.test(email.value)) {
    emailError.value = true;
    emailErrorMessage.value = "Please enter a valid email address.";
    return; // Exit the function if the email is invalid
  }

  try {
    const isSubscribed = await commonStore.subscribeToNewsletter(email.value);
    if (isSubscribed) {
      emailError.value = false;
      emailErrorMessage.value = "";
      $q.notify({
        message: isSubscribed,
        color: "positive",
        position: "top",
        timeout: 3000,
      });
    }
  } catch (error) {
    emailError.value = true;
    emailErrorMessage.value = "Failed to subscribe. Please try again.";
    $q.notify({
      message: "Failed to subscribe. Please try again.",
      color: "negative",
      position: "top",
      timeout: 3000,
    });
  } finally {
    email.value = "";
  }
};

const validateEmail = () => {
  // Email validation regex
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if the email is valid
  if (!emailPattern.test(email.value)) {
    emailError.value = true;
    emailErrorMessage.value = "Please enter a valid email address.";
  } else {
    emailError.value = false;
    emailErrorMessage.value = "";
  }
};
</script>

<style scoped lang="scss">
.home {
  overflow-x: hidden;
  &-banner {
    display: grid;
    grid-template-columns: 58% 1fr;
    grid-gap: 32px;
    @media screen and (max-width: 992px) {
      grid-template-columns: 1fr;
    }
    .banner-section--left {
      display: grid;
      grid-template-rows: auto 1fr;
      .banner-content {
        display: grid;
        grid-gap: 32px;
        align-self: center;
        max-width: 516px;
        justify-self: center;
        @media screen and (max-width: 992px) {
          padding: 32px;
          text-align: center;
          .banner-description {
            max-width: 100%;
          }
          .banner-buttons {
            justify-content: center;
          }
        }
      }
      .banner-subtitle {
        font-size: 18px;
        font-weight: 700;
        color: $primary;
      }
      .banner-emphasized {
        font-size: 24px;
        font-weight: 700;
      }
      .banner-title {
        font-weight: 700;
        font-size: 55px;
        line-height: 65px;
      }
      .banner-description {
        color: #555555;
        font-weight: 400;
        font-size: 20px;
        max-width: 80%;
      }

      .banner-buttons {
        .btn {
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 14px;
          font-weight: 500;
          min-width: 150px;
          cursor: pointer;
        }
        .btn-primary {
          background-color: $primary;
          color: #fff;
        }
        .btn-secondary {
          background-color: #ff573212;
          color: $primary;
        }
      }
    }
    .banner-section--right {
      background-color: $primary;
      border-bottom-left-radius: 88px;
      display: grid;
      place-items: center;
      min-height: 900px;
      padding-left: 40px;
      padding-bottom: 60px;
      position: relative;
      .comments-list {
        position: absolute;
        z-index: 2;
        .card {
          width: 430px;
          height: 76px;
        }
        &-0 {
          top: 7%;
          right: -40px;
        }
        &-1 {
          top: 20%;
          left: -12%;
        }
        &-2 {
          bottom: 27%;
          right: -15%;
        }
        &-3 {
          bottom: 12%;
          left: -16px;
        }
      }
      .primary-img {
        max-width: 380px;
        height: auto;
        box-sizing: border-box;
        position: relative;
        .shadow {
          position: absolute;
          background: #000;
          top: 40px;
          right: 40px;
          height: 100%;
          width: 100%;
          border-radius: 10px;
        }
        img {
          height: 100%;
          width: 100%;
          position: relative;
          z-index: 1;
          border-radius: 4px;
        }
      }
    }
  }
  .app-info {
    padding: 0 48px;
    width: 100%;
    margin-bottom: 80px;
    margin-top: 80px;
    @media screen and (max-width: 992px) {
      padding: 0 24px;
      margin-bottom: 24px;
    }
    &__container {
      background-color: #fff3f1;
      padding: 60px 40px 120px 40px;
      height: 660px;
      display: grid;
      place-items: center;
      // margin-top: -105px;
      z-index: -1;
      border-radius: 88px;
      @media screen and (max-width: 992px) {
        margin-top: 0;
        height: auto;
        grid-gap: 32px;
        border-radius: 44px;
      }
    }
    &__actions {
      width: 88%;
      @media screen and (max-width: 992px) {
        width: 100%;
      }
      &-container {
        background-color: #2d2d2d;
        border-radius: 32px;
        display: grid;
        grid-auto-flow: column;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        justify-items: center;
        padding-left: 16px;
        @media screen and (max-width: 992px) {
          grid-template-columns: 1fr;
          grid-auto-flow: row;
          grid-gap: 48px;
          color: #fff;
          padding: 0;
          background-color: transparent;
        }
      }
      &-names {
        display: grid;
        justify-items: center;
        position: relative;
        @media screen and (max-width: 992px) {
          background-color: #2d2d2d;
          border-radius: 32px;
        }
        p {
          margin: 0;
          font-weight: 800;
          padding-top: 16px;
          position: absolute;
          bottom: -40px;
          @media screen and (max-width: 992px) {
            bottom: -32px;
            color: #000;
          }
        }
        img {
          width: 100%;
        }

        img:nth-child(1) {
          height: 227px;
        }

        img:nth-child(2) {
          height: 218px;
        }

        img:nth-child(3) {
          height: 237px;
        }

        img:nth-child(4) {
          height: 237px;
        }
      }
    }
    &__mobile-links {
      display: grid;
      grid-auto-flow: column;
      justify-self: flex-start;
      grid-gap: 32px;
      width: 50%;
      margin-left: 48px;
      @media screen and (max-width: 992px) {
        grid-auto-flow: row;
        justify-self: center;
        margin: 0;
        text-align: center;
        grid-gap: 16px;
        width: 100%;
      }
      p {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
      }
      img {
        height: 40px;
        width: auto;
        cursor: pointer;
      }
      div {
        padding: 8px;
        flex-wrap: wrap;
        justify-content: center;
        p {
          &:last-child {
            color: #616060;
            font-weight: 400;
          }
        }
      }
    }
  }
  .grow-together {
    background: #161616;
    height: 1000px;
    display: grid;
    padding: 80px 0;
    justify-content: center;
    gap: 80px;
    width: 100%;
    box-sizing: border-box;
    @media screen and (max-width: 992px) {
      padding: 60px 0;
      gap: 60px;
      height: auto;
    }
    &__header {
      display: grid;
      justify-self: center;
      align-self: flex-start;
      text-align: center;
      @media screen and (max-width: 992px) {
        grid-gap: 16px;
      }
      h1 {
        font-size: 40px;
        font-weight: 500;
        color: #d6d4cc;
        margin: 0;
        @media screen and (max-width: 992px) {
          font-size: 32px;
          line-height: 40px;
        }
      }
      p {
        color: #a3a3a3;
        font-size: 18px;
        margin: 0;
        justify-self: center;
        max-width: 42%;
        @media screen and (max-width: 992px) {
          max-width: 80%;
        }
      }
    }
  }

  .footer {
    background: #161616;
    display: flex;
    height: 75px;
    justify-content: center;
    align-items: center;
    gap: 24px;
    bottom: 16px;
    width: 100%;
    text-align: center;
  }
}
</style>
