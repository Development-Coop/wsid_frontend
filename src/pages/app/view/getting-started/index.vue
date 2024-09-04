<template>
  <q-page class="q-pa-lg">
    <div>
      <q-icon size="87px">
        <img src="src/assets/logo.svg" alt="logo" />
      </q-icon>
      <h3 class="text-weight-bolder text-center">{{ $t("wsid") }}</h3>
    </div>
    <div>
      <q-btn
        no-caps
        block
        unelevated
        color="primary"
        label="Continue"
        class="w-full q-mb-md"
        :to="{ name: 'ask-questions' }"
        style="color: #363b4b; background-color: #f0f2f5"
      />
      <q-btn
        no-caps
        block
        unelevated
        class="w-full"
        text-color="black"
        label="Learn More"
        style="color: #363b4b; background-color: #f0f2f5"
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
