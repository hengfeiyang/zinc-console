<template>
  <q-card class="column full-height">
    <q-card-section>
      <div class="row items-center no-wrap">
        <div class="col">
          <div class="text-h6">Add template</div>
        </div>

        <div class="col-auto">
          <q-btn v-close-popup flat round color="grey-7" icon="close" />
        </div>
      </div>
    </q-card-section>

    <q-card-section class="col q-pt-none q-w-p50">
      <q-stepper ref="stepper" v-model="step" color="primary" flat animated>
        <q-step :name="1" title="Logistics" icon="info" :done="step > 1">
          <q-form ref="step1Form">
            <q-input
              v-model="templateData.name"
              borderless
              filled
              :readonly="beingUpdated"
              :disabled="beingUpdated"
              :bg-color="disableColor"
              label="Template Name"
              class="q-py-sm"
            />
            <q-select
              v-model="templateData.index_patterns"
              label="Index Patterns"
              placeholder="Type and then hit `ENTER`"
              filled
              use-input
              use-chips
              multiple
              hide-dropdown-icon
              input-debounce="0"
              new-value-mode="add-unique"
              class="q-py-sm"
            />
            <q-input
              v-model="templateData.name"
              borderless
              filled
              label="Index Patterns"
              class="q-py-sm"
            />
            <q-input
              v-model="templateData.priority"
              borderless
              filled
              label="Priority (optional)"
              class="q-py-sm"
            />
          </q-form>
        </q-step>

        <q-step
          :name="2"
          title="Index settings"
          icon="settings"
          :done="step > 2"
        >
          <q-form ref="step2Form">
            <json-editor
              v-model="json"
              name="settings"
              :height="288"
              @validation-error="onJsonError"
              @updated="onJsonUpdated"
            ></json-editor>
          </q-form>
        </q-step>

        <q-step :name="3" title="Mappings" icon="assignment" :done="step > 3">
          <q-form ref="step3Form">
            <json-editor
              v-model="json"
              name="mappings"
              :height="288"
            ></json-editor>
          </q-form>
        </q-step>

        <q-step :name="4" title="Review" icon="preview">
          <q-form ref="step4Form">
            <json-editor
              v-model="json"
              name="review"
              :height="288"
            ></json-editor>
          </q-form>
        </q-step>

        <template #navigation>
          <q-stepper-navigation>
            <q-btn
              color="primary"
              :disable="disableBtn"
              :label="step === 4 ? 'Save Template' : 'Continue'"
              @click="nextStep"
            />
            <q-btn
              v-if="step > 1"
              flat
              color="primary"
              :disable="disableBtn"
              label="Back"
              class="q-ml-sm"
              @click="$refs.stepper.previous()"
            />
          </q-stepper-navigation>
        </template>
      </q-stepper>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent, ref } from "vue";
import JsonEditor from "../components/JsonEditor.vue";

export default defineComponent({
  name: "ComponentAddUpdateTemplate",
  components: {
    JsonEditor,
  },
  props: {
    user: {
      type: Object,
      default: null,
    },
  },
  emits: ["added", "updated"],
  setup() {
    const beingUpdated = ref(false);
    const roles = ref(["admin", "user"]);
    const addUserForm = ref(null);
    const disableColor = ref("");
    const disableBtn = ref(false);
    const templateData = ref({
      _id: "",
      name: "",
      role: "",
      password: "",
      confirmPassword: "",
    });

    return {
      step: ref(1),
      disableColor,
      disableBtn,
      placeholderIndexSettings: ref(`{
  "analysis": {
    "analyzer": {
      "default": {
        "type": "standard"
      }
    }
  }
}`),
      placeholderMappings: ref(`{
  "properties": {
    "content": {
      "type": "text",
      "index": true,
      "store": false,
      "sortable": false,
      "aggregatable": false,
      "highlightable": false
    }
  }
}`),
      beingUpdated,
      roles,
      templateData,
      addUserForm,
      json: ref(""),
      onJsonError(error) {
        if (error && error.length > 0) {
          console.log("error", error);
          disableBtn.value = true;
        } else {
          disableBtn.value = false;
        }
      },
      onJsonUpdated(json) {
        console.log("update", json);
        templateData.value.settings = json;
      },
    };
  },
  created() {
    if (this.user && this.user.id) {
      this.beingUpdated = true;
      this.disableColor = "grey-5";
      this.templateData = {
        _id: this.user.id,
        name: this.user.name,
        role: this.user.role,
        password: "",
        confirmPassword: "",
      };
    }
  },
  methods: {
    nextStep() {
      if (this.step == 4) {
        console.log("save");
        this.$emit("added", {});
      } else {
        this.$refs.stepper.next();
      }
    },
    onSubmit() {
      this.addUserForm.validate().then((valid) => {
        if (!valid) {
          console.log("Form is invalid");
          return false;
        }
        console.log("Form is valid");
        axios
          .put(this.$store.state.API_ENDPOINT + "api/user", this.templateData)
          .then((response) => {
            var data = response.data;
            this.templateData = {
              _id: "",
              name: "",
              password: "",
              confirmPassword: "",
              role: "",
            };

            if (this.beingUpdated) {
              this.$emit("updated", data);
            } else {
              this.$emit("added", data);
            }
            this.addUserForm.resetValidation();
          });
      });
    },
  },
});
</script>
