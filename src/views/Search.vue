<template>
  <q-page class="q-pa-md">
    <div class="column">
      <search-bar
        :data="queryData"
        @updated="queryUpdated"
        @refresh="searchData"
      />
      <div class="row">
        <index-menu :data="indexData" @updated="indexUpdated" />
        <search-list ref="searchList" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";

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
  setup() {
    const indexData = ref({
      name: "",
      column: [],
    });
    const queryData = ref({
      query: "",
      time: {},
    });

    const searchList = ref(null);
    const searchData = () => {
      searchList.value.searchData(indexData.value, queryData.value);
    };

    const indexUpdated = (name, column) => {
      indexData.value.name = name;
      indexData.value.column = column;
      searchData();
    };
    const queryUpdated = ({ query, time }) => {
      queryData.value.query = query;
      queryData.value.time = time;
      searchData();
    };

    return {
      indexData,
      queryData,
      searchList,
      searchData,
      indexUpdated,
      queryUpdated,
    };
  },
});
</script>
