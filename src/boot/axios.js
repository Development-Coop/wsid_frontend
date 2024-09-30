import { boot } from "quasar/wrappers";
import axios from "axios";

// Create a custom axios instance
const api = axios.create({
  baseURL: "https://wsi-be.netlify.app/api",
  headers: {
    "Content-Type": "application/json",
  }
});

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
