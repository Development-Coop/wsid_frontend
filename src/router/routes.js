const routes = [
  {
    path: "/",
    component: () => import("layouts/RegularLayout.vue"),
    children: [{ path: "", component: () => import("src/pages/web/home.vue") }],
  },
  {
    path: "/app",
    component: () => import("layouts/RegularLayout.vue"),
    children: [
      { path: "", component: () => import("src/pages/app/view/home.vue") },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
