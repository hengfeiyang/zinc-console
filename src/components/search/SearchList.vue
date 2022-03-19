<template>
  <div class="column">
    <div>histogram</div>
    <div>search list</div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ComponentSearchSearchList",
  setup() {
    const searchData = (indexData, queryData) => {
      console.log("searchList:searchData:indexData.name", indexData.name);
      console.log("searchList:searchData:indexData.column", indexData.column);
      console.log("searchList:searchData:queryData.query", queryData.query);
      console.log("searchList:searchData:queryData.time", queryData.time);
    };
    return { searchData };
  },
});
</script>
