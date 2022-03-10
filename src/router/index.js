import { createRouter, createWebHistory } from "vue-router";
import store from "../store/index.js";

import About from "../views/About.vue";
import Index from "../views/Index.vue";
import Login from "../views/Login.vue";
import Search from "../views/Search.vue";
import Template from "../views/Template.vue";
import User from "../views/User.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Search,
  },
  {
    path: "/search",
    name: "search",
    component: Search,
  },
  {
    path: "/index",
    name: "index",
    component: Index,
  },
  {
    path: "/template",
    name: "template",
    component: Template,
  },
  {
    path: "/user",
    name: "user",
    component: User,
  },
  {
    path: "/about",
    name: "about",
    component: About,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("../views/Error404.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(window.location.pathname),
  routes,
});

router.beforeEach((to, from, next) => {
  var isAuthenticated = store.state.user.isLoggedIn;

  if (to.path !== "/login" && !isAuthenticated) {
    next({ path: "/login" });
  } else {
    next();
  }
});

export default router;
