<template>
  <q-page style="max-width: 600px; margin: 0 auto">
    <section class="q-pa-lg pq-pb-lg">
      <div class="text-h6 q-pa-lg">
        <div class="flex flex-col gap-10">
          <div v-for="item in items" :key="item.id" :href="item.path">
            {{ item.name }}
            <q-icon name="chevron_right" size="24px" />
          </div>
        </div>
      </div>
    </section>
    <div class="q-pa-lg">
      <q-btn
        no-caps
        block
        unelevated
        color="primary"
        class="w-full"
        label="Logout"
        @click="logout"
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

const logout = () => {
  localStorage.clear();
  router.push("/auth/web-login?tab=login");
};
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
        gap: 40px;
        div {
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
