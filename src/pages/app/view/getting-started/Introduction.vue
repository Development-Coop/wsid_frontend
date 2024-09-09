<template>
  <q-page class="q-pa-lg">
    <q-carousel
      v-model="slide"
      keep-alive
      transition-prev="slide-right"
      transition-next="slide-left"
      animated
      control-color="primary"
      navigation
      padding
    >
      <q-carousel-slide :name="1" class="column no-wrap flex-center">
        <div>
          <img
            v-motion-pop-visible
            src="~src/assets/images/gettingstarted_frame1.png"
            class="w-full"
            alt="logo"
          />
          <h4
            v-motion-slide-visible-bottom
            class="text-weight-bold text-center q-mb-lg q-mt-xl q-pt-lg"
          >
            {{ $t("introduction.askQuestions.title") }}
          </h4>
          <h6
            v-motion-slide-visible-bottom
            :delay="300"
            class="text-center text-weight-regular text-grey-8"
          >
            {{ $t("introduction.askQuestions.description") }}
          </h6>
        </div>
      </q-carousel-slide>

      <q-carousel-slide :name="2" class="column no-wrap flex-center">
        <div>
          <img
            v-motion-pop-visible
            src="~src/assets/images/gettingstarted_frame2.png"
            class="w-full"
            alt="logo"
          />
          <h4
            v-motion-slide-visible-bottom
            class="text-weight-bold text-center q-mb-lg q-mt-xl q-pt-lg"
          >
            {{ $t("introduction.createOptions.title") }}
          </h4>
          <h6
            v-motion-slide-visible-bottom
            :delay="300"
            class="text-center text-weight-regular text-grey-8"
          >
            {{ $t("introduction.createOptions.description") }}
          </h6>
        </div>
      </q-carousel-slide>

      <q-carousel-slide :name="3" class="column no-wrap flex-center">
        <div>
          <img
            v-motion-pop-visible
            src="~src/assets/images/gettingstarted_frame3.png"
            class="w-full"
            alt="logo"
          />
          <h4
            v-motion-slide-visible-bottom
            class="text-weight-bold text-center q-mb-lg q-mt-xl q-pt-lg"
          >
            {{ $t("introduction.receiveResults.title") }}
          </h4>
          <h6
            v-motion-slide-visible-bottom
            :delay="300"
            class="text-center text-weight-regular text-grey-8"
          >
            {{ $t("introduction.receiveResults.description") }}
          </h6>
        </div>
      </q-carousel-slide>

      <q-carousel-slide :name="4" class="column no-wrap flex-center">
        <div>
          <img
            v-motion-pop-visible
            src="~src/assets/images/gettingstarted_frame4.png"
            class="w-full"
            alt="logo"
          />
          <h4
            v-motion-slide-visible-bottom
            class="text-weight-bold text-center q-mb-lg q-mt-xl q-pt-lg"
          >
            {{ $t("introduction.getFeedback.title") }}
          </h4>
          <h6
            v-motion-slide-visible-bottom
            :delay="300"
            class="text-center text-weight-regular text-grey-8"
          >
            {{ $t("introduction.getFeedback.description") }}
          </h6>
        </div>
      </q-carousel-slide>

      <q-carousel-slide :name="5" class="column no-wrap flex-center">
        <div class="intro-final">
          <img
            v-motion-pop-visible
            src="~src/assets/images/gettingstarted_frame5.png"
            class="w-full"
            alt="logo"
          />
          <h4
            v-motion-slide-visible-bottom
            class="text-weight-bold text-white text-center q-mb-lg q-mt-xl q-pt-lg"
          >
            {{ $t("introduction.growTogether.title") }}
          </h4>
          <h6
            v-motion-slide-visible-bottom
            :delay="300"
            class="text-center text-weight-regular text-white text-weight-light q-px-md"
          >
            {{ $t("introduction.growTogether.description") }}
          </h6>
        </div>
      </q-carousel-slide>

      <template #control>
        <q-carousel-control position="bottom">
          <q-btn
            v-if="slide > 1"
            no-caps
            dense
            unelevated
            color="grey-12"
            text-color="black"
            :label="$t('introduction.buttons.back')"
            style="min-width: 80px"
            @click="prevSlide"
          />
          <q-btn
            no-caps
            dense
            unelevated
            color="primary"
            text-color="white"
            :label="
              slide === 5
                ? $t('introduction.buttons.finish')
                : $t('introduction.buttons.next')
            "
            style="min-width: 80px"
            class="q-ml-auto"
            @click="handleNextOrFinish"
          />
        </q-carousel-control>
      </template>
    </q-carousel>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const slide = ref(1);

const nextSlide = () => {
  if (slide.value < 5) {
    slide.value++;
  }
};

const prevSlide = () => {
  if (slide.value > 1) {
    slide.value--;
  } else {
    slide.value = 5;
  }
};

const handleNextOrFinish = () => {
  if (slide.value === 5) {
    router.push("/app/getting-started");
  } else {
    nextSlide();
  }
};
</script>

<style lang="scss" scoped>
.q-page {
  display: grid;
  h6 {
    line-height: 20px;
  }
}
.q-carousel {
  height: 100%;
  .q-carousel__slide {
    padding: 0px;
    justify-content: space-between;
  }
  .q-carousel__control {
    display: flex;
    margin: 0px !important;
  }
  :deep(.q-carousel__navigation--bottom) {
    bottom: 10px;
  }
  :deep(.q-carousel__navigation-inner) {
    .q-btn {
      margin: 0px;
      padding: 0px;
      font-size: 7px !important;
      &.q-carousel__navigation-icon--inactive {
        color: #d9d9d9 !important;
      }
    }
  }
}
.intro-final {
  background: linear-gradient(to bottom, #ff5532, #bf2705);
  padding-top: 20px;
  border-radius: 30px 30px 0px 0px;
  height: calc(100% - 60px);
}
</style>
