// src/router/beforeEach.js

export default function (router) {
  router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem("access-token");
    const isMobile = window.innerWidth <= 768; // Example breakpoint for mobile screens

    if (to.meta.requiresAuth && !isAuthenticated) {
      // Redirect to login based on screen size
      if (isMobile) {
        next({ name: "login" }); // Mobile login route
      } else {
        next({ name: "web-login" }); // Desktop login route
      }
    } else {
      // Proceed to the route
      next();
    }
  });
}
