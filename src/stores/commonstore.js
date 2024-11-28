// src/stores/commonstore.js

import { defineStore } from "pinia";
import { api } from "boot/axios";

export const useCommonStore = defineStore("common", {
  state: () => ({}),
  actions: {
    subscribeToNewsletter: async (email) => {
      try {
        const response = await api.post("/misc/subscribe", {
          email: email,
        });
        if (response?.data?.success) {
          return response?.data?.message;
        }
        return response?.data?.message;
      } catch (error) {
        console.error(error);
        return error?.response?.data?.message || "Something went wrong!";
      }
    },
  },
});
