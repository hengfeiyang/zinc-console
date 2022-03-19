<template>
  <div class="col column q-my-md q-ml-md">
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
      console.log("searchList:searchData:indexData.columns", indexData.columns);
      console.log("searchList:searchData:queryData.query", queryData.query);
      console.log("searchList:searchData:queryData.time", queryData.time);
    };
    return { searchData };
  },
});
</script>
