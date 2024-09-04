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
            path: "ask-questions",
            name: "ask-questions",
            component: () =>
              import("src/pages/app/view/getting-started/AskQuestions.vue"),
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
