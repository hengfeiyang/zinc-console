<template>
  <div class="column index-menu">
    <div>
      <q-select
        v-model="selectedIndex"
        :options="options"
        filled
        dense
        use-input
        label="Select Index"
        behavior="menu"
        class="q-my-md"
        @filter="filterFn"
        @update:model-value="selectFn"
      >
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <div>index table</div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import indexService from "../../services/index";

export default defineComponent({
  name: "ComponentSearchIndexSelect",
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["updated"],
  setup(props, { emit }) {
    const selectedIndex = ref(props.data.name);
    const selectedFields = ref(props.data.columns);
    const indexList = ref([]);
    const mappingList = ref({});
    const options = ref([]);

    // filter the values when value is being typed in index field
    const filterFn = (val, update) => {
      if (val === "") {
        update(() => {
          options.value = indexList.value;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        options.value = indexList.value.filter(
          (v) => v.value.toLowerCase().indexOf(needle) > -1
        );
      });
    };

    const selectFn = (index) => {
      selectedFields.value = [];
      for (var k in mappingList.value[index.value]) {
        if (k != "_id") {
          selectedFields.value.push({});
        }
      }

      emit("updated", {
        name: index.value,
        columns: selectedFields.value,
      });
    };

    // get the list of indices from server when the component is mounted
    const getIndexList = () => {
      indexService.list().then((res) => {
        res.data.map((item) => {
          indexList.value.push({
            label: item.name,
            value: item.name,
          });
          mappingList.value[item.name] = item.mappingns;
        });
        selectedIndex.value = indexList.value[0];
        selectFn(selectedIndex.value);
      });
    };

    getIndexList();

    return {
      selectedIndex,
      selectedFields,
      mappingList,
      options,
      filterFn,
      selectFn,
    };
  },
});
</script>

<style lang="scss">
.index-menu {
  width: 220px;
}
</style>
