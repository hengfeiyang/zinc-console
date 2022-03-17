<template>
  <q-page class="q-pa-md">
    <div class="column">
      <search-bar />
      <div class="row">
        <index-menu />
        <search-list />
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

import SearchBar from "../components/search/SearchBar.vue";
import IndexMenu from "../components/search/IndexMenu.vue";
import SearchList from "../components/search/SearchList.vue";

export default defineComponent({
  name: "PageSearch",
  components: {
    SearchBar,
    IndexMenu,
    SearchList,
  },
});
</script>
