<template>
  <div class="row justify-between">
    <div class="col row justify-between">
      <div class="col">
        <q-input
          v-model="searchQuery"
          placeholder="Type your search query here"
          dense
          filled
          type="search"
          class="search-field"
          @change="searchData"
          @keycode.enter="searchData"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div><syntax-guide /></div>
      <div class="q-ml-sm"><date-time v-model="dateVal" /></div>
    </div>
    <div class="q-ml-sm search-time">
      <q-btn-group spread>
        <q-btn
          dense
          color="primary"
          label=""
          :icon="refreshIcon"
          class="q-pa-sm"
          @click="searchData"
        />
        <q-btn-dropdown
          color="primary"
          class="q-pa-sm search-dropdown"
          no-caps
          :label="refreshTime"
        >
          <q-list>
            <q-item
              v-for="item in refreshTimes"
              :key="item"
              v-close-popup
              dense
              clickable
              @click="refreshTimeChange(item)"
            >
              <q-item-section>
                <q-item-label>{{ item }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-btn-group>
    </div>
  </div>
</template>

<script>
import { defineComponent, nextTick, watch, ref } from "vue";

import DateTime from "./DateTime.vue";
import SyntaxGuide from "./SyntaxGuide.vue";

export default defineComponent({
  name: "ComponentSearchSearchBar",
  components: {
    DateTime,
    SyntaxGuide,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["updated", "refresh"],
  setup(props, { emit }) {
    const searching = ref(false);
    const refreshIcon = ref("refresh");
    const refreshTime = ref("Off");
    const refreshTimes = [
      "Off",
      "5s",
      "10s",
      "15s",
      "30s",
      "1m",
      "5m",
      "15m",
      "30m",
      "1h",
      "2h",
      "1d",
    ];
    const refreshTimeChange = (time) => {
      refreshTime.value = time;
    };

    const searchQuery = ref(props.data.query);

    const dateVal = ref({
      tab: "relative",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",

      selectedRelativePeriod: "Minutes",
      selectedRelativeValue: 30,
      selectedFullTime: false,
    });

    // when the datetime filter changes then update the results
    watch(dateVal.value, () => {
      refreshIcon.value = "search";
      if (searchQuery.value.length > 0) {
        searchData("querystring");
      } else {
        searchData("alldocuments");
      }
    });

    const searchData = () => {
      if (searching.value) {
        return;
      }
      refreshIcon.value = "refresh";
      searching.value = true;
      emit("updated", {
        query: searchQuery.value,
        time: dateVal.value,
      });
      nextTick(() => {
        searching.value = false;
      });
    };

    return {
      searching,
      searchQuery,
      dateVal,
      refreshIcon,
      refreshTime,
      refreshTimes,
      refreshTimeChange,
      searchData,
    };
  },
});
</script>

<style lang="scss">
.search-field .q-field__control {
  border-radius: 4px 0 0 0;
}
.search-time {
  width: 120px;
}
.search-dropdown {
  width: 60px !important;
}
</style>
