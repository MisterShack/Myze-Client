import { createRouter, createWebHistory } from "vue-router";
import { realm } from "@/realm";

const Login = () => import("@/views/auth/Login.vue");
const Signup = () => import("@/views/auth/Signup.vue");
const Logout = () => import("@/views/auth/Logout.vue");
const Overview = () => import("@/views/Overview.vue");
const Accounts = () => import("@/views/Accounts.vue");
const Profile = () => import("@/views/Profile.vue");
const Settings = () => import("@/views/Settings.vue");
const Account = () => import("@/views/Account.vue");

const routes = [
  {
    path: "/",
    alias: "/login",
    name: "Login",
    component: Login,
    meta: {
      public: "strict",
    },
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
    meta: {
      public: "strict",
    },
  },
  {
    path: "/logout",
    name: "Logout",
    component: Logout,
  },
  {
    path: "/overview",
    name: "Overview",
    component: Overview,
  },
  {
    path: "/accounts",
    name: "Accounts",
    component: Accounts,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },
  {
    path: "/accounts/:id",
    name: "Account",
    component: Account,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

function validateRoutes(to, next) {
  const isPublicRoute = to.matched.some((record) => record.meta.public);
  const isOnlyPublicRoute = to.matched.some(
    (record) => record.meta.public === "strict"
  );
  const userIsAuthenticated = !!realm.currentUser.value;

  console.log(userIsAuthenticated);

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
