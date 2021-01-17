import { watch } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Portfolio from "@/views/Portfolio.vue";
import Account from "@/views/Account.vue";
import Login from "@/views/auth/Login.vue";
import Signup from "@/views/auth/Signup.vue";
import { user, initialized } from "@/auth/index.js";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      layout: "HomeLayout",
      public: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      public: true,
    },
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
    meta: {
      public: true,
    },
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

router.beforeEach((to, _, next) => {
  if (initialized.value) {
    if (!to.matched.some((record) => record.meta.public) && !user.value) {
      return next("/login");
    }

    next();
  } else {
    watch(
      () => initialized.value,
      (newVal) => {
        if (newVal) {
          if (!to.matched.some((record) => record.meta.public) && !user.value) {
            return next("/login");
          }

          next();
        }
      }
    );
  }
});

export default router;
