import { route } from "quasar/wrappers";
import { createRouter, createWebHashHistory } from "vue-router";
import routes from "./routes";
import setupBeforeEach from "./BeforeEach";

export default route(function () {
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }), // Ensures smooth scrolling behavior
    routes, // Load routes from the defined routes file
    history: createWebHashHistory(process.env.VUE_ROUTER_BASE), // Use hash-based history
  });

  setupBeforeEach(Router); // Apply the beforeEach logic to the router

  return Router;
});
