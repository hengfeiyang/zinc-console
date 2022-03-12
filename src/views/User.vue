<template>
  <q-page class="q-pa-md">
    <q-table
      title="Users"
      :rows="users"
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
          placeholder="Search user"
        >
          <template #append>
            <q-icon name="search" class="cursor-pointer" />
          </template>
        </q-input>
        <q-btn
          class="q-ml-sm"
          color="primary"
          icon="add"
          label="Add User"
          @click="addUser"
        />
      </template>

      <template v-slot:body-cell-#="props">
        <q-td :props="props" width="80">
          {{ props.value }}
        </q-td>
      </template>
      <template #body-cell-actions="props">
        <q-td :props="props" auto-width>
          <q-btn
            dense
            unelevated
            size="sm"
            color="teal-5"
            class="action-button"
            icon="edit"
            @click="editUser(props)"
          />
          <q-btn
            dense
            unelevated
            size="sm"
            color="red-5"
            class="action-button q-ml-sm"
            icon="delete"
            @click="deleteUser(props)"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="showAddUserDialog">
      <add-update-user @updated="userAdded" />
    </q-dialog>

    <q-dialog v-model="showUpdateUserDialog">
      <add-update-user v-model="user" @updated="userUpdated" />
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useQuasar, date } from "quasar";
import axios from "../axios";

import AddUpdateUser from "../components/AddUpdateUser.vue";

export default defineComponent({
  name: "PageUser",
  components: {
    AddUpdateUser,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const $q = useQuasar();

    const users = ref([]);
    const getUsers = () => {
      axios
        .get(store.state.API_ENDPOINT + "api/users")
        .then((response) => {
          var counter = 1;
          users.value = response.data.hits.hits.map((data) => {
            return {
              "#": counter++,
              id: data._source._id,
              name: data._source.name || data._source._id,
              role: data._source.role,
              created: date.formatDate(
                data._source.created_at,
                "YYYY-MM-DDTHH:mm:ssZ"
              ),
              updated: date.formatDate(
                data._source["@timestamp"],
                "YYYY-MM-DDTHH:mm:ssZ"
              ),
              actions: "",
            };
          });
        })
        .catch((err) => {
          if (err && err.response.status == 401) {
            store.dispatch("logout");
            localStorage.setItem("creds", "");
            router.push("/login");
          }
        });
    };

    getUsers();

    const user = ref({});
    const showAddUserDialog = ref(false);
    const showUpdateUserDialog = ref(false);

    const addUser = () => {
      showAddUserDialog.value = true;
    };
    const editUser = (props) => {
      user.value = {
        id: props.row.id,
        name: props.row.name,
        role: props.row.role,
      };
      showUpdateUserDialog.value = true;
    };
    const deleteUser = (props) => {
      $q.dialog({
        title: "Delete user",
        message:
          "You are about to delete this user: <ul><li>" +
          props.row.id +
          "</li></ul>",
        cancel: true,
        persistent: true,
        html: true,
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
      showAddUserDialog,
      showUpdateUserDialog,
      users,
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
      addUser,
      editUser,
      deleteUser,
      userAdded() {
        showAddUserDialog.value = false;
        getUsers();
      },
      userUpdated() {
        showUpdateUserDialog.value = false;
        getUsers();
      },
    };
  },
});
</script>
