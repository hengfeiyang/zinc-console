<template>
  <div class="user-from">
    <q-form ref="addUserForm" @submit="onSubmit">
      <q-input
        v-model="userData._id"
        dense
        borderless
        filled
        :readonly="beingUpdated"
        :disabled="beingUpdated"
        :bg-color="uidbgColor"
        type="text"
        label="User ID"
        class="form-field"
        :rules="[validateUserID]"
      />
      <q-input
        v-model="userData.name"
        dense
        borderless
        filled
        type="text"
        label="User Name"
        class="form-field"
        :rules="[validateUserName]"
      />
      <q-select
        v-model="userData.role"
        :options="roles"
        dense
        borderless
        filled
        label="Role"
        class="form-field"
        :rules="[validateUserRole]"
      />
      <q-input
        v-model="userData.password"
        borderless
        dense
        filled
        :type="isPwd ? 'password' : 'text'"
        label="Password"
        class="form-field"
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
        class="form-field"
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
        class="add-button form-field q-mb-md"
        color="secondary"
        type="submit"
      >
        <q-icon name="add" />
        <span v-if="beingUpdated">Update User</span>
        <span v-else>Add User</span>
      </q-btn>
    </q-form>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import axios from "../axios";

export default defineComponent({
  props: {
    user: {
      type: Object,
      default: null,
    },
  },
  emits: ["userAdded", "userUpdated"],
  setup() {
    const beingUpdated = ref(false);
    const roles = ref(["admin", "user"]);
    const addUserForm = ref(null);
    const uidbgColor = ref("");
    const userData = ref({
      _id: "",
      name: "",
      role: "",
      password: "",
      confirmPassword: "",
    });

    return {
      uidbgColor,
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
      this.uidbgColor = "grey-5";
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
              this.$emit("userUpdated", data);
            } else {
              this.$emit("userAdded", data);
            }
            this.$emit("userAdded", data);
            this.addUserForm.resetValidation();
          });
      });
    },
  },
});
</script>
