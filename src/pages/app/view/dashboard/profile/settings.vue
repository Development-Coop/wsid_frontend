<template>
  <q-page>
    <div class="q-pa-lg">
      <q-btn
        dense
        no-caps
        block
        unelevated
        class="justify-self-start align-self-start"
        style="border-radius: 0px"
        @click="router.push({ path: '/app/profile' })"
      >
        <q-icon v-motion-pop-visible size="24px">
          <img src="~src/assets/icons/arrow-left.svg" alt="logo" />
        </q-icon>
      </q-btn>
    </div>
    <section class="q-px-lg pq-pb-lg">
      <div class="text-h6 q-pa-lg">
        <div class="flex flex-col gap-10">
          <a v-for="item in items" :key="item.id" href="#"
            >{{ item.name }} <q-icon name="chevron_right" size="24px"
          /></a>
        </div>
      </div>
    </section>
    <div class="q-pa-lg">
      <q-btn
        v-motion-pop
        :delay="700"
        no-caps
        block
        unelevated
        color="primary"
        class="w-full"
        label="Logout"
      />
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const items = [
  { id: 1, name: "Account" },
  { id: 2, name: "Settings & Privacy" },
  { id: 3, name: "Notifications" },
  { id: 4, name: "Device Permissions" },
  { id: 5, name: "Language" },
  { id: 6, name: "Help" },
  { id: 7, name: "About" },
];
</script>

<style scoped lang="scss">
.q-page {
  background-color: #f2f2f7;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  section {
    & > div {
      background-color: #fff;
      border-radius: 16px;
      & > .flex {
        gap: 60px;
        a {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
      }
    }
  }
}
</style>
