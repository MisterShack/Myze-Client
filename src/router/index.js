import { watch } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { user, initialized } from "@/auth/index.js";

const Home = () => import("@/views/Home.vue");
const Login = () => import("@/views/auth/Login.vue");
const Signup = () => import("@/views/auth/Signup.vue");
const Logout = () => import("@/views/auth/Logout.vue");
const Portfolio = () => import("@/views/Portfolio.vue");
const Account = () => import("@/views/Account.vue");

const routes = [
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: {
      layout: "HomeLayout",
      public: true,
    },
  },
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
    path: "/portfolio",
    name: "Portfolio",
    component: Portfolio,
  },
  {
    path: "/portfolio/:id",
    name: "Account",
    component: Account,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

function validateRoutes(to, next, user) {
  const isPublicRoute = to.matched.some((record) => record.meta.public);
  const isOnlyPublicRoute = to.matched.some(
    (record) => record.meta.public === "strict"
  );
  const userIsAuthenticated = user.value;

  // If not a public route and the user isn't authenticated, redirect to login
  if (!isPublicRoute && !userIsAuthenticated) {
    return next("/login");
  } else if (userIsAuthenticated && isOnlyPublicRoute) {
    return next("/portfolio");
  }

  return next();
}

router.beforeEach((to, _, next) => {
  if (initialized.value) {
    validateRoutes(to, next, user);
  } else {
    watch(
      () => initialized.value,
      (newVal) => {
        if (newVal) {
          validateRoutes(to, next, user);
        }
      }
    );
  }
});

export default router;
