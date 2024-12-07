// src/router/beforeEach.js

export default function (router) {
  router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem("access-token");
    const isMobile = window.innerWidth <= 768; // Example breakpoint for mobile screens

    // If the route requires authentication and the user is not authenticated
    if (to.meta.requiresAuth && !isAuthenticated) {
      // Redirect to the appropriate login page based on device type
      if (isMobile) {
        next({ name: "login", query: { redirectTo: to.fullPath } }); // Mobile login route with redirect
      } else {
        next({ name: "web-login", query: { redirectTo: to.fullPath } }); // Desktop login route with redirect
      }
    } else if (!to.meta.requiresAuth && isAuthenticated && (to.name === "login" || to.name === "web-login")) {
      const pathName = window.innerWidth <= 768 ? "trending" : "web-dashboard-trending";
      // If the user is already authenticated and trying to access login pages, redirect to dashboard
      next({ name: pathName });
    } else {
      // Proceed to the requested route
      next();
    }
  });
}
