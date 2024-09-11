const routes = [
  {
    path: "/",
    component: () => import("layouts/RegularLayout.vue"),
    children: [{ path: "", component: () => import("src/pages/web/home.vue") }],
  },
  {
    path: "/app",
    component: () => import("src/layouts/AppRegularLayout.vue"),
    children: [
      {
        path: "getting-started",
        name: "getting-started",
        component: () => import("src/layouts/AppPlainLayout.vue"),
        children: [
          {
            path: "",
            component: () =>
              import("src/pages/app/view/getting-started/index.vue"),
          },
          {
            path: "introduction",
            name: "introduction",
            component: () =>
              import("src/pages/app/view/getting-started/Introduction.vue"),
          },
        ],
      },
      {
        path: "auth",
        name: "auth",
        component: () => import("src/layouts/AppPlainLayout.vue"),
        children: [
          {
            path: "",
            component: () => import("src/pages/app/view/auth/index.vue"),
          },
          {
            path: "registration",
            name: "registration",
            component: () =>
              import("src/pages/app/view/auth/registration/index.vue"),
          },
        ],
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
