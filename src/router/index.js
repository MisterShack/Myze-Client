import { createRouter, createWebHistory } from "vue-router";
import { supabase } from "@/supabase";
import { store } from "@/store";

const routes = [
  {
    path: "/",
    alias: "/login",
    name: "Login",
    component: () => import("@/views/auth/Login.vue"),
    meta: {
      public: "strict",
    },
  },
  {
    path: "/signup",
    name: "Signup",
    component: () => import("@/views/auth/Signup.vue"),
    meta: {
      public: "strict",
    },
  },
  {
    path: "/logout",
    name: "Logout",
    component: () => import("@/views/auth/Logout.vue"),
  },
  {
    path: "/overview",
    name: "Overview",
    component: () => import("@/views/Overview.vue"),
  },
  {
    path: "/accounts",
    name: "Accounts",
    component: () => import("@/views/Accounts.vue"),
  },
  {
    path: "/accounts/:id",
    name: "Account",
    component: () => import("@/views/Account.vue"),
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("@/views/Profile.vue"),
  },
  {
    path: "/analytics",
    name: "Analytics",
    component: () => import("@/views/Analytics.vue"),
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("@/views/Settings.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

store.user = supabase.auth.user();

supabase.auth.onAuthStateChange((_, session) => {
  store.user = session.user;
  store.accounts = [];
  store.vendors = [];
  store.categories = [];
  store.recurring = [];
});

function validateRoutes(to, next) {
  const isPublicRoute = to.matched.some((record) => record.meta.public);
  const isOnlyPublicRoute = to.matched.some(
    (record) => record.meta.public === "strict"
  );

  const userIsAuthenticated = !!store.user?.id;

  // If not a public route and the user isn't authenticated, redirect to login
  if (!isPublicRoute && !userIsAuthenticated) {
    return next("/login");
  } else if (userIsAuthenticated && isOnlyPublicRoute) {
    return next("/overview");
  }

  return next();
}

router.beforeEach((to, _, next) => {
  validateRoutes(to, next);
});

export default router;
