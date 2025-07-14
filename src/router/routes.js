const routes = [
  {
    path: "",
    component: () => import("layouts/RegularLayout.vue"),
    children: [
      { path: "", component: () => import("src/pages/web/Beta.vue") },
      { path: "beta", component: () => import("src/pages/web/Beta.vue") },
      {
        path: "terms-conditions",
        name: "terms-conditions",
        component: () =>
          import("src/pages/TermsConditions/TermsAndConditions.vue"),
      },
      {
        path: "privacy-policy",
        name: "privacy-policy",
        component: () => import("src/pages/TermsConditions/PrivacyPolicy.vue"),
      },
      {
        path: "about-us",
        name: "about-us",
        component: () => import("src/pages/AboutUs.vue"),
      },
    ],
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
        path: "web-set-password",
        name: "web-set-password",
        component: () => import("pages/web/SetPassword.vue"),
      },
      {
        path: "web-forgot-password",
        name: "web-forgot-password",
        component: () => import("pages/web/ForgotPassword.vue"),
      },
      {
        path: "web-reset-password",
        name: "web-reset-password",
        component: () => import("pages/web/ResetPassword.vue"),
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
        path: "/web/dashboard/home",
        name: "web-dashboard-home",
        component: () => import("src/pages/web/dashboard/dashboardhome.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/web/dashboard/search",
        name: "web-dashboard-search",
        component: () => import("src/pages/web/dashboard/search.vue"),
        meta: { requiresAuth: true },
        children: [
          {
            path: "",
            name: "web-search-account",
            component: () =>
              import("src/pages/app/view/dashboard/searchAccount.vue"),
            meta: { requiresAuth: true },
          },
          {
            path: "post",
            name: "search-post",
            component: () =>
              import("src/pages/app/view/dashboard/searchPost.vue"),
            meta: { requiresAuth: true },
          },
        ],
      },
      {
        path: "/web/dashboard/trending",
        name: "web-dashboard-trending",
        component: () => import("src/pages/web/dashboard/trending.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/web/dashboard/profile",
        name: "web-dashboard-profile",
        component: () => import("src/pages/web/dashboard/profile.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/web/settings",
        name: "web-settings",
        component: () => import("src/pages/web/settings.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/web/dashboard/view-profile",
        name: "web-dashboard-view-profile",
        component: () => import("src/pages/web/dashboard/OthersProfile.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
  // {
  //   path: "/app",
  //   component: () => import("src/layouts/AppRegularLayout.vue"),
  //   children: [
  //     {
  //       path: "getting-started",
  //       name: "getting-started",
  //       component: () => import("src/layouts/AppPlainLayout.vue"),
  //       children: [
  //         {
  //           path: "",
  //           component: () =>
  //             import("src/pages/app/view/getting-started/index.vue"),
  //         },
  //         {
  //           path: "introduction",
  //           name: "introduction",
  //           component: () =>
  //             import("src/pages/app/view/getting-started/Introduction.vue"),
  //         },
  //       ],
  //     },
  //     {
  //       path: "auth",
  //       name: "auth",
  //       component: () => import("src/layouts/AppPlainLayout.vue"),
  //       children: [
  //         {
  //           path: "",
  //           component: () => import("src/pages/app/view/auth/index.vue"),
  //         },
  //         {
  //           path: "registration",
  //           name: "registration",
  //           component: () =>
  //             import("src/pages/app/view/auth/registration/index.vue"),
  //         },
  //         {
  //           path: "otp-verification",
  //           name: "otp-verification",
  //           component: () =>
  //             import(
  //               "src/pages/app/view/auth/registration/otp-verification.vue"
  //             ),
  //         },
  //         {
  //           path: "set-password",
  //           name: "set-password",
  //           component: () =>
  //             import("src/pages/app/view/auth/registration/set-password.vue"),
  //         },
  //         {
  //           path: "set-user-id",
  //           name: "set-user-id",
  //           component: () =>
  //             import("src/pages/app/view/auth/registration/set-username.vue"),
  //         },
  //         {
  //           path: "set-profile",
  //           name: "set-profile",
  //           component: () =>
  //             import("src/pages/app/view/auth/registration/set-profile.vue"),
  //         },
  //         {
  //           path: "add-bio",
  //           name: "add-bio",
  //           component: () =>
  //             import("src/pages/app/view/auth/registration/add-bio.vue"),
  //         },
  //         {
  //           path: "login",
  //           name: "login",
  //           component: () => import("src/pages/app/view/auth/login/index.vue"),
  //         },
  //         {
  //           path: "enter-password",
  //           name: "enter-password",
  //           component: () =>
  //             import("src/pages/app/view/auth/login/password.vue"),
  //         },
  //         {
  //           path: "forgot-password",
  //           name: "forgot-password",
  //           component: () =>
  //             import("src/pages/app/view/auth/forgot-password/index.vue"),
  //         },
  //         {
  //           path: "reset-password",
  //           name: "reset-password",
  //           component: () =>
  //             import(
  //               "src/pages/app/view/auth/forgot-password/reset-password.vue"
  //             ),
  //         },
  //       ],
  //     },
  //     {
  //       path: "dashboard", // Ensure the path starts with a leading slash
  //       name: "dashboard",
  //       component: () => import("src/layouts/AppDashboardLayout.vue"),
  //       children: [
  //         {
  //           path: "", // Default child route for "dashboard"
  //           component: () => import("src/pages/app/view/dashboard/layout.vue"),
  //           children: [
  //             {
  //               path: "trending", // Default child route for "layout"
  //               name: "trending",
  //               component: () =>
  //                 import("src/pages/app/view/dashboard/trending.vue"),
  //               meta: { requiresAuth: true },
  //             },
  //             {
  //               path: "favourites",
  //               name: "favourites",
  //               component: () =>
  //                 import("src/pages/app/view/dashboard/favourites.vue"),
  //               meta: { requiresAuth: true },
  //             },
  //             {
  //               path: "",
  //               name: "following",
  //               component: () =>
  //                 import("src/pages/app/view/dashboard/following.vue"),
  //               meta: { requiresAuth: true },
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       path: "search",
  //       name: "app-search",
  //       component: () => import("src/layouts/AppDashboardLayout.vue"),
  //       children: [
  //         {
  //           path: "",
  //           component: () => import("src/pages/app/view/dashboard/search.vue"),
  //           children: [
  //             {
  //               path: "",
  //               name: "app-search-account",
  //               component: () =>
  //                 import("src/pages/app/view/dashboard/searchAccount.vue"),
  //               meta: { requiresAuth: true },
  //             },
  //             {
  //               path: "post",
  //               name: "search-post",
  //               component: () =>
  //                 import("src/pages/app/view/dashboard/searchPost.vue"),
  //               meta: { requiresAuth: true },
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       path: "view-question",
  //       component: () => import("src/layouts/AppPlainLayout.vue"),
  //       children: [
  //         {
  //           path: "",
  //           name: "view-question",
  //           component: () =>
  //             import("src/pages/web/components/view-question.vue"),
  //           meta: { requiresAuth: true },
  //         },
  //       ],
  //     },
  //     {
  //       path: "ask-question",
  //       name: "ask-question",
  //       component: () => import("src/layouts/AppPlainLayout.vue"),
  //       children: [
  //         {
  //           path: "",
  //           component: () =>
  //             import("src/components/ask-question.vue"),
  //           meta: { requiresAuth: true },
  //         },
  //       ],
  //     },
  //     {
  //       path: "profile",
  //       name: "app-profile",
  //       component: () => import("src/layouts/AppDashboardLayout.vue"),
  //       children: [
  //         {
  //           path: "",
  //           name: "view-profile",
  //           component: () =>
  //             import("src/pages/app/view/dashboard/profile/profile.vue"),
  //           meta: { requiresAuth: true },
  //         },
  //         {
  //           path: "view",
  //           name: "view",
  //           component: () =>
  //             import("src/pages/app/view/dashboard/profile/viewProfile.vue"),
  //           meta: { requiresAuth: true },
  //         },
  //         {
  //           path: "edit-profile",
  //           component: () =>
  //             import("src/pages/app/view/dashboard/profile/editProfile.vue"),
  //           meta: { requiresAuth: true },
  //         },
  //         {
  //           path: "settings",
  //           component: () =>
  //             import("src/pages/app/view/dashboard/profile/settings.vue"),
  //           meta: { requiresAuth: true },
  //         },
  //       ],
  //     },
  //     {
  //       path: "trending",
  //       component: () => import("src/layouts/AppDashboardLayout.vue"),
  //       children: [
  //         {
  //           path: "",
  //           component: () =>
  //             import("src/pages/app/view/dashboard/trending.vue"),
  //           meta: { requiresAuth: true },
  //         },
  //       ],
  //     },
  //   ],
  // },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
