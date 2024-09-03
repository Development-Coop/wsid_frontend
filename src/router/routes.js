const routes = [
  {
    path: "/",
    component: () => import("layouts/RegularLayout.vue"),
    children: [{ path: "", component: () => import("pages/web/Home.vue") }],
  },

  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
