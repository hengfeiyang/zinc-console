<template>
  <q-card>
    <q-card-section>
      <div v-if="beingUpdated" class="text-h6">Update User</div>
      <div v-else class="text-h6">Add User</div>
    </q-card-section>
    <q-card-section class="q-w-md">
      <q-form ref="addUserForm" @submit="onSubmit">
        <q-input
          v-model="userData._id"
          dense
          borderless
          filled
          :readonly="beingUpdated"
          :disabled="beingUpdated"
          :bg-color="disableColor"
          label="User ID"
          :rules="[validateUserID]"
        />
        <q-input
          v-model="userData.name"
          dense
          borderless
          filled
          label="User Name"
          :rules="[validateUserName]"
        />
        <q-select
          v-model="userData.role"
          :options="roles"
          dense
          borderless
          filled
          label="Role"
          :rules="[validateUserRole]"
        />
        <q-input
          v-model="userData.password"
          borderless
          dense
          filled
          :type="isPwd ? 'password' : 'text'"
          label="Password"
          :rules="[validatePassword]"
        >
          <template #append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <q-input
          v-model="userData.confirmPassword"
          borderless
          dense
          filled
          :type="isPwd ? 'password' : 'text'"
          label="Reconfirm Password"
          :rules="[validateConfirmPassword]"
        >
          <template #append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <q-btn
          no-caps
          class="q-mb-md"
          color="primary"
          type="submit"
          icon="add"
          label="Save User"
        />
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent, ref } from "vue";
import axios from "../axios";

export default defineComponent({
  name: "ComponentAddUpdateUser",
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
    const userData = ref({
      _id: "",
      name: "",
      role: "",
      password: "",
      confirmPassword: "",
    });

    return {
      disableColor,
      isPwd: ref(true),
      beingUpdated,
      roles,
      userData,
      addUserForm,
    };
  },
  created() {
    if (this.user && this.user.id) {
      this.beingUpdated = true;
      this.disableColor = "grey-5";
      this.userData = {
        _id: this.user.id,
        name: this.user.name,
        role: this.user.role,
        password: "",
        confirmPassword: "",
      };
    }
  },
  methods: {
    validateUserID(data) {
      if (data.length < 3) {
        return "User ID must be at least 3 characters long";
      }
    },
    validateUserName(data) {
      if (data.length < 3) {
        return "User name must be at least 3 characters long";
      }
    },
    validateUserRole(data) {
      if (data.length < 3) {
        return "You must select a role";
      }
    },
    validatePassword(data) {
      if (this.beingUpdated && data.length == 0) {
        return true;
      }
      if (data.length < 8) {
        return "Your password must be at least 8 characters";
      }
      if (data.search(/[a-z]/i) < 0) {
        return "Your password must contain at least one letter.";
      }
      if (data.search(/[0-9]/) < 0) {
        return "Your password must contain at least one digit.";
      }
      return true;
    },
    validateConfirmPassword(data) {
      if (data !== this.userData.password) {
        return "Password and Confirmation password should match.";
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
          .put(this.$store.state.API_ENDPOINT + "api/user", this.userData)
          .then((response) => {
            var data = response.data;
            this.userData = {
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
