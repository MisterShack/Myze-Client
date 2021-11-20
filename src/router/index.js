import { createRouter, createWebHistory } from "vue-router";
import { supabase } from "@/supabase";
import { store } from "@/store";

function loadPage(view) {
  return () => {
    import(`../views/${view}.vue`);
  };
}

const routes = [
  {
    path: "/",
    alias: "/login",
    name: "Login",
    component: () => import("../views/auth/Login.vue"),
  },
  {
    path: "/logout",
    name: "Logout",
    component: () => import("../views/auth/Logout.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/accounts",
    name: "Accounts",
    component: () => import("../views/Accounts.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/accounts/:id",
    name: "Account",
    component: () => import("../views/Account.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/Profile.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/analytics",
    name: "Analytics",
    component: () => import("../views/Analytics.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("../views/Settings.vue"),
    meta: {
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

store.user = supabase.auth.user();

supabase.auth.onAuthStateChange(async (_, session) => {
  store.user = session.user;
  await store.loadData();
});

router.beforeEach((to) => {
  const currentUser = store.user;
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) {
    return "/login";
  } else if (!requiresAuth && currentUser) {
    return "/accounts";
  }
});

export default router;
