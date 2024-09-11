<template>
  <q-page class="q-pa-lg">
    <q-btn
      dense
      no-caps
      block
      unelevated 
      class="justify-self-start align-self-start"
      style="border-radius: 0px;"
    >
      <q-icon v-motion-pop-visible :delay="300" size="24px">
        <img src="~src/assets/icons/arrow-left.svg" alt="logo" />
      </q-icon>
    </q-btn>
    <div>
      <div>
        <h4 class="text-h4 text-center text-weight-medium q-mb-xl">Create your account</h4>
        <q-input dense outlined placeholder="Name" />
      </div>
      <div class="flex justify-center">
        <q-btn
          v-motion-pop
          class="q-px-xl"
          no-caps
          block
          unelevated
          color="primary"
          label="Next"
        />
      </div>
    </div>
  </q-page>
</template>
  
  <script setup></script>
  
  <style scoped lang="scss">
  .q-page {
    display: grid;
    grid-template-rows: 80px 1fr;
    & > div{
        &:nth-child(2){
            display: grid;
            grid-template-rows: 1fr auto;
            gap: 40px;
        }
    }
  }
  </style>
  