<template>
  <q-layout view="hHh lpR fFf">
    <q-header>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>Zinc Search</q-toolbar-title>

        <div>
          <q-btn-dropdown outline rounded no-caps icon-right="manage_accounts">
            <template v-slot:label>
              <div class="row items-center no-wrap">admin</div>
            </template>
            <q-list>
              <q-item-label header>Account</q-item-label>

              <q-item clickable v-ripple v-close-popup @click="signout">
                <q-item-section avatar>
                  <q-avatar size="md" icon="exit_to_app" color="red" text-color="white" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Sign Out</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="200"
      :breakpoint="500"
      bordered
      class="bg-grey-3"
    >
      <q-list>
        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink.vue";

const linksList = [
  {
    title: "Search",
    icon: "manage_search",
    link: "/search",
  },
  {
    title: "Index",
    icon: "list",
    link: "/index",
  },
  {
    title: "User",
    icon: "people",
    link: "/user",
  },
  {
    title: "About",
    icon: "info",
    link: "/about",
  }
];

import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import router from "./router";

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    const store = useStore();

    function signout () {
      store.dispatch("logout");
      localStorage.setItem("_id", "");
      localStorage.setItem("base64encoded", "");
      localStorage.setItem("name", "");
      localStorage.setItem("role", "");
      router.push("/login");
    }

    

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      signout,
    };
  },
});
</script>
