<template>
  <q-page class="q-pa-lg">
    <div>
      <q-icon v-motion-pop-visible :delay="300" size="87px">
        <img src="~src/assets/logo.svg" alt="logo" />
      </q-icon>
      <h3
        v-motion-slide-bottom
        :delay="500"
        class="text-weight-bolder text-center"
      >
        {{ $t("wsid") }}
      </h3>
    </div>
    <div>
      <q-btn
        v-motion-pop
        :delay="600"
        no-caps
        block
        unelevated
        color="primary"
        label="Continue"
        class="w-full q-mb-md"
        :to="{ name: 'introduction' }"
      />
      <q-btn
        v-motion-pop
        :delay="700"
        no-caps
        block
        unelevated
        color="grey-12"
        class="w-full"
        text-color="black"
        label="Learn More"
      />
    </div>
  </q-page>
</template>

<script setup></script>

<style scoped lang="scss">
.q-page {
  display: grid;
  grid-template-rows: 1fr auto;
  div {
    &:first-child {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 40px;
    }
  }
}
</style>
