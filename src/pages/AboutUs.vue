<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Main Layout -->
    <section class="auth">
      <section class="auth__left"></section>
      <section class="auth__right">
        <q-page-container class="auth-container">
          <div class="main-content q-px-md">
            <!-- Header Section -->
            <header class="text-center q-mb-md">
              <h1 class="text-h4">About Us</h1>
            </header>

            <!-- Description Section -->
            <section class="description q-mb-lg">
              <p class="text-body1 text-grey-8">
                <strong>WSID</strong> (short for "What Should I Do?") is a community-driven social media platform that empowers individuals to make informed decisions and find clarity on life's uncertainties. It’s built on the idea that sometimes, life presents us with tough choices—big or small—and getting diverse perspectives can lead to better outcomes.
              </p>
            </section>

            <!-- Key Features -->
            <section class="features q-mb-md">
              <div class="feature">
                <h5 class="text-h6">Ask Questions</h5>
                <p class="text-grey-7">
                  Whether you're facing life-changing choices or everyday dilemmas, WSID allows you to ask direct, focused questions and receive thoughtful input from a supportive community. Formulate your question, provide options, and let the crowd guide your decision.
                </p>
              </div>

              <div class="feature">
                <h5 class="text-h6">Answer Questions</h5>
                <p class="text-grey-7">
                  Share your knowledge and insights with others seeking guidance. Whether you're an expert or just passionate about helping others, WSID’s platform empowers you to make a difference.
                </p>
              </div>

              <div class="feature">
                <h5 class="text-h6">Get Answers</h5>
                <p class="text-grey-7">
                  WSID leverages community polls to provide clear, insightful answers. No noise, just straightforward responses tailored to your needs.
                </p>
              </div>

              <div class="feature">
                <h5 class="text-h6">Get Diverse Perspectives</h5>
                <p class="text-grey-7">
                  WSID fosters open discussions where contributors reveal their answers, ensuring each insight is backed by genuine opinions and engagement.
                </p>
              </div>

              <div class="feature">
                <h5 class="text-h6">Why WSID?</h5>
                <p class="text-grey-7">
                  Amid information overload and bias, WSID offers a refreshing alternative for clear, confident answers. It’s a focused space to ask questions, get answers, and see transparent results.
                </p>
              </div>

              <div class="feature">
                <h5 class="text-h6">The Future</h5>
                <p class="text-grey-7">
                  Soon, users will be able to shape the platform’s future through community-driven decision-making, ensuring WSID evolves with its community’s needs.
                </p>
              </div>
            </section>

            <!-- Footer Section -->
            <footer class="q-mt-md">
              <div class="footer-links">
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
            </footer>
          </div>
        </q-page-container>
      </section>
    </section>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const currentYear = ref(new Date().getFullYear());
const router = useRouter();
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
    background: linear-gradient(180deg, rgba(255, 87, 50, 0.7) 0%, #ff5732 46.5%);
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
    min-height: 100vh;
    padding: 32px;
    @media screen and (max-width: 992px) {
      padding: 16px;
    }
  }
}

.main-content {
  padding-top: 20px;
}

.description {
  margin-bottom: 24px;
}

.features {
  margin-bottom: 24px;
}

.feature {
  margin-bottom: 16px;
}

.footer-links {
  display: flex;
  flex-direction: column;
}

.footer-link {
  text-decoration: underline;
  cursor: pointer;
}

</style>
