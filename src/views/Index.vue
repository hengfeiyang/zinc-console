<template>
  <q-page class="q-pa-md">
    <q-table
      title="Indexes"
      :rows="indexes"
      row-key="id"
      :pagination="pagination"
      :filter="filterQuery"
      :filter-method="filterData"
    >
      <template #top-right>
        <q-input
          v-model="filterQuery"
          filled
          borderless
          dense
          placeholder="Search index"
        >
          <template #append>
            <q-icon name="search" class="cursor-pointer" />
          </template>
        </q-input>
        <q-btn
          class="q-ml-sm"
          color="primary"
          icon="add"
          label="Add index"
          @click="addIndex"
        />
      </template>

      <template v-slot:body-cell-#="props">
        <q-td :props="props" width="80">
          {{ props.value }}
        </q-td>
      </template>
      <template #body-cell-name="props">
        <q-td :props="props" auto-width>
          <a
            class="text-primary text-decoration-none"
            @click="previewIndex(props)"
          >
            {{ props.value }}
          </a>
        </q-td>
      </template>
      <template #body-cell-actions="props">
        <q-td :props="props" auto-width>
          <q-btn
            dense
            unelevated
            size="sm"
            color="blue-5"
            class="action-button"
            icon="description"
            @click="previewIndex(props)"
          />
          <q-btn
            dense
            unelevated
            size="sm"
            color="red-5"
            class="action-button q-ml-sm"
            icon="delete"
            @click="deleteIndex(props)"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog
      v-model="showAddIndexDialog"
      position="right"
      full-height
      seamless
      maximized
    >
      <add-update-index @updated="indexAdded" />
    </q-dialog>

    <q-dialog
      v-model="showUpdateIndexDialog"
      position="right"
      full-height
      seamless
      maximized
    >
      <add-update-index v-model="index" @updated="indexUpdated" />
    </q-dialog>

    <q-dialog
      v-model="showPreviewIndexDialog"
      position="right"
      full-height
      maximized
    >
      <preview-index v-model="index" />
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { useQuasar, date } from "quasar";
import axios from "../axios";

import AddUpdateIndex from "../components/AddUpdateTemplate.vue";
import PreviewIndex from "../components/PreviewTemplate.vue";

export default defineComponent({
  name: "PageIndex",
  components: {
    AddUpdateIndex,
    PreviewIndex,
  },
  setup() {
    const store = useStore();
    const $q = useQuasar();

    const indexes = ref([]);
    const getIndexes = () => {
      axios.get(store.state.API_ENDPOINT + "api/index").then((response) => {
        var counter = 1;
        indexes.value = response.data.map((data) => {
          return {
            "#": counter++,
            name: data.name,
            docs_count: data.docs_count,
            storage_size: data.storage_size,
            storage_type: data.storage_type,
            actions: "",
          };
        });
      });
    };

    getIndexes();

    const index = ref({});
    const showAddIndexDialog = ref(false);
    const showUpdateIndexDialog = ref(false);
    const showPreviewIndexDialog = ref(false);

    const addIndex = () => {
      showAddIndexDialog.value = true;
    };
    const editIndex = (props) => {
      index.value = props.row;
      showUpdateIndexDialog.value = true;
    };
    const deleteIndex = (props) => {
      $q.dialog({
        title: "Delete template",
        message:
          "You are about to delete this template: <ul><li>" +
          props.row.name +
          "</li></ul>",
        cancel: true,
        persistent: true,
        html: true,
      }).onOk(() => {
        axios
          .delete(store.state.API_ENDPOINT + "api/index/" + props.row.name)
          .then(() => {
            getIndexes();
          });
      });
    };

    const previewIndex = (props) => {
      index.value = props.row;
      showPreviewIndexDialog.value = true;
    };

    return {
      showAddIndexDialog,
      showUpdateIndexDialog,
      showPreviewIndexDialog,
      index,
      indexes,
      pagination: {
        rowsPerPage: 20,
      },
      filterQuery: ref(""),
      filterData(rows, terms) {
        var filtered = [];
        terms = terms.toLowerCase();
        for (var i = 0; i < rows.length; i++) {
          if (rows[i]["name"].toLowerCase().includes(terms)) {
            filtered.push(rows[i]);
          }
        }
        return filtered;
      },
      addIndex,
      editIndex,
      deleteIndex,
      previewIndex,
      indexAdded() {
        showAddIndexDialog.value = false;
        getIndexes();
      },
      indexUpdated() {
        showUpdateIndexDialog.value = false;
        getIndexes();
      },
    };
  },
});
</script>
