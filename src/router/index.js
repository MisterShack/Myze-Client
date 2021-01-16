import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Portfolio from "../views/Portfolio.vue";
import Account from "../views/Account.vue";
import Callback from "../views/Callback.vue";

import { routeGuard } from "@/auth";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      layout: "HomeLayout",
    },
  },
  {
    path: "/portfolio",
    name: "Portfolio",
    component: Portfolio,
    beforeEnter: routeGuard,
  },
  {
    path: "/portfolio/:id",
    name: "Account",
    component: Account,
    beforeEnter: routeGuard,
  },
  {
    path: "/callback",
    name: "Callback",
    component: Callback,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
