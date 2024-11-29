<template>
  <q-page class="q-pa-lg">
    <div>
      <h6
        v-motion-slide-bottom
        class="text-primary text-weight-bold text-center q-pt-lg"
      >
        What Should I Do?
      </h6>
      <h4 v-motion-slide-bottom class="text-weight-bold text-center q-py-xl">
        Forums for <br />
        everyday life.
        <br />
        Discuss with the <br />world.
      </h4>
    </div>
    <div>
      <q-btn
        v-motion-pop
        no-caps
        block
        unelevated
        color="grey-12 q-mb-md"
        class="w-full"
        text-color="black"
        label="Continue with Google"
      />
      <q-btn
        v-motion-pop
        no-caps
        block
        unelevated
        color="grey-12 q-mb-md"
        class="w-full"
        text-color="black"
        label="Continue with Apple"
      />
      <div class="text-center relative-position q-py-lg q-mb-md">
        <hr class="divider q-my-none" />
        <span class="bg-white q-px-sm absolute-center text-h6 text-grey-7">or</span>
      </div>
      <q-btn
        v-motion-pop
        no-caps
        block
        unelevated
        color="primary"
        label="Create an account"
        class="w-full q-mb-lg"
        :to="{ name: 'registration' }"
      />
      <p class="text-center text-body1">
        Have an account already?
        <RouterLink to="/app/auth/login" class="text-primary text-weight-bold">
          Login
        </RouterLink>
      </p>
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
      gap: 40px;
    }
  }
  hr {
    color: #dfe2e8;
    background-color: #dfe2e8;
    height: 1px;
    border: none;
  }
}
</style>
