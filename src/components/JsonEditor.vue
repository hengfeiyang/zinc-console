<template>
  <div>
    <div class="json-editor"></div>
    <p class="text-red-7 q-ma-none">{{ errorMessage }}</p>
  </div>
</template>

<script>
import JSONEditor from "jsoneditor";
import { ref } from "vue";

export default {
  props: {
    modelValue: {
      type: [String, Number, Object, Array],
      default: () => ({}),
    },
    mode: {
      type: String,
      default: "code",
    },
    name: {
      type: String,
      default: "jsonEditor",
    },
    height: {
      type: Number,
      default: 200,
    },
  },
  emits: ["update:modelValue", "error", "validationError"],
  data() {
    return {
      errorMessage: ref(""),
      jsonEditor: null,
      internalChange: false,
    };
  },
  computed: {
    minHeight() {
      return this.height + "px";
    },
  },
  watch: {
    modelValue: {
      handler(json) {
        if (!this.internalChange) {
          this.setValue(json);
        }
      },
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      console.log("init", this.name, this.mode);
      this.jsonEditor = new JSONEditor(
        this.$el.querySelector(".json-editor"),
        {
          name: this.name,
          mode: this.mode,
          indentation: 2,
          mainMenuBar: false,
          statusBar: false,
          onError: (err) => {
            this.$emit("error", err);
          },
          onValidationError: (err) => {
            if (err && err.length > 0) {
              this.errorMessage = "Invalid JSON format.";
            } else {
              this.errorMessage = "";
            }
            this.$emit("validationError", err);
          },
          onChange: () => {
            this.internalChange = true;
            this.$emit("update:modelValue", this.jsonEditor.getText());
            // prevent infinite loop
            this.$nextTick(() => {
              this.internalChange = false;
            });
          },
        },
        this.modelValue
      );
    },
    setValue(val) {
      if (this.jsonEditor) {
        this.jsonEditor.set(val ? JSON.parse(val) : {});
      }
    },
  },
};
</script>

<style lang="scss">
@import "jsoneditor/dist/jsoneditor.min.css";

.json-editor {
  height: 100%;
}
.jsoneditor {
  border: none;
  .ace_content {
    background: rgba(0, 0, 0, 0.05);
  }
}
.jsoneditor-preview {
  background: rgba(0, 0, 0, 0.05);
  min-height: v-bind(minHeight);
}
.ace-jsoneditor,
textarea.jsoneditor-text {
  min-height: v-bind(minHeight);
}
.ace-jsoneditor .ace_marker-layer .ace_active-line {
  background: rgba(0, 0, 0, 0.05);
}
.ace_gutter {
  display: none;
}
.ace_scroller {
  left: 0 !important;
}
</style>
