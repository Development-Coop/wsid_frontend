const routes = [
  {
    path: "",
    component: () => import("layouts/RegularLayout.vue"),
    children: [{ path: "", component: () => import("src/pages/web/Home.vue") }],
  },
  {
    path: "/auth",
    component: () => import("layouts/WebAuthLayout.vue"),
    redirect: "/auth/web-login",
    children: [
      {
        path: "web-login",
        name: "web-login",
        component: () => import("pages/web/Auth.vue"),
      },
      {
        path: "web-forgot-password",
        name: "web-forgot-password",
        component: () => import("pages/web/ForgotPassword.vue"),
      },
      {
        path: "web-set-username",
        name: "web-set-username",
        component: () => import("pages/web/SetUserName.vue"),
      },
      {
        path: "web-set-bio",
        name: "web-set-bio",
        component: () => import("pages/web/SetBio.vue"),
      },
      {
        path: "web-set-profile",
        name: "web-set-profile",
        component: () => import("pages/web/UploadProfile.vue"),
      },
    ],
  },
  {
    path: "/web",
    component: () => import("src/pages/web/layout.vue"),
    children: [
      {
        path: "/web/dashboard/trending",
        name: "web-dashboard-trending",
        component: () => import("src/pages/web/dashboard/trending.vue"),
      },
      {
        path: "/web/dashboard/profile",
        name: "web-dashboard-profile",
        component: () => import("src/pages/web/dashboard/profile.vue"),
      },
    ],
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
          {
            path: "otp-verification",
            name: "otp-verification",
            component: () =>
              import(
                "src/pages/app/view/auth/registration/otp-verification.vue"
              ),
          },
          {
            path: "set-password",
            name: "set-password",
            component: () =>
              import("src/pages/app/view/auth/registration/set-password.vue"),
          },
          {
            path: "set-user-id",
            name: "set-user-id",
            component: () =>
              import("src/pages/app/view/auth/registration/set-username.vue"),
          },
          {
            path: "set-profile",
            name: "set-profile",
            component: () =>
              import("src/pages/app/view/auth/registration/set-profile.vue"),
          },
          {
            path: "add-bio",
            name: "add-bio",
            component: () =>
              import("src/pages/app/view/auth/registration/add-bio.vue"),
          },
          {
            path: "login",
            name: "login",
            component: () => import("src/pages/app/view/auth/login/index.vue"),
          },
          {
            path: "enter-password",
            name: "enter-password",
            component: () =>
              import("src/pages/app/view/auth/login/password.vue"),
          },
          {
            path: "forgot-password",
            name: "forgot-password",
            component: () =>
              import("src/pages/app/view/auth/forgot-password/index.vue"),
          },
          {
            path: "reset-password",
            name: "reset-password",
            component: () =>
              import(
                "src/pages/app/view/auth/forgot-password/reset-password.vue"
              ),
          },
        ],
      },
      {
        path: "dashboard",
        name: "dashboard",
        component: () => import("src/layouts/AppDashboardLayout.vue"),
        children: [
          {
            path: "",
            component: () => import("src/pages/app/view/dashboard/layout.vue"),
            children: [
              {
                path: "",
                name: "trending",
                component: () =>
                  import("src/pages/app/view/dashboard/trending.vue"),
              },
              {
                path: "favourites",
                name: "favourites",
                component: () =>
                  import("src/pages/app/view/dashboard/favourites.vue"),
              },
              {
                path: "following",
                name: "following",
                component: () =>
                  import("src/pages/app/view/dashboard/following.vue"),
              },
            ],
          },
        ],
      },
      {
        path: "view-question",
        component: () => import("src/layouts/AppPlainLayout.vue"),
        children: [
          {
            path: "",
            name: "view-question",
            component: () =>
              import("src/pages/app/view/dashboard/view-question.vue"),
          },
        ],
      },
      {
        path: "search",
        component: () => import("src/layouts/AppDashboardLayout.vue"),
        children: [
          {
            path: "",
            component: () => import("src/pages/app/view/dashboard/temp.vue"),
          },
        ],
      },
      {
        path: "ask-question",
        name: "ask-question",
        component: () => import("src/layouts/AppPlainLayout.vue"),
        children: [
          {
            path: "",
            component: () =>
              import("src/pages/app/view/dashboard/ask-question.vue"),
          },
        ],
      },
      {
        path: "profile",
        component: () => import("src/layouts/AppDashboardLayout.vue"),
        children: [
          {
            path: "",
            component: () =>
              import("src/pages/app/view/dashboard/profile/profile.vue"),
          },
        ],
      },
      {
        path: "trending",
        component: () => import("src/layouts/AppDashboardLayout.vue"),
        children: [
          {
            path: "",
            component: () => import("src/pages/app/view/dashboard/temp.vue"),
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
