<template>
  <q-page class="q-pa-lg">
    <h3 class="q-ma-none">Zinc</h3>
    <p class="q-mt-md">A morden search engine.</p>

    <q-list class="rounded-borders" style="max-width: 500px">
      <q-item-label header>Build Info</q-item-label>

      <q-item v-ripple clickable>
        <q-item-section>
          <q-item-label lines="1">Version</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label caption>{{ version.Version }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item v-ripple clickable>
        <q-item-section>
          <q-item-label lines="1">Build</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label caption>{{ version.Build }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item v-ripple clickable>
        <q-item-section>
          <q-item-label lines="1">CommitHash</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label caption>{{ version.CommitHash }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item v-ripple clickable>
        <q-item-section>
          <q-item-label lines="1">Branch</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label caption>{{ version.Branch }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item v-ripple clickable>
        <q-item-section>
          <q-item-label lines="1">BuildDate</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label caption>{{ version.BuildDate }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import axios from "../axios";

export default defineComponent({
  name: "PageAbout",

  setup() {
    const store = useStore();

    const version = ref({});
    const getVersion = () => {
      axios.get(store.state.API_ENDPOINT + "version").then((response) => {
        version.value = response.data;
      });
    };
    getVersion();

    return {
      version,
    };
  },
});
</script>
