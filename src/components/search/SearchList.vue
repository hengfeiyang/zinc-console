<template>
  <div class="col column q-my-md q-ml-md">
    <div style="display: none">histogram</div>
    <div class="search-list">
      <q-table
        v-model:expanded="searchResult._source"
        :rows="searchResult"
        :columns="resultColumns"
        wrap-cells
        title="Search Results"
        row-key="_id"
        :pagination="pagination"
      >
        <template #top-right>
          <div class="text-subtitle1">{{ resultCount }}</div>
        </template>

        <template #header="props">
          <q-tr :props="props">
            <q-th auto-width />
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template #body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-btn
                size="sm"
                color="secondary"
                round
                dense
                :icon="props.expand ? 'remove' : 'add'"
                @click="props.expand = !props.expand"
              />
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <pre class="expanded">{{
                JSON.stringify(props.row, null, 2)
              }}</pre>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script>
import { defineComponent, nextTick, ref } from "vue";
import { date } from "quasar";

import searchService from "../../services/search";

export default defineComponent({
  name: "ComponentSearchSearchList",
  setup() {
    // Accessing nested JavaScript objects and arrays by string path
    // https://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-and-arrays-by-string-path
    Object.byString = function (o, s) {
      if (s == undefined) {
        return "";
      }
      s = s.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
      s = s.replace(/^\./, ""); // strip a leading dot
      var a = s.split(".");
      for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (typeof o == "object" && k in o) {
          o = o[k];
        } else {
          return;
        }
      }
      return o;
    };

    const defaultColumns = () => {
      return [
        {
          name: "@timestamp",
          field: (row) =>
            date.formatDate(row["@timestamp"], "MMM DD, YYYY HH:mm:ss.SSS Z"),
          label: "@timestamp",
          align: "left",
          sortable: true,
        },
        {
          name: "_source",
          field: (row) => JSON.stringify(row),
          label: "_source",
          align: "left",
          sortable: true,
        },
      ];
    };

    const searchResult = ref([]);
    const resultCount = ref("");
    const resultColumns = ref(defaultColumns());

    let lastIndexName = "";
    const searchData = (indexData, queryData) => {
      searchService
        .search({ index: indexData.name, query: { query: { match_all: {} } } })
        .then((res) => {
          if (lastIndexName != "" && lastIndexName != indexData.name) {
            resetColumns(indexData);
          }
          lastIndexName = indexData.name;

          var results = [];
          if (res.data.hits.hits) {
            results = res.data.hits.hits;
          }

          nextTick(() => {
            searchResult.value = results;
            resultCount.value =
              "Found " +
              res.data.hits.total.value.toLocaleString() +
              " records in " +
              res.data.took +
              " milliseconds";
          });
        });
    };

    const resetColumns = (indexData) => {
      resultColumns.value = defaultColumns();
      if (indexData.columns.length == 0) {
        return;
      }

      // remove _source column
      resultColumns.value.splice(1);

      // add all the selected fields one by one
      for (let i = 0; i < indexData.columns.length; i++) {
        var newCol = {
          name: indexData.columns[i],
          label: indexData.columns[i],
          field: (row) => Object.byString(row._source, indexData.columns[i]),
          align: "left",
          sortable: true,
        };

        resultColumns.value.push(newCol);
      }
    };

    return {
      searchData,
      resetColumns,
      resultColumns,
      searchResult,
      resultCount,
      pagination: {
        rowsPerPage: 20,
      },
    };
  },
});
</script>

<style lang="scss">
.search-list {
  width: 100%;
  .q-table thead tr,
  .q-table tbody td {
    height: 38px;
  }
  .q-table__bottom {
    min-height: 40px;
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>
