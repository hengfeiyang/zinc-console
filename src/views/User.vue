<template>
  <q-page class="q-pa-md">
    <q-table
      title="Users"
      :rows="users"
      row-key="id"
      :pagination="pagination"
      :filter="filterQuery"
      :filter-method="filterUser"
    >
      <template #top-right>
        <q-input
          v-model="filterQuery"
          filled
          borderless
          dense
          debounce="1"
          placeholder="Search user"
          class="search-user"
        >
          <template #append>
            <q-icon name="search" class="cursor-pointer" />
          </template>
        </q-input>
        <q-btn class="add-button q-ml-sm" color="secondary" @click="addUser">
          <q-icon name="add" />
          Add User
        </q-btn>
      </template>

      <template v-slot:body-cell-#="props">
        <q-td :props="props" width="80">
          {{ props.value }}
        </q-td>
      </template>

      <template #header-cell-operation>
        <q-th></q-th>
      </template>
      <template #body-cell-operation="props">
        <q-td :props="props" auto-width>
          <q-btn
            dense
            size="sm"
            color="secondary"
            class="action-button"
            icon="edit"
            @click="editUser(props)"
          />
          <q-btn
            dense
            size="sm"
            color="negative"
            class="action-button q-ml-sm"
            icon="delete"
            @click="deleteUser(props)"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="showUserAddDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Add User</div>
        </q-card-section>
        <q-card-section class="user-dialog">
          <add-update-user @userAdded="userAdded" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showUserUpdateDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Update User</div>
        </q-card-section>
        <q-card-section class="user-dialog">
          <add-update-user :user="user" @userUpdated="userUpdated" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import axios from "../axios";

import AddUpdateUser from "../components/AddUpdateUser.vue";

export default defineComponent({
  name: "PageUser",

  components: {
    AddUpdateUser,
  },

  setup() {
    const store = useStore();
    const $q = useQuasar();

    const users = ref([]);
    const getUsers = () => {
      axios.get(store.state.API_ENDPOINT + "api/users").then((response) => {
        var counter = 1;
        users.value = response.data.hits.hits.map((data) => {
          return {
            "#": counter++,
            id: data._source._id,
            name: data._source.name || data._source._id,
            role: data._source.role,
            Created: data._source.created_at,
            Updated: data._source["@timestamp"],
            operation: "",
          };
        });
      });
    };

    getUsers();

    const user = ref({});
    const showUserAddDialog = ref(false);
    const showUserUpdateDialog = ref(false);

    const addUser = () => {
      showUserAddDialog.value = true;
    };
    const editUser = (props) => {
      user.value = {
        id: props.row.id,
        name: props.row.name,
        role: props.row.role,
      };
      showUserUpdateDialog.value = true;
    };
    const deleteUser = (props) => {
      $q.dialog({
        title: "Confirm User Delete",
        message:
          "Do you want to delete user " +
          props.row.id +
          "?" +
          " This action cannot be undone.",
        cancel: true,
        persistent: true,
      }).onOk(() => {
        axios
          .delete(store.state.API_ENDPOINT + "api/user/" + props.row.id)
          .then(() => {
            getUsers();
          });
      });
    };

    return {
      user,
      showUserAddDialog,
      showUserUpdateDialog,
      users,
      getUsers,
      pagination: {
        rowsPerPage: 20,
      },
      filterQuery: ref(""),
      filterUser(rows, terms) {
        var filtered = [];
        terms = terms.toLowerCase();
        for (var i = 0; i < rows.length; i++) {
          if (rows[i]["name"].toLowerCase().includes(terms)) {
            filtered.push(rows[i]);
          }
        }
        return filtered;
      },
      addUser,
      editUser,
      deleteUser,
      userAdded() {
        showUserAddDialog.value = false;
        getUsers();
      },
      userUpdated() {
        showUserUpdateDialog.value = false;
        getUsers();
      },
    };
  },
});
</script>

<style lanng="scss">
.user-dialog {
  width: 400px;
}
</style>
